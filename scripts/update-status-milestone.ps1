$path = Join-Path $PSScriptRoot '..\status\status.json'
$json = Get-Content -LiteralPath $path -Raw -Encoding UTF8 | ConvertFrom-Json
$json.updatedAt = '2026-10-12T19:30:00.000+03:30'
$json.currentTask = 'Catalog media completion and robot-cutting reference review'
$json.nextTask = 'Review remaining catalog data before independent previews'
$json.tasks[1].status = 'Active: 58 studio images, 10 articles, 34 manufacturer references, 8 user series records, 5 user artwork records'
$json.reports += [pscustomobject]@{
  at = '2026-10-12T19:30:00.000+03:30'
  text = 'Added a reviewed conceptual custom-size fiber-cutter image with explicit family/configuration scope. Rebuilt catalog progress: 106 products, 58 studio images, 48 sourced-specification records, 34 manufacturer references, 10 articles; local catalog and comparison tests pass and release gate remains open.'
}
$json | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath $path -Encoding UTF8