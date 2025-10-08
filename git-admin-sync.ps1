# git-admin-sync.ps1
# Автоматическая фиксация изменений и создание уникального тега admin-sync-YYYY-MM-DD[-vN]

$today = Get-Date -Format "yyyy-MM-dd"
$baseTag = "admin-sync-$today"
$tagName = $baseTag
$counter = 2

# Проверяем, существует ли тег
while (git tag --list $tagName) {
    $tagName = "$baseTag-v$counter"
    $counter++
}

Write-Host ">>> Создаём коммит и тег: $tagName"

# Добавляем все изменения
git add -A

# Делаем коммит (даже если пустой)
git commit -m "admin: daily sync $today" --allow-empty

# Создаём тег
git tag -a $tagName -m "Ежедневная синхронизация admin-документации и структуры ($today)"

# Отправляем изменения и тег
git push origin HEAD
git push origin $tagName

Write-Host ">>> Done! Tag $tagName created and pushed."