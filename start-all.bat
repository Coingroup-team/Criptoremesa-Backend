@echo off
echo Starting Criptoremesa Backend Services...

REM Start API Server
start "API Server" cmd /k "npm run start:api"

REM Wait 2 seconds
timeout /t 2 /nobreak > nul

REM Start Remittance Worker
start "Remittance Worker" cmd /k "npm run start:rem"

REM Wait 2 seconds
timeout /t 2 /nobreak > nul

REM Start SILT Worker
start "SILT Worker" cmd /k "npm run start:silt"

echo All services started!
echo.
echo Windows opened:
echo - API Server (Port 3000)
echo - Remittance Worker
echo - SILT Worker
echo.
echo Press any key to exit this launcher...
pause > nul
