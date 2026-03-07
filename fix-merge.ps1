# Quick fix for Git merge conflicts

Write-Host "Fixing merge conflicts..." -ForegroundColor Yellow

# Fix LoginPage.js
$file1 = "frontend\src\pages\LoginPage.js"
$content1 = Get-Content $file1 -Raw
$content1 = $content1 -replace '(?s)<<<<<<< HEAD.*?=======(.*?)>>>>>>> [^\r\n]+', '$1'
$content1 | Set-Content $file1 -NoNewline
Write-Host "Fixed LoginPage.js" -ForegroundColor Green

# Fix RegisterPage.js
$file2 = "frontend\src\pages\RegisterPage.js"
$content2 = Get-Content $file2 -Raw
$content2 = $content2 -replace '(?s)<<<<<<< HEAD.*?=======(.*?)>>>>>>> [^\r\n]+', '$1'
$content2 | Set-Content $file2 -NoNewline
Write-Host "Fixed RegisterPage.js" -ForegroundColor Green

# Fix api.js
$file3 = "frontend\src\services\api.js"
$content3 = Get-Content $file3 -Raw
$content3 = $content3 -replace '(?s)<<<<<<< HEAD.*?=======(.*?)>>>>>>> [^\r\n]+', '$1'
$content3 | Set-Content $file3 -NoNewline
Write-Host "Fixed api.js" -ForegroundColor Green

Write-Host "All conflicts resolved!" -ForegroundColor Cyan
