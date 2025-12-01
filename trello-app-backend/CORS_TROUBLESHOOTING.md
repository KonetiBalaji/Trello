# CORS Troubleshooting Guide

## Issue: Network Error when connecting to API Gateway

If you're seeing "Network Error: Unable to connect to API at [API_URL]", follow these steps:

## Step 1: Verify API Gateway is Deployed

1. Go to AWS Console → API Gateway
2. Find your API (should be named "TrelloAppApi" or similar)
3. Check that it's deployed to the "prod" stage
4. Note the API Gateway URL (should match your `REACT_APP_API_URL`)

## Step 2: Test API Gateway Directly

Test the API Gateway endpoint using curl or Postman:

```bash
# Test OPTIONS (CORS preflight)
curl -X OPTIONS https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod/tasks \
  -H "Origin: https://main.d2air8nrdryfow.amplifyapp.com" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test GET (requires auth token)
curl -X GET https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -v
```

## Step 3: Check CORS Configuration

1. In API Gateway Console, select your API
2. Go to "Actions" → "Enable CORS"
3. Verify these settings:
   - **Access-Control-Allow-Origin**: `*` (or your specific domain)
   - **Access-Control-Allow-Methods**: `GET,POST,PUT,DELETE,OPTIONS`
   - **Access-Control-Allow-Headers**: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
4. Click "Enable CORS and replace existing CORS headers"
5. **IMPORTANT**: Click "Deploy API" to apply changes

## Step 4: Redeploy Backend

After making CORS changes, redeploy the backend:

```bash
cd trello-app-backend
sam build
sam deploy
```

## Step 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to load tasks
4. Look for the failed request
5. Check:
   - Request URL (should match your API Gateway URL)
   - Request Method (GET, POST, etc.)
   - Status Code (might be 0 for network errors, or 403/401 for auth issues)
   - Response headers (check for CORS headers)

## Step 6: Verify Environment Variables

In AWS Amplify Console:
1. Go to your app
2. App settings → Environment variables
3. Verify `REACT_APP_API_URL` is set to: `https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod`
4. Make sure there are no trailing slashes or extra characters

## Step 7: Check API Gateway Logs

1. Go to CloudWatch → Log Groups
2. Find log group for your API Gateway (usually `/aws/apigateway/[api-name]`)
3. Check for errors related to CORS or authentication

## Common Issues and Solutions

### Issue: OPTIONS request returns 403
**Solution**: The CORS handler Lambda has been added. Redeploy the backend to enable OPTIONS requests without authentication.

### Issue: CORS headers not in response
**Solution**: 
1. Ensure CORS is enabled in API Gateway Console
2. Redeploy the API after enabling CORS
3. Check that Lambda functions return CORS headers in their responses

### Issue: API Gateway returns 401 Unauthorized
**Solution**: 
1. Verify the authentication token is being sent correctly
2. Check that the token is valid and not expired
3. Verify the Cognito User Pool ID matches in frontend config

### Issue: Network Error (no status code)
**Solution**:
1. Verify the API Gateway URL is correct
2. Check if the API Gateway is accessible (try in browser or curl)
3. Check for firewall or network restrictions
4. Verify the API Gateway is deployed to the correct stage

## Quick Fix: Manual CORS Configuration

If automatic CORS isn't working, manually configure in API Gateway Console:

1. Select your API → Resources
2. For each resource (e.g., `/tasks`):
   - Select the resource
   - Click "Actions" → "Enable CORS"
   - Configure:
     - Access-Control-Allow-Origin: `*`
     - Access-Control-Allow-Headers: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
     - Access-Control-Allow-Methods: `GET,POST,PUT,DELETE,OPTIONS`
   - Click "Enable CORS and replace existing CORS headers"
3. **Deploy API** to the `prod` stage

## Testing After Fix

1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Try loading tasks again
4. Check browser console for any remaining errors

