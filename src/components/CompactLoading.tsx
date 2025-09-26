import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Cog, AlertTriangle, RotateCcw } from 'lucide-react';

interface CompactLoadingProps {
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RETRY' | 'RETRYING';
    progress?: number;
}

const CompactLoading: React.FC<CompactLoadingProps> = ({
    status,
    progress = 0
}) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const getStatusConfig = () => {
        switch (status) {
            case 'PENDING':
                return {
                    icon: <Clock className="w-8 h-8 text-blue-500 animate-pulse" />,
                    title: 'Uploading Audio',
                    description: 'Your audio is being uploaded and queued for analysis',
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-50',
                    progress: 15
                };
            case 'PROCESSING':
                return {
                    icon: <Cog className="w-8 h-8 text-purple-500 animate-spin" />,
                    title: 'Analyzing Speech',
                    description: 'AI is analyzing your speech patterns',
                    color: 'text-purple-500',
                    bgColor: 'bg-purple-50',
                    progress: progress || 60
                };
            case 'RETRY':
            case 'RETRYING':
                return {
                    icon: <RotateCcw className="w-8 h-8 text-orange-500 animate-pulse" />,
                    title: 'Retrying Analysis',
                    description: 'Processing your audio again',
                    color: 'text-orange-500',
                    bgColor: 'bg-orange-50',
                    progress: 40
                };
            case 'FAILED':
                return {
                    icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
                    title: 'Analysis Failed',
                    description: 'Unable to process your audio',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50',
                    progress: 0
                };
            case 'COMPLETED':
                return {
                    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
                    title: 'Analysis Complete',
                    description: 'Redirecting to results...',
                    color: 'text-green-500',
                    bgColor: 'bg-green-50',
                    progress: 100
                };
            default:
                return {
                    icon: <Clock className="w-8 h-8 text-gray-500" />,
                    title: 'Processing',
                    description: 'Please wait...',
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-50',
                    progress: 0
                };
        }
    };

    const config = getStatusConfig();

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Voice Analyzer</CardTitle>
                <CardDescription>
                    Processing your audio for analysis
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Status Icon and Text */}
                <div className="text-center space-y-4">
                    <div className={`flex justify-center p-4 rounded-full ${config.bgColor} mx-auto w-fit`}>
                        {config.icon}
                    </div>

                    <div className="space-y-2">
                        <h3 className={`text-lg font-semibold ${config.color}`}>
                            {config.title}{status !== 'COMPLETED' && status !== 'FAILED' ? dots : ''}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {config.description}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                {status !== 'FAILED' && (
                    <div className="space-y-2">
                        <Progress value={config.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{config.progress}% Complete</span>
                            <span>
                                {status === 'PENDING' && 'Uploading...'}
                                {status === 'PROCESSING' && 'Analyzing...'}
                                {status === 'RETRY' && 'Retrying...'}
                                {status === 'RETRYING' && 'Retrying...'}
                                {status === 'COMPLETED' && 'Complete!'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Animated dots for active states */}
                {(status === 'PENDING' || status === 'PROCESSING' || status === 'RETRY' || status === 'RETRYING') && (
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CompactLoading;