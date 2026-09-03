# CartCraze Automated APK Build & Sync Helper
Write-Host "=========================================" -ForegroundColor Green
Write-Host " 🚀 CartCraze Mobile APK Build Helper" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# 1. Build Web Assets
Write-Host "`n[1/3] Building Web Production Bundle..." -ForegroundColor Yellow
Set-Location "c:\Users\sahoo\Downloads\FreshCart1\user"
npx vite build

# 2. Sync with Capacitor Android Project
Write-Host "`n[2/3] Syncing with Android Native Platform..." -ForegroundColor Yellow
npx cap sync android

# 3. Output Guidance
Write-Host "`n[3/3] Android Native Project Ready!" -ForegroundColor Green
Write-Host "To generate your final .apk file:" -ForegroundColor Cyan
Write-Host " 1. Open Android Studio." -ForegroundColor White
Write-Host " 2. Select 'Open Folder' -> Navigate to 'c:\Users\sahoo\Downloads\FreshCart1\android_app' OR 'c:\Users\sahoo\Downloads\FreshCart1\user\android'." -ForegroundColor White
Write-Host " 3. Click 'Build' -> 'Build Bundle(s) / APK(s)' -> 'Build APK(s)'." -ForegroundColor White
Write-Host " 4. Your compiled .apk will be saved in 'app/build/outputs/apk/debug/app-debug.apk'!" -ForegroundColor White
Write-Host "`nReady!" -ForegroundColor Green
