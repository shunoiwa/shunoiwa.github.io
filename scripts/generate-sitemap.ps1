param(
    [string]$BaseUrl = "https://shunoiwa.github.io",
    [string]$OutputPath = "sitemap.xml"
)

$ErrorActionPreference = "Stop"

$root = (Resolve-Path ".").Path
$base = $BaseUrl.TrimEnd("/")
$output = Join-Path $root $OutputPath

$htmlFiles = Get-ChildItem -Path $root -Recurse -File -Filter "*.html" |
    Where-Object { $_.FullName -notmatch "\\\.git\\" } |
    Sort-Object FullName

$settings = New-Object System.Xml.XmlWriterSettings
$settings.Indent = $true
$settings.Encoding = New-Object System.Text.UTF8Encoding($false)

$writer = [System.Xml.XmlWriter]::Create($output, $settings)
try {
    $writer.WriteStartDocument()
    $writer.WriteStartElement("urlset", "http://www.sitemaps.org/schemas/sitemap/0.9")

    foreach ($file in $htmlFiles) {
        $relative = $file.FullName.Substring($root.Length).TrimStart("\", "/")
        $relativeUrl = ($relative -replace "\\", "/")

        if ($relativeUrl -ieq "index.html") {
            $loc = "$base/"
        }
        elseif ($relativeUrl -imatch "/index\.html$") {
            $loc = "$base/" + ($relativeUrl -replace "index\.html$", "")
        }
        else {
            $loc = "$base/$relativeUrl"
        }

        $writer.WriteStartElement("url")
        $writer.WriteElementString("loc", $loc)
        $writer.WriteElementString("lastmod", $file.LastWriteTimeUtc.ToString("yyyy-MM-dd"))
        $writer.WriteEndElement()
    }

    $writer.WriteEndElement()
    $writer.WriteEndDocument()
}
finally {
    $writer.Close()
}

Write-Host "Generated $OutputPath with $($htmlFiles.Count) URLs."
