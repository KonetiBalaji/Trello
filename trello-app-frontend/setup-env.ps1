# PowerShell script to create .env file for frontend deployment

$envContent = @"
REACT_APP_USER_POOL_ID=us-east-1_Tx8ircMe3
REACT_APP_USER_POOL_CLIENT_ID=29t53abnqk73vb88e8g0h903g5
REACT_APP_API_URL=https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_AWS_REGION=us-east-1
"@

$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline

Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  User Pool ID: us-east-1_Tx8ircMe3"
Write-Host "  Client ID: 29t53abnqk73vb88e8g0h903g5"
Write-Host "  API URL: https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod"
Write-Host "  Region: us-east-1"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test locally: npm start"
Write-Host "  2. Deploy: See QUICK_DEPLOY.md or DEPLOYMENT_STEPS.md"
Write-Host ""

