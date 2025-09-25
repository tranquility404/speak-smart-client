# OAuth Setup Guide for SpeakSmart

## Overview
This guide helps you set up Google and GitHub OAuth authentication for the SpeakSmart application.

## Prerequisites
- Google Cloud Console account
- GitHub account with developer access
- SpeakSmart backend configured with OAuth endpoints

## Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable APIs**
   - Navigate to "APIs & Services" > "Library"
   - Search for and enable "Google+ API"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Select "Web application"
   - Add Authorized redirect URIs:
     - Development: `http://localhost:5173/auth/callback`
     - Production: `https://yourdomain.com/auth/callback`
   - Copy the Client ID

## GitHub OAuth Setup

1. **GitHub Developer Settings**
   - Visit [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "OAuth Apps" > "New OAuth App"

2. **Configure OAuth App**
   - Application name: "SpeakSmart"
   - Homepage URL: Your app's homepage
   - Authorization callback URL:
     - Development: `http://localhost:5173/auth/callback`
     - Production: `https://yourdomain.com/auth/callback`
   - Copy the Client ID

## Environment Configuration

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Add your OAuth credentials**
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_GITHUB_CLIENT_ID=your_github_client_id_here
   ```

## Backend Requirements

Your backend should have these endpoints configured:
- `POST /auth/google/callback` - Handles Google OAuth callback
- `POST /auth/github/callback` - Handles GitHub OAuth callback

Both endpoints should:
- Accept `{ code: string }` in the request body
- Return an authentication token
- Handle the OAuth flow with the respective provider

## Testing

1. Start your development server
2. Navigate to the login page
3. Click "Continue with Google" or "Continue with GitHub"
4. Complete the OAuth flow
5. Verify successful authentication

## Troubleshooting

- **Redirect URI mismatch**: Ensure the redirect URIs in your OAuth app settings match exactly
- **Client ID not found**: Verify your environment variables are loaded correctly
- **CORS errors**: Make sure your backend accepts requests from your frontend domain
- **Token issues**: Check that your backend is properly handling the OAuth callbacks

## Security Notes

- Keep your client secrets secure (they should only be on your backend)
- Use HTTPS in production
- Regularly review and rotate your OAuth credentials
- Monitor OAuth usage in your provider dashboards