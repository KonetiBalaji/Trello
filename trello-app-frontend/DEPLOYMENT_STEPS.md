# Frontend Deployment Steps - Quick Guide

## ✅ Step 1: Environment Configuration (COMPLETED)

The `.env` file has been created with your backend configuration:
- ✅ User Pool ID: `us-east-1_Tx8ircMe3`
- ✅ User Pool Client ID: `29t53abnqk73vb88e8g0h903g5`
- ✅ API Gateway URL: `https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod`
- ✅ AWS Region: `us-east-1`

## Step 2: Test Locally First

Before deploying, test the connection locally:

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

**Test the connection:**
1. Sign up/Sign in with Cognito
2. Create a task
3. Verify tasks are saved to DynamoDB via API Gateway

## Step 3: Choose Deployment Method

### Option A: AWS Amplify (Easiest - Recommended) ⭐

**Prerequisites:**
- Code pushed to GitHub/GitLab/Bitbucket

**Steps:**

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Frontend ready for deployment"
   git push origin main
   ```

2. **Go to AWS Amplify Console:**
   - Navigate to: https://console.aws.amazon.com/amplify
   - Click "New app" → "Host web app"

3. **Connect Repository:**
   - Choose your Git provider (GitHub, GitLab, etc.)
   - Authorize and select your repository
   - Select the branch (usually `main`)

4. **Configure Build Settings:**
   - Amplify will auto-detect React
   - Add environment variables:
     ```
     REACT_APP_USER_POOL_ID=us-east-1_Tx8ircMe3
     REACT_APP_USER_POOL_CLIENT_ID=29t53abnqk73vb88e8g0h903g5
     REACT_APP_API_URL=https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod
     REACT_APP_AWS_REGION=us-east-1
     ```

5. **Review and Deploy:**
   - Click "Save and deploy"
   - Wait for build to complete (~5-10 minutes)
   - Your app will be live at: `https://<app-id>.amplifyapp.com`

**Benefits:**
- ✅ Automatic CI/CD
- ✅ Free SSL certificate
- ✅ Custom domain support
- ✅ Easy environment variable management

---

### Option B: S3 + CloudFront (Manual Deployment)

**Prerequisites:**
- AWS CLI configured (`aws configure`)

**Steps:**

1. **Build the application:**
   ```bash
   npm run build
   ```
   This creates a `build/` folder with production-ready files.

2. **Create S3 bucket:**
   ```bash
   # Replace 'your-unique-name' with something unique
   aws s3 mb s3://trello-app-frontend-your-unique-name --region us-east-1
   ```

3. **Enable static website hosting:**
   ```bash
   aws s3 website s3://trello-app-frontend-your-unique-name \
     --index-document index.html \
     --error-document index.html
   ```

4. **Upload build files:**
   ```bash
   aws s3 sync build/ s3://trello-app-frontend-your-unique-name --delete
   ```

5. **Set bucket policy for public read:**
   ```bash
   # Create bucket-policy.json
   cat > bucket-policy.json << EOF
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::trello-app-frontend-your-unique-name/*"
       }
     ]
   }
   EOF
   
   # Apply policy
   aws s3api put-bucket-policy \
     --bucket trello-app-frontend-your-unique-name \
     --policy file://bucket-policy.json
   ```

6. **Create CloudFront Distribution (via AWS Console):**
   - Go to: https://console.aws.amazon.com/cloudfront
   - Click "Create Distribution"
   - **Origin Domain:** Select your S3 bucket
   - **Default Root Object:** `index.html`
   - **Viewer Protocol Policy:** Redirect HTTP to HTTPS
   - **Error Pages:**
     - HTTP Error Code: `403`
     - Response Page Path: `/index.html`
     - HTTP Response Code: `200`
     - HTTP Error Code: `404`
     - Response Page Path: `/index.html`
     - HTTP Response Code: `200`
   - Click "Create Distribution"
   - Wait for deployment (~15-20 minutes)
   - Your app will be live at: `https://<distribution-id>.cloudfront.net`

**Note:** The `.env` file values are baked into the build, so they're already included in the `build/` folder.

---

### Option C: CI/CD Pipeline (Automated)

See `cicd-setup-guide.md` for detailed instructions on setting up automated deployment via CodePipeline.

---

## Step 4: Verify Connection

After deployment, verify the connection:

1. **Open your deployed app**
2. **Sign up/Sign in:**
   - Create a new account or sign in
   - This uses Cognito User Pool: `us-east-1_Tx8ircMe3`

3. **Test API Connection:**
   - Create a task
   - Check browser console (F12) for any errors
   - Verify task appears in the UI
   - Check DynamoDB console to confirm task was saved

4. **Check CORS (if issues):**
   - If you see CORS errors, verify API Gateway CORS settings
   - Backend should already have CORS configured, but verify:
     - Allow Origin: `*` (or your frontend domain)
     - Allow Methods: `GET, POST, PUT, DELETE, OPTIONS`
     - Allow Headers: `Content-Type, Authorization`

---

## Troubleshooting

### Issue: "No authentication token found"
- **Solution:** Verify `.env` file has correct User Pool ID and Client ID
- **Solution:** Ensure Amplify is configured before making API calls

### Issue: CORS errors
- **Solution:** Check API Gateway CORS settings in backend
- **Solution:** Verify `REACT_APP_API_URL` is correct (should end with `/prod`)

### Issue: Tasks not loading
- **Solution:** Check browser console for API errors
- **Solution:** Verify API Gateway URL is correct
- **Solution:** Check CloudWatch logs in backend for Lambda errors

### Issue: Build fails
- **Solution:** Run `npm install` to ensure all dependencies are installed
- **Solution:** Check for TypeScript errors: `npx tsc --noEmit`

---

## Quick Reference

**Backend Endpoints:**
- API Gateway: `https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod`
- User Pool: `us-east-1_Tx8ircMe3`
- Region: `us-east-1`

**Environment Variables:**
```bash
REACT_APP_USER_POOL_ID=us-east-1_Tx8ircMe3
REACT_APP_USER_POOL_CLIENT_ID=29t53abnqk73vb88e8g0h903g5
REACT_APP_API_URL=https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_AWS_REGION=us-east-1
```

---

## Next Steps After Deployment

1. ✅ Test authentication flow
2. ✅ Test task CRUD operations
3. ✅ Test comments and activity logs
4. ✅ Set up custom domain (optional)
5. ✅ Configure CloudWatch alarms for monitoring
6. ✅ Set up CI/CD for automatic deployments

---

*Last Updated: After backend deployment*
*Backend Stack: Deployed to us-east-1*

