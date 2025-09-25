import React from 'react';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa';
import { initiateOAuthLogin } from '@/utils/oauth';

interface SocialLoginButtonProps {
    provider: 'google' | 'github' | 'linkedin';
    disabled?: boolean;
    className?: string;
    variant?: 'full' | 'icon';
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
    provider,
    disabled = false,
    className = '',
    variant = 'full'
}) => {
    const handleSocialLogin = () => {
        if (!disabled) {
            initiateOAuthLogin(provider);
        }
    };

    const providerConfig = {
        google: {
            icon: <FaGoogle className={variant === 'icon' ? "w-6 h-6" : "w-5 h-5"} />,
            label: 'Continue with Google',
            bgColor: variant === 'icon' ? 'bg-white hover:bg-gray-50' : 'bg-white hover:bg-gray-50',
            textColor: 'text-gray-700',
            borderColor: 'border-gray-300',
            iconColor: 'text-red-500'
        },
        github: {
            icon: <FaGithub className={variant === 'icon' ? "w-6 h-6" : "w-5 h-5"} />,
            label: 'Continue with GitHub',
            bgColor: variant === 'icon' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-900 hover:bg-gray-800',
            textColor: 'text-white',
            borderColor: 'border-gray-900',
            iconColor: 'text-white'
        },
        linkedin: {
            icon: <FaLinkedin className={variant === 'icon' ? "w-6 h-6" : "w-5 h-5"} />,
            label: 'Continue with LinkedIn',
            bgColor: variant === 'icon' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700',
            textColor: 'text-white',
            borderColor: 'border-blue-600',
            iconColor: 'text-white'
        }
    };

    const config = providerConfig[provider];

    if (variant === 'icon') {
        return (
            <Button
                type="button"
                variant="outline"
                size="icon"
                className={`w-12 h-12 rounded-full ${config.bgColor} ${config.textColor} ${config.borderColor} transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 ${className}`}
                onClick={handleSocialLogin}
                disabled={disabled}
                title={config.label}
            >
                {React.cloneElement(config.icon, {
                    className: `w-6 h-6 ${provider === 'google' ? 'text-red-500' : config.textColor}`
                })}
            </Button>
        );
    }

    return (
        <Button
            type="button"
            variant="outline"
            className={`w-full h-11 ${config.bgColor} ${config.textColor} ${config.borderColor} font-medium transition-all duration-200 shadow-sm hover:shadow-md ${className}`}
            onClick={handleSocialLogin}
            disabled={disabled}
        >
            <div className="flex items-center justify-center gap-3">
                {config.icon}
                <span>{config.label}</span>
            </div>
        </Button>
    );
};

export default SocialLoginButton;