# Quick Deployment Guide

## ✅ Your Backend Configuration

```
API Gateway URL: https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod
User Pool ID: us-east-1_Tx8ircMe3
User Pool Client ID: 29t53abnqk73vb88e8g0h903g5
Region: us-east-1
```

## Step 1: Create .env File

Create a `.env` file in the `trello-app-frontend` folder with:

```bash
REACT_APP_USER_POOL_ID=us-east-1_Tx8ircMe3
REACT_APP_USER_POOL_CLIENT_ID=29t53abnqk73vb88e8g0h903g5
REACT_APP_API_URL=https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_AWS_REGION=us-east-1
```

**Windows PowerShell:**
```powershell
@"
REACT_APP_USER_POOL_ID=us-east-1_Tx8ircMe3
REACT_APP_USER_POOL_CLIENT_ID=29t53abnqk73vb88e8g0h903g5
REACT_APP_API_URL=https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_AWS_REGION=us-east-1
"@ | Out-File -FilePath .env -Encoding utf8
```

**Linux/Mac:**
```bash
cat > .env << EOF
REACT_APP_USER_POOL_ID=us-east-1_Tx8ircMe3
REACT_APP_USER_POOL_CLIENT_ID=29t53abnqk73vb88e8g0h903g5
REACT_APP_API_URL=https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_AWS_REGION=us-east-1
EOF
```

## Step 2: Test Locally

```bash
npm install
npm start
```

Visit `http://localhost:3000` and test:
- Sign up/Sign in
- Create a task
- Verify it works

## Step 3: Deploy to AWS

### Option A: AWS Amplify (Recommended - 5 minutes)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Go to AWS Amplify Console:**
   - https://console.aws.amazon.com/amplify
   - Click "New app" → "Host web app"
   - Connect your GitHub repo

3. **Add Environment Variables:**
   ```
   REACT_APP_USER_POOL_ID = us-east-1_Tx8ircMe3
   REACT_APP_USER_POOL_CLIENT_ID = 29t53abnqk73vb88e8g0h903g5
   REACT_APP_API_URL = https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod
   REACT_APP_AWS_REGION = us-east-1
   ```

4. **Deploy!** Your app will be live in ~5-10 minutes.

### Option B: S3 + CloudFront (Manual)

```bash
# 1. Build
npm run build

# 2. Create S3 bucket (replace 'your-unique-name')
aws s3 mb s3://trello-app-frontend-your-unique-name --region us-east-1

# 3. Enable static hosting
aws s3 website s3://trello-app-frontend-your-unique-name \
  --index-document index.html \
  --error-document index.html

# 4. Upload files
aws s3 sync build/ s3://trello-app-frontend-your-unique-name --delete

# 5. Make public (create bucket-policy.json first)
aws s3api put-bucket-policy \
  --bucket trello-app-frontend-your-unique-name \
  --policy file://bucket-policy.json
```

Then create CloudFront distribution via AWS Console.

## Step 4: Verify Connection

1. Open your deployed app
2. Sign up/Sign in (uses Cognito)
3. Create a task (saves to DynamoDB via API Gateway)
4. Check browser console (F12) for errors

## Troubleshooting

**CORS Errors?**
- Backend should already have CORS configured
- Verify API Gateway URL is correct (ends with `/prod`)

**Authentication Issues?**
- Verify User Pool ID and Client ID in `.env`
- Check browser console for errors

**Tasks Not Loading?**
- Check API Gateway URL
- Verify backend Lambda functions are working
- Check CloudWatch logs

---

**Need help?** See `DEPLOYMENT_STEPS.md` for detailed instructions.

