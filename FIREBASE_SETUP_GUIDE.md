# Firebase Configuration Guide for WayneOS

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Project name: `wayneos-vm` (or `wayne-ia-wayneos`)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. (Optional) Enable "Google" provider for OAuth

## Step 3: Create Web App

1. Go to Project Overview (home icon)
2. Click the web icon `</>` to add a web app
3. App nickname: `WayneOS Web`
4. Check "Also set up Firebase Hosting" (optional)
5. Click "Register app"
6. Copy the configuration object shown

## Step 4: Get Configuration Values

Firebase will show you a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "wayneos-vm.firebaseapp.com",
  projectId: "wayneos-vm",
  storageBucket: "wayneos-vm.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxxxxxx"
};
```

## Step 5: Frontend Environment Variables

Create `/home/bbob/wayne-OS/wayneos-vm-app/frontend/.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=wayneos-vm.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=wayneos-vm
VITE_FIREBASE_STORAGE_BUCKET=wayneos-vm.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxxxxxxxxxx
VITE_WS_URL=ws://localhost:8000
```

## Step 6: Backend Environment Variables

Create `/home/bbob/wayne-OS/wayneos-vm-app/backend/.env`:

```env
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
FIREBASE_PROJECT_ID=wayneos-vm
CLAUDE_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LOG_LEVEL=info
```

## Step 7: Generate Service Account (for Backend)

1. In Firebase Console, click the gear icon → "Project settings"
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file as `serviceAccountKey.json`
5. Place it in `/home/bbob/wayne-OS/wayneos-vm-app/backend/`
6. Add to `.gitignore`: `serviceAccountKey.json`

## Step 8: Update Backend Auth Middleware

Update `/home/bbob/wayne-OS/wayneos-vm-app/backend/src/middleware/auth.ts`:

```typescript
import admin from 'firebase-admin'
import serviceAccount from '../serviceAccountKey.json'

// Initialize Firebase Admin with service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  })
}
```

## Step 9: Claude API Key

Get your Claude API key from [Anthropic Console](https://console.anthropic.com):
1. Sign in to your Anthropic account
2. Go to API Keys section
3. Create new API key
4. Copy and paste into `CLAUDE_API_KEY` in backend `.env`

## Step 10: Create Test User

1. In Firebase Console → Authentication → Users tab
2. Click "Add user"
3. Email: `demo@wayneos.ai`
4. Password: `demo123`
5. Click "Add user"

## Step 11: (Optional) Using Wayne IA Firebase

If you want to use the existing Wayne IA Firebase project instead:

```env
# Frontend .env
VITE_FIREBASE_API_KEY=AIzaSyBKZ6j_XrL0f7Y5ikrYkEkPwFC9bHhlRMo
VITE_FIREBASE_AUTH_DOMAIN=wayne-ia-investment-platform.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=wayne-ia-investment-platform
VITE_FIREBASE_STORAGE_BUCKET=wayne-ia-investment-platform.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=916492088270
VITE_FIREBASE_APP_ID=1:916492088270:web:your-app-id-here

# Backend .env
FIREBASE_PROJECT_ID=wayne-ia-investment-platform
```

Note: You'll need access to the Wayne IA project and appropriate service account credentials.

## Security Notes

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Never commit service account keys** - Keep them secure
3. **Use environment variables in production** - Don't hardcode credentials
4. **Enable Firebase Security Rules** - Protect your data
5. **Use Firebase App Check** - Prevent unauthorized access

## Testing the Configuration

```bash
cd /home/bbob/wayne-OS/wayneos-vm-app

# Terminal 1 - Start backend
cd backend
npm install
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm install
npm run dev

# Open http://localhost:3000
# Try logging in with demo@wayneos.ai / demo123
```

## Production Deployment

For Cloud Run deployment, set these environment variables in the Cloud Console:
- All the VITE_* variables (for build time)
- CLAUDE_API_KEY
- FIREBASE_PROJECT_ID
- Upload service account JSON as a secret in Secret Manager

---

Ready to proceed with GitHub deployment following the publish-github-reference.txt guide!