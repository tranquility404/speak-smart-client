export const OAUTH_CONFIG = {
    google: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
        scope: 'openid email profile',
        responseType: 'code',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        extraParams: {
            access_type: 'offline',
            prompt: 'consent'
        }
    },
    github: {
        clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
        redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI,
        scope: 'read:user user:email',
        responseType: 'code',
        authUrl: 'https://github.com/login/oauth/authorize',
        extraParams: {
            allow_signup: 'true'
        }
    },
    linkedin: {
        clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
        redirectUri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI,
        scope: 'openid profile email',
        responseType: 'code',
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        extraParams: {}
    }
};

// Generate OAuth URL for any provider
export const generateOAuthUrl = (provider: 'google' | 'github' | 'linkedin'): string => {
    const config = OAUTH_CONFIG[provider];
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scope,
        response_type: config.responseType,
        state: provider
    });

    Object.entries(config.extraParams).forEach(([key, value]) => {
        params.append(key, value);
    });

    return `${config.authUrl}?${params.toString()}`;
};

// Initiate OAuth login by redirecting user
export const initiateOAuthLogin = (provider: 'google' | 'github' | 'linkedin'): void => {
    const authUrl = generateOAuthUrl(provider);

    console.log(`Initiating ${provider} OAuth login:`, authUrl, OAUTH_CONFIG[provider]);
    localStorage.setItem('auth_redirect_url', window.location.pathname);

    window.location.href = authUrl;
};

// Extract code, provider, and error from callback URL
export const extractAuthCodeFromUrl = (): { code: string | null, provider: string | null, error: string | null } => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        code: urlParams.get('code'),
        provider: urlParams.get('state'),
        error: urlParams.get('error')
    };
};