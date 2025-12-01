# AWS Amplify Environment Variables Setup

## ⚠️ Configuration Error Fix

If you're seeing the error: **"Configuration error (see console) – please contact the administrator"**, it means the environment variables are not configured in AWS Amplify.

## Quick Fix Steps

### 1. Go to AWS Amplify Console
- Navigate to: https://console.aws.amazon.com/amplify
- Select your app (the one deployed at `main.d2air8nrdryfow.amplifyapp.com`)

### 2. Add Environment Variables
1. Click on your app
2. In the left sidebar, click **"Environment variables"** (under "App settings")
3. Click **"Manage variables"** or **"Add variable"**
4. Add the following **4 environment variables**:

```
REACT_APP_USER_POOL_ID = us-east-1_Tx8ircMe3
REACT_APP_USER_POOL_CLIENT_ID = 29t53abnqk73vb88e8g0h903g5
REACT_APP_API_URL = https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_AWS_REGION = us-east-1
```

### 3. Redeploy
After adding the variables:
1. Click **"Redeploy this version"** (if available), OR
2. Go to the **"Deployments"** tab
3. Click **"Redeploy"** on the latest deployment, OR
4. Make a small change and push to your repository to trigger a new build

### 4. Wait for Build
- The build will take 5-10 minutes
- Once complete, refresh your app at `main.d2air8nrdryfow.amplifyapp.com`
- The configuration error should be gone!

## Verification

After deployment, you should be able to:
- ✅ See the sign-in/create account form without errors
- ✅ Create a new account
- ✅ Sign in with your credentials
- ✅ Create and manage tasks

## Troubleshooting

### Still seeing the error?
1. **Check the browser console** (F12) for detailed error messages
2. **Verify variables are set correctly** in Amplify Console
3. **Ensure you redeployed** after adding variables
4. **Check build logs** in Amplify Console → Deployments → Latest build

### Variables not persisting?
- Make sure you're adding them to the correct branch (usually `main`)
- Check if you have multiple environments (production vs. preview)

## Alternative: Update via AWS CLI

If you prefer using CLI:

```bash
aws amplify update-app --app-id <your-app-id> \
  --environment-variables \
    REACT_APP_USER_POOL_ID=us-east-1_Tx8ircMe3,\
    REACT_APP_USER_POOL_CLIENT_ID=29t53abnqk73vb88e8g0h903g5,\
    REACT_APP_API_URL=https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod,\
    REACT_APP_AWS_REGION=us-east-1
```

Then trigger a redeploy:
```bash
aws amplify start-job --app-id <your-app-id> --branch-name main --job-type RELEASE
```

