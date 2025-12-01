# Quick Fix for Network Error

## Immediate Solution (5 minutes)

The "Network Error" is most likely a CORS (Cross-Origin Resource Sharing) issue. Here's the quickest fix:

### Option 1: Enable CORS in API Gateway Console (Recommended)

1. **Go to API Gateway Console:**
   - https://console.aws.amazon.com/apigateway
   - Select your API (should be named "TrelloAppApi")

2. **Enable CORS:**
   - Click on "Actions" dropdown (top right)
   - Select "Enable CORS"
   - In the form that appears:
     - **Access-Control-Allow-Origin**: Enter `*` (or your specific domain: `https://main.d2air8nrdryfow.amplifyapp.com`)
     - **Access-Control-Allow-Headers**: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
     - **Access-Control-Allow-Methods**: `GET,POST,PUT,DELETE,OPTIONS`
   - Click **"Enable CORS and replace existing CORS headers"**

3. **Deploy the API (CRITICAL STEP):**
   - Click "Actions" → **"Deploy API"**
   - Select stage: **`prod`**
   - Click **"Deploy"**
   - Wait 1-2 minutes for deployment to complete

4. **Test:**
   - Go back to your app
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Try loading tasks again

### Option 2: Redeploy Backend with CORS Fix

If you prefer to fix it in code:

1. **Navigate to backend directory:**
   ```bash
   cd trello-app-backend
   ```

2. **Build and deploy:**
   ```bash
   sam build
   sam deploy
   ```

3. **Wait for deployment** (5-10 minutes)

4. **Test your app again**

## Verify API Gateway is Accessible

Test if your API Gateway is working:

```bash
# Test OPTIONS (CORS preflight) - should return 200
curl -X OPTIONS https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod/tasks \
  -H "Origin: https://main.d2air8nrdryfow.amplifyapp.com" \
  -v

# If you get a response with CORS headers, the API is working
```

## Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to load tasks
4. Look for the failed request to `/tasks`
5. Check:
   - **Status**: Should be 200, 401, or 403 (not 0)
   - **Response Headers**: Should include `Access-Control-Allow-Origin`
   - **Request Headers**: Should include `Authorization: Bearer ...`

## Common Issues

### Status 0 (Network Error)
- API Gateway not accessible
- CORS not configured
- API Gateway not deployed

### Status 401 (Unauthorized)
- Authentication token missing or invalid
- Token expired (try signing out and back in)

### Status 403 (Forbidden)
- CORS not configured
- OPTIONS request blocked by authorizer

### Status 500 (Server Error)
- Lambda function error
- Check CloudWatch logs

## Still Not Working?

1. **Verify API Gateway URL:**
   - Go to API Gateway Console
   - Select your API
   - Check the "Invoke URL" in the prod stage
   - Should match: `https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod`

2. **Check Environment Variables:**
   - AWS Amplify Console → Your App → Environment variables
   - Verify `REACT_APP_API_URL` is set correctly

3. **Check CloudWatch Logs:**
   - Go to CloudWatch → Log Groups
   - Find `/aws/lambda/GetTasksFunction`
   - Check for errors

4. **Test API directly:**
   - Use Postman or curl with a valid auth token
   - If it works there but not in browser, it's definitely CORS

## Need More Help?

See detailed troubleshooting guide: `trello-app-backend/CORS_TROUBLESHOOTING.md`

