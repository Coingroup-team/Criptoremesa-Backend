# PowerShell script to run all 3 Criptoremesa backend processes
Write-Host "Starting Criptoremesa Backend Services..." -ForegroundColor Green

# Change to the correct directory
Set-Location "c:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend"

# Start API Server in background job
Write-Host "Starting API Server..." -ForegroundColor Yellow
Start-Job -Name "API-Server" -ScriptBlock { 
    Set-Location "c:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend"
    npm run start:api 
}

# Start Remittance Worker in background job
Write-Host "Starting Remittance Worker..." -ForegroundColor Yellow
Start-Job -Name "Remittance-Worker" -ScriptBlock { 
    Set-Location "c:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend"
    npm run start:rem 
}

# Start SILT Worker in background job
Write-Host "Starting SILT Worker..." -ForegroundColor Yellow
Start-Job -Name "SILT-Worker" -ScriptBlock { 
    Set-Location "c:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend"
    npm run start:silt 
}

Write-Host "`nAll services started as background jobs!" -ForegroundColor Green
Write-Host "Use 'Get-Job' to see status" -ForegroundColor Cyan
Write-Host "Use 'Receive-Job -Name <JobName>' to see output" -ForegroundColor Cyan
Write-Host "Use 'Stop-Job -Name <JobName>' to stop a service" -ForegroundColor Cyan

# Show job status
Start-Sleep 3
Get-Job
