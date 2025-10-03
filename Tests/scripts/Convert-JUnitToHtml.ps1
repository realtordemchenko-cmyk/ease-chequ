[xml]$junit = Get-Content "D:\Projects\Ease Chequ\Tests\reports\junit-report.xml"

$html = @'
<html>
<head>
  <title>API Test Report</title>
  <style>
    body { font-family: Arial; margin: 20px; }
    h1 { color: #333; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .pass { background-color: #d4edda; }
    .fail { background-color: #f8d7da; }
  </style>
</head>
<body>
  <h1>API Test Report</h1>
  <table>
    <tr><th>Test Name</th><th>Status</th><th>Details</th></tr>
'@

foreach ($testcase in $junit.testsuite.testcase) {
    $name = $testcase.name
    $failure = $testcase.failure
    if ($failure) {
        $status = "Failed"
        $class = "fail"
        $details = $failure.InnerText
    } else {
        $status = "Passed"
        $class = "pass"
        $details = ""
    }
    $html += "<tr class='$class'><td>$name</td><td>$status</td><td>$details</td></tr>`n"
}

$html += @'
  </table>
</body>
</html>
'@

$outPath = "D:\Projects\Ease Chequ\Tests\reports\junit-report.html"
$html | Out-File -Encoding UTF8 $outPath
Start-Process $outPath