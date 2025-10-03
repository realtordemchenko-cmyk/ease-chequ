# AutoUpdate-FailedTests.ps1 — analyze failed tests, show diff, give recommendation, ask Y/N,
# log decisions with Type=Production/Scaffold classification

$payloadsPath = "D:\Projects\Ease Chequ\Tests\payloads"
$actualPath   = "D:\Projects\Ease Chequ\Tests\actual"
$reportPath   = "D:\Projects\Ease Chequ\Tests\reports\junit-report.xml"
$auditLog     = "D:\Projects\Ease Chequ\Tests\reports\audit-log.txt"

# Ensure audit log exists
if (-not (Test-Path $auditLog)) {
    New-Item -ItemType File -Path $auditLog -Force | Out-Null
}

# Load JUnit
[xml]$junit = Get-Content $reportPath

function Show-Diff($expected, $actual) {
    Write-Host "`n--- Expected ---" -ForegroundColor Yellow
    Write-Host $expected
    Write-Host "`n--- Actual ---" -ForegroundColor Cyan
    Write-Host $actual
}

function Get-Recommendation($expected, $actual) {
    $dynamicFields = @("trace-id","timestamp","request-id","x-request-start","server-time","etag")

    $recommendation = "Update"
    $reason = "API response structure changed."
    $consequenceY = "Tests will align with current API behavior."
    $consequenceN = "Tests will continue to fail until updated."

    foreach ($field in $dynamicFields) {
        if ($expected -match $field -or $actual -match $field) {
            $recommendation = "Do NOT update"
            $reason = "Difference found only in dynamic field: $field"
            $consequenceY = "Risk: hiding regressions due to dynamic fields."
            $consequenceN = "Strict validation preserved; address dynamic fields explicitly."
            break
        }
    }

    return @{
        recommendation = $recommendation
        reason = $reason
        consequenceY = $consequenceY
        consequenceN = $consequenceN
    }
}

function Get-GroupFromPath($fullName, $rootPath) {
    $relative = Resolve-Path $fullName | ForEach-Object { $_.Path }
    $relative = $relative.Replace($rootPath, "").TrimStart("\")
    $parts = $relative.Split("\")
    if ($parts.Length -ge 2) { return $parts[0] } else { return "root" }
}

function Get-TestType($testName) {
    $productionTests = @("AuthCheck","HealthCheck","UserInfo","InvalidRoute","LiveEcho","PingTest")
    if ($productionTests -contains $testName) { return "Production" } else { return "Scaffold" }
}

# Counters
$analyzed = 0
$logged   = 0
$prodLogged = 0
$scafLogged = 0

foreach ($testcase in $junit.testsuite.testcase) {
    $name = $testcase.name
    $failure = $testcase.failure

    if ($failure) {
        $analyzed++
        Write-Host "`n❌ Test '$name' failed. Analyzing..." -ForegroundColor Red

        $payloadFile = Get-ChildItem -Path $payloadsPath -Recurse -Filter "$name.json" | Select-Object -First 1
        $actualFile  = Join-Path $actualPath "$name.actual.json"

        if ($payloadFile -and (Test-Path $actualFile)) {
            $payloadRaw = Get-Content $payloadFile.FullName -Raw
            try {
                $payload = $payloadRaw | ConvertFrom-Json
            } catch {
                Write-Host "⚠️ Payload JSON is invalid for '$name': $($_.Exception.Message)" -ForegroundColor DarkYellow
                continue
            }

            $expectedObj = $payload.expectedResponse
            $expectedStr = $expectedObj | ConvertTo-Json -Depth 10
            $actualStr   = Get-Content $actualFile -Raw

            Show-Diff $expectedStr $actualStr

            $rec = Get-Recommendation $expectedStr $actualStr
            Write-Host "`nRecommendation: $($rec.recommendation)" -ForegroundColor Green
            Write-Host "Reason: $($rec.reason)" -ForegroundColor Yellow
            Write-Host "If YES: $($rec.consequenceY)" -ForegroundColor Cyan
            Write-Host "If NO:  $($rec.consequenceN)" -ForegroundColor Magenta

            $group = Get-GroupFromPath $payloadFile.FullName $payloadsPath
            $type  = Get-TestType $name

            $choice = Read-Host "`nDo you want to update expectedResponse in $($payloadFile.Name)? (Y/N)"

            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            $logEntry = "[$timestamp] User=Alexey | Group=$group | Test=$name | Type=$type | Choice=$choice | Recommendation=$($rec.recommendation) | Reason=$($rec.reason)"
            Add-Content -Path $auditLog -Value $logEntry
            $logged++
            if ($type -eq "Production") { $prodLogged++ } else { $scafLogged++ }

            if ($choice -eq "Y") {
                try {
                    $actualObj = $actualStr | ConvertFrom-Json
                    $payload.expectedResponse = $actualObj
                    $payload | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 $payloadFile.FullName
                    Write-Host "✅ expectedResponse updated in $($payloadFile.FullName)" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️ Failed to parse actual JSON for '$name': $($_.Exception.Message)" -ForegroundColor DarkYellow
                }
            } else {
                Write-Host "⏩ Skipped update for $name" -ForegroundColor DarkYellow
            }
        } else {
            Write-Host "⚠️ Missing files for test '$name'. Cannot auto-update." -ForegroundColor DarkYellow
        }
    }
}

Write-Host "`n===== SUMMARY =====" -ForegroundColor White
Write-Host "Analyzed tests : $analyzed" -ForegroundColor White
Write-Host "Decisions logged: $logged (see $auditLog)" -ForegroundColor White
Write-Host "Production decisions: $prodLogged" -ForegroundColor Green
Write-Host "Scaffold decisions  : $scafLogged" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor White