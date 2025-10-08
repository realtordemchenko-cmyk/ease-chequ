# git-admin-sync.ps1
# Автоматическая фиксация изменений и создание тега admin-sync-YYYY-MM-DD

$today = Get-Date -Format "yyyy-MM-dd"
$tagName = "admin-sync-$today"

Write-Host ">>> Создаём коммит и тег: $tagName"

git add -A
git commit -m "admin: daily sync $today" --allow-empty
git tag -a $tagName -m "Ежедневная синхронизация admin-документации и структуры ($today)"
git push origin HEAD
git push origin $tagName

Write-Host ">>> Done! Tag $tagName created and pushed."