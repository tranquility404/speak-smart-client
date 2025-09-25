import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { googleCallback, githubCallback, linkedinCallback } from '@/api/apiRequests';
import { toast } from 'react-toastify';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AuthCallbackProps {
    provider: 'google' | 'github' | 'linkedin';
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ provider, setIsAuthenticated }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');

            console.log(`OAuth callback triggered for ${provider}`, { code: code?.substring(0, 10) + '...', error });

            if (error) {
                toast.error(`Authentication failed: ${error}`);
                navigate('/login');
                return;
            }

            if (!code) {
                toast.error('Invalid authentication response - no authorization code received');
                navigate('/login');
                return;
            }

            // Check if we've already processed this code to prevent duplicate requests
            const processedKey = `oauth_processed_${provider}_${code}`;
            if (localStorage.getItem(processedKey)) {
                console.log('OAuth code already processed, checking if user is authenticated...');
                // Check if user is already authenticated
                const existingToken = localStorage.getItem('authToken');
                if (existingToken) {
                    console.log('User already has token, setting authenticated state...');
                    setIsAuthenticated(true);
                    let redirectUrl = localStorage.getItem('auth_redirect_url') || '/';
                    if (redirectUrl.includes("/login")) redirectUrl = "/"
                    localStorage.removeItem('auth_redirect_url');
                    navigate(redirectUrl);
                } else {
                    console.log('No existing token found, redirecting to login...');
                    navigate('/login');
                }
                return;
            }

            try {
                // Mark this code as being processed
                localStorage.setItem(processedKey, 'true');

                console.log(`Sending ${provider} OAuth code to backend...`);

                let response;

                if (provider === 'google') {
                    response = await googleCallback(code);
                } else if (provider === 'github') {
                    response = await githubCallback(code);
                } else if (provider === 'linkedin') {
                    response = await linkedinCallback(code);
                } else {
                    throw new Error('Unknown OAuth provider');
                }

                console.log(`${provider} OAuth response received:`, response?.data ? 'Token received' : 'No token');

                // Store the token and authenticate user
                localStorage.setItem('authToken', response.data);
                console.log('Token saved to localStorage');

                setIsAuthenticated(true);
                console.log('setIsAuthenticated(true) called');

                // Clean up the processed code marker after successful auth
                localStorage.removeItem(processedKey);

                // Redirect to the intended page or homepage
                let redirectUrl = localStorage.getItem('auth_redirect_url') || '/';
                if (redirectUrl.includes("/login")) redirectUrl = "/"
                localStorage.removeItem('auth_redirect_url');

                console.log(`Redirecting to: ${redirectUrl}`);
                toast.success(`Successfully signed in with ${provider}`);
                navigate(redirectUrl);

            } catch (error: any) {
                // Clean up the processed code marker on error
                localStorage.removeItem(processedKey);

                console.error(`${provider} OAuth callback error:`, error);
                toast.error(error.response?.data?.message || 'Authentication failed');
                navigate('/login');
            } finally {
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, []); // Empty dependency array to run only once

    if (isProcessing) {
        const providerName = provider === 'google' ? 'Google' : provider === 'github'? 'GitHub': 'LinkedIn';

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Card className="w-full max-w-md border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Completing {providerName} sign in...
                        </h2>
                        <p className="text-sm text-gray-600 text-center">
                            Please wait while we verify your {providerName} credentials
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
};

export default AuthCallback;