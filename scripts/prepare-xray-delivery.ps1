param()
# JPEG delivery derivative only; preserve the generated master and original references.
Add-Type -AssemblyName System.Drawing
$catalogRoot=Split-Path $PSScriptRoot -Parent
$xrayFolder=Join-Path $catalogRoot 'assets/catalog-v2/CP-RAY-BM110'
$xrayMaster=[Drawing.Image]::FromFile((Join-Path $xrayFolder 'xray-review-v3.png'))
try {
  $jpegCodec=[Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
  $jpegOptions=New-Object Drawing.Imaging.EncoderParameters 1
  $jpegOptions.Param[0]=New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality),([long]88)
  try { $xrayMaster.Save((Join-Path $xrayFolder 'xray-web-v3.jpg'),$jpegCodec,$jpegOptions) } finally { $jpegOptions.Dispose() }
} finally { $xrayMaster.Dispose() }

