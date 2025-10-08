# Скрипт: send_manifest.ps1
# Что делает: читает WORKFLOW_MANIFEST.md, формирует текст "Вернись к манифесту:" + содержимое,
# выводит в консоль и копирует в clipboard. Не отправляет ничего в интернет.
# Как использовать: запустить .\send_manifest.ps1 в PowerShell; текст будет скопирован в буфер.

param(
    [string]$ManifestPath = "D:\Projects\Ease Chequ\WORKFLOW_MANIFEST.md",
    [switch]$NoClipboard  # если указать, то не копировать в буфер
)

# Проверка наличия файла
if (-not (Test-Path -Path $ManifestPath)) {
    Write-Host "Файл манифеста не найден: $ManifestPath" -ForegroundColor Red
    Write-Host "Создайте WORKFLOW_MANIFEST.md по пути или укажите другой путь параметром -ManifestPath" -ForegroundColor Yellow
    exit 1
}

# Чтение содержимого (UTF8)
try {
    $manifestContent = Get-Content -Path $ManifestPath -Raw -Encoding UTF8
}
catch {
    Write-Host "Не удалось прочитать файл манифеста: $_" -ForegroundColor Red
    exit 2
}

# Формируем payload для чата
$payload = @"
Вернись к манифесту:
$manifestContent
"@

# Выводим краткое уведомление и полный payload
Write-Host "=== Манифест сформирован. Ниже — текст для вставки в чат. ===" -ForegroundColor Green
Write-Host $payload

# Копируем в буфер обмена (если доступно)
if (-not $NoClipboard) {
    try {
        Set-Clipboard -Value $payload
        Write-Host "`nСодержимое скопировано в буфер обмена. Вставьте в чат (Ctrl+V)." -ForegroundColor Cyan
    }
    catch {
        Write-Host "`nНе удалось скопировать в буфер обмена. Используйте выделение и копирование вручную." -ForegroundColor Yellow
    }
}
else {
    Write-Host "Параметр -NoClipboard задан: копирование в clipboard пропущено." -ForegroundColor Yellow
}

exit 0