# AutoFix-FailedTests.ps1 — fetch actual API responses for failed tests and save snapshots

$payloadsPath = "D:\Projects\Ease Chequ\Tests\payloads"
$actualPath   = "D:\Projects\Ease Chequ\Tests\actual"
$reportPath   = "D:\Projects\Ease Chequ\Tests\reports\junit-report.xml"

# Ensure actual directory exists
if (-not (Test-Path $actualPath)) {
    New-Item -ItemType Directory -Path $actualPath -Force | Out-Null
}

# Load JUnit report
[xml]$junit = Get-Content $reportPath

function Get-Headers($payload) {
    $headers = @{}
    if ($payload.PSObject.Properties.Name -contains "headers") {
        foreach ($key in $payload.headers.PSObject.Properties.Name) {
            $headers[$key] = $payload.headers.$key
        }
    }
    return $headers
}

function Get-ContentType($headers) {
    if ($headers.ContainsKey("Content-Type")) { return $headers["Content-Type"] }
    return "application/json"
}

function Invoke-Http($method, $uri, $headers, $body, $timeoutSec = 20, $retries = 2) {
    $attempt = 0
    $lastError = $null
    while ($attempt -le $retries) {
        try {
            $invokeParams = @{
                Uri         = $uri
                Method      = $method
                Headers     = $headers
                TimeoutSec  = $timeoutSec
                ErrorAction = "Stop"
            }
            if ($body) { $invokeParams.Body = $body }
            $resp = Invoke-RestMethod @invokeParams
            return @{ ok=$true; data=$resp; status=200 }
        } catch {
            $lastError = $_
            $attempt++
            if ($attempt -le $retries) {
                Start-Sleep -Seconds ([Math]::Min(2 * $attempt, 5))
            } else {
                $statusCode = $null
                $webResp = $lastError.Exception.Response
                if ($webResp -and $webResp.StatusCode.Value__) { $statusCode = $webResp.StatusCode.Value__ }
                return @{ ok=$false; error=$lastError; status=$statusCode }
            }
        }
    }
}

$fixed = 0
$skipped = 0

foreach ($testcase in $junit.testsuite.testcase) {
    $name = $testcase.name
    $failure = $testcase.failure

    if ($failure) {
        Write-Host "`n🔎 Fetching actual response for failed test '$name'..." -ForegroundColor Yellow

        $payloadFile = Get-ChildItem -Path $payloadsPath -Recurse -Filter "$name.json" | Select-Object -First 1
        if (-not $payloadFile) {
            Write-Host "⚠️ Payload file not found for '$name'. Skipping." -ForegroundColor DarkYellow
            $skipped++
            continue
        }

        $payloadRaw = Get-Content $payloadFile.FullName -Raw
        try {
            $payload = $payloadRaw | ConvertFrom-Json
        } catch {
            Write-Host "⚠️ Invalid JSON in payload for '$name': $($_.Exception.Message)" -ForegroundColor DarkYellow
            $skipped++
            continue
        }

        $headers     = Get-Headers $payload
        $contentType = Get-ContentType $headers
        $method      = ($payload.method ?? "GET").ToUpper()
        $uri         = $payload.url

        $body = $null
        if ($payload.body -and $payload.body.PSObject.Properties.Count -gt 0) {
            if ($contentType -like "application/json*") {
                $body = $payload.body | ConvertTo-Json -Depth 20
            } else {
                $body = $payload.body
            }
        }

        $resp = Invoke-Http -method $method -uri $uri -headers $headers -body $body

        if ($resp.ok) {
            $actualFile = Join-Path $actualPath "$name.actual.json"
            $resp.data | ConvertTo-Json -Depth 20 | Out-File -Encoding UTF8 $actualFile
            Write-Host "✅ Actual response saved to $actualFile" -ForegroundColor Green
            $fixed++
        } else {
            Write-Host "⚠️ Failed to fetch actual response for '$name': $($resp.error.Exception.Message)" -ForegroundColor DarkYellow
            $skipped++
        }
    }
}

Write-Host "`n===== SUMMARY =====" -ForegroundColor White
Write-Host "Actual responses saved: $fixed" -ForegroundColor Green
Write-Host "Skipped (errors/missing): $skipped" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor White