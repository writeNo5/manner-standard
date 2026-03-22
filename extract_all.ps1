$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$workbook = $excel.Workbooks.Open($args[0])
for ($i = 1; $i -le 3; $i++) {
    $worksheet = $workbook.Sheets.Item($i)
    $csvPath = $args[1] + "_sheet" + $i + ".csv"
    $worksheet.SaveAs($csvPath, 6)
}
$workbook.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
