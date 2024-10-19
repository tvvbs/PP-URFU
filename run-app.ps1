Set-Location .\WebApplication1
start powershell {dotnet run}

Set-Location ..\Frontend
npm install
start powershell {npm run dev}
Set-Location ..