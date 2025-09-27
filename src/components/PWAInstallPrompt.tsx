import { Download, Smartphone, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface PWAInstallProps {
    className?: string;
}

const PWAInstallPrompt: React.FC<PWAInstallProps> = ({ className = '' }) => {
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isWebKit = 'standalone' in window.navigator && (window.navigator as any).standalone;

        if (isStandalone || isWebKit) {
            setIsInstalled(true);
            return;
        }

        // Listen for PWA install availability
        const handleInstallable = () => {
            setIsInstallable(true);
            setTimeout(() => setShowPrompt(true), 3000); // Show prompt after 3 seconds
        };

        const handleInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setShowPrompt(false);
        };

        window.addEventListener('pwa-installable', handleInstallable as EventListener);
        window.addEventListener('pwa-installed', handleInstalled);

        return () => {
            window.removeEventListener('pwa-installable', handleInstallable as EventListener);
            window.removeEventListener('pwa-installed', handleInstalled);
        };
    }, []);

    const handleInstall = () => {
        if ((window as any).installPWA) {
            (window as any).installPWA();
        }
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Don't show again for this session
        sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    // Don't show if already installed or not installable
    if (isInstalled || !isInstallable) {
        return null;
    }

    // Don't show if previously dismissed in this session
    if (sessionStorage.getItem('pwa-prompt-dismissed')) {
        return null;
    }

    return (
        <>
            {/* Floating Install Button */}
            {isInstallable && !showPrompt && (
                <Button
                    onClick={handleInstall}
                    className={`fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-3 ${className}`}
                    title="Add SpeakSmart to Home Screen"
                >
                    <Download className="h-5 w-5" />
                </Button>
            )}

            {/* Install Prompt Banner */}
            {showPrompt && (
                <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 z-50 shadow-lg">
                    <div className="flex items-center justify-between max-w-4xl mx-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Smartphone className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base">Install SpeakSmart</h3>
                                <p className="text-xs sm:text-sm opacity-90">
                                    <span className="sm:hidden">Add to home screen for quick access</span>
                                    <span className="hidden sm:inline">Add to your home screen for quick access and offline functionality</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleInstall}
                                size="sm"
                                className="bg-white text-blue-600 hover:bg-gray-100 font-medium text-xs sm:text-sm"
                            >
                                <Download className="h-4 w-4 mr-1" />
                                <span className="sm:hidden">Install</span>
                                <span className="hidden sm:inline">Install App</span>
                            </Button>
                            <Button
                                onClick={handleDismiss}
                                size="sm"
                                variant="ghost"
                                className="text-white hover:bg-white/20 p-1"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PWAInstallPrompt;