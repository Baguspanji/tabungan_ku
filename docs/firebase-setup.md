# Firebase Setup and Troubleshooting

## Current Configuration

The app is configured to use **production Firebase services** by default. This should resolve the `auth/network-request-failed` error you were experiencing.

## Environment Variables

Make sure your `.env.local` file contains the correct Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Using Firebase Emulators (Optional)

If you want to use Firebase emulators for development:

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize your project** (if not already done):
   ```bash
   firebase init
   ```

4. **Enable emulators** by adding this to your `.env.local`:
   ```bash
   VITE_USE_EMULATORS=true
   ```

5. **Start development with emulators**:
   ```bash
   pnpm run dev:emulator
   ```

## Troubleshooting Network Errors

### `auth/network-request-failed`

This error typically occurs when:
- Firebase emulators are configured but not running
- Network connectivity issues
- Firebase service is temporarily unavailable
- Incorrect Firebase configuration

**Solutions:**
1. Ensure you're using production Firebase services (current default)
2. Check your internet connection
3. Verify Firebase configuration in `.env.local`
4. If using emulators, make sure they are running

### `auth/timeout`

- Check network stability
- Try again after a moment
- Ensure Firebase project is active

### `auth/unavailable`

- Firebase service might be down
- Check [Firebase Status Page](https://status.firebase.google.com/)
- Try again later

## Scripts

- `pnpm run dev` - Start development server with production Firebase
- `pnpm run emulators` - Start Firebase emulators only
- `pnpm run dev:emulator` - Start both dev server and emulators

## Current Status

✅ **Production Firebase** - Ready to use
⚙️ **Emulators** - Available but disabled by default

To switch to emulators, set `VITE_USE_EMULATORS=true` in your `.env.local` file.
