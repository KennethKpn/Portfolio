@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "Desk 95 server" /min cmd /c "py -m http.server 4173"
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "Desk 95 server" /min cmd /c "python -m http.server 4173"
  ) else (
    echo Python 3 is required. You can also open index.html directly.
    pause
    exit /b 1
  )
)
timeout /t 1 /nobreak >nul
start "" http://127.0.0.1:4173
endlocal
