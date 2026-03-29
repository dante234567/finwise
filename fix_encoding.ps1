$content = Get-Content 'flowapp\src\pages\Negocio.jsx' -Raw -Encoding UTF8
$content | Set-Content 'flowapp\src\pages\Negocio.jsx' -Encoding UTF8
