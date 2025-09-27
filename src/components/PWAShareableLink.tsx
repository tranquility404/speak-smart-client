import React, { useState } from 'react';
import { Button } from './ui/button';
import { Copy, Download, Share2, Check } from 'lucide-react';

interface PWAShareableLinkProps {
    className?: string;
}

const PWAShareableLink: React.FC<PWAShareableLinkProps> = ({ className = '' }) => {
    const [copied, setCopied] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);

    // Create install link with URL parameter
    const installLink = `${window.location.origin}?install=true`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(installLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = installLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Install SpeakSmart App',
                    text: 'Try SpeakSmart - AI-powered speech analysis app! Install it for the best experience.',
                    url: installLink,
                });
            } catch (err) {
                console.log('Error sharing:', err);
                // Fallback to copy link
                copyToClipboard();
            }
        } else {
            // Show share options for desktop
            setShowShareOptions(true);
            setTimeout(() => setShowShareOptions(false), 3000);
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* Main Install Link Button */}
            <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Download className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-800">Share Install Link</h3>
                        <p className="text-xs text-gray-600">Direct link to install SpeakSmart app</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={copyToClipboard}
                        size="sm"
                        variant="outline"
                        className="text-xs h-8"
                    >
                        {copied ? (
                            <>
                                <Check className="h-3 w-3 mr-1" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={shareLink}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                    >
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                    </Button>
                </div>
            </div>

            {/* Install Link Preview */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                <p className="text-xs text-gray-600 mb-1">Install Link:</p>
                <div className="flex items-center gap-2">
                    <code className="text-xs text-blue-600 bg-white px-2 py-1 rounded border flex-1 truncate">
                        {installLink}
                    </code>
                    <Button
                        onClick={copyToClipboard}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                    >
                        {copied ? (
                            <Check className="h-3 w-3 text-green-600" />
                        ) : (
                            <Copy className="h-3 w-3" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Share Options Popup */}
            {showShareOptions && (
                <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-lg border p-3 z-50 min-w-64">
                    <p className="text-sm font-medium mb-2">Share via:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Try SpeakSmart - AI-powered speech analysis! ${installLink}`)}`)}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                        >
                            WhatsApp
                        </Button>
                        <Button
                            onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(installLink)}&text=${encodeURIComponent('Try SpeakSmart - AI-powered speech analysis!')}`)}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                        >
                            Telegram
                        </Button>
                        <Button
                            onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(installLink)}&text=${encodeURIComponent('Check out SpeakSmart - AI-powered speech analysis app!')}`)}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                        >
                            Twitter
                        </Button>
                        <Button
                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(installLink)}`)}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                        >
                            Facebook
                        </Button>
                    </div>
                </div>
            )}

            {/* Usage Instructions */}
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                    <strong>How it works:</strong> When users click this link, they'll be prompted to install the SpeakSmart app immediately on their device.
                </p>
            </div>
        </div>
    );
};

export default PWAShareableLink;