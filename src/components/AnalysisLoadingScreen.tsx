import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Cog, AlertTriangle, RotateCcw, Timer, Hash } from 'lucide-react';

interface AnalysisLoadingScreenProps {
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RETRY' | 'RETRYING';
    progress?: number;
    processingTimeMs?: number;
    processingStartedAt?: string;
    requestedAt?: string;
    requestId?: string;
    message?: string;
}

const AnalysisLoadingScreen: React.FC<AnalysisLoadingScreenProps> = ({
    status,
    progress = 0,
    processingTimeMs,
    processingStartedAt,
    requestedAt,
    requestId,
    message
}) => {
    const [dots, setDots] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Update current time every second for live time calculations
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Helper functions for time calculations
    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${seconds}s`;
    };

    const getTimePassed = () => {
        if (!processingStartedAt && !requestedAt) return null;

        const startTime = new Date(processingStartedAt || requestedAt!);
        const timeDiff = currentTime.getTime() - startTime.getTime();
        return formatDuration(Math.max(0, timeDiff));
    };

    const getEstimatedTime = () => {
        // Base estimates for different types of analysis
        const baseEstimates = {
            'PENDING': 5000, // 5 seconds
            'PROCESSING': 30000, // 30 seconds
            'RETRY': 15000, // 15 seconds
            'RETRYING': 15000, // 15 seconds
        };

        const baseEstimate = baseEstimates[status as keyof typeof baseEstimates] || 20000;

        // If we have processing time data, use it for better estimates
        if (processingTimeMs && status === 'PROCESSING') {
            const estimatedTotal = Math.max(baseEstimate, processingTimeMs * 1.5);
            return formatDuration(estimatedTotal);
        }

        return formatDuration(baseEstimate);
    };

    const getStatusConfig = () => {
        switch (status) {
            case 'PENDING':
                return {
                    icon: <Clock className="w-16 h-16 text-blue-500 animate-pulse" />,
                    title: 'Analysis Queued',
                    description: 'Your audio is in the queue and will be processed shortly',
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-50',
                    progress: 10
                };
            case 'PROCESSING':
                return {
                    icon: <Cog className="w-16 h-16 text-purple-500 animate-spin" />,
                    title: 'Analyzing Audio',
                    description: 'Our AI is analyzing your speech patterns and providing feedback',
                    color: 'text-purple-500',
                    bgColor: 'bg-purple-50',
                    progress: progress || 50
                };
            case 'RETRY':
            case 'RETRYING':
                return {
                    icon: <RotateCcw className="w-16 h-16 text-orange-500 animate-pulse" />,
                    title: 'Retrying Analysis',
                    description: 'Attempting to process your audio again',
                    color: 'text-orange-500',
                    bgColor: 'bg-orange-50',
                    progress: 30
                };
            case 'FAILED':
                return {
                    icon: <AlertTriangle className="w-16 h-16 text-red-500" />,
                    title: 'Analysis Failed',
                    description: 'We encountered an issue while processing your audio',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50',
                    progress: 0
                };
            case 'COMPLETED':
                return {
                    icon: <CheckCircle className="w-16 h-16 text-green-500" />,
                    title: 'Analysis Complete',
                    description: 'Your speech analysis is ready!',
                    color: 'text-green-500',
                    bgColor: 'bg-green-50',
                    progress: 100
                };
            default:
                return {
                    icon: <Clock className="w-16 h-16 text-gray-500" />,
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <Card className="relative z-10 w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                    <div className="text-center space-y-6">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg">
                                <div className="text-white text-2xl font-bold">SS</div>
                            </div>
                        </div>

                        {/* Status Icon */}
                        <div className={`flex justify-center p-6 rounded-full ${config.bgColor} mx-auto w-fit`}>
                            {config.icon}
                        </div>

                        {/* Status Text */}
                        <div className="space-y-2">
                            <h2 className={`text-2xl font-bold ${config.color}`}>
                                {config.title}{status !== 'COMPLETED' && status !== 'FAILED' ? dots : ''}
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {config.description}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        {status !== 'FAILED' && (
                            <div className="space-y-2">
                                <Progress value={config.progress} className="h-2" />
                                <p className="text-xs text-gray-500">{config.progress}% Complete</p>
                            </div>
                        )}

                        {/* Detailed Information */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                            {/* Status and Message */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status:</span>
                                <Badge variant={status === 'COMPLETED' ? 'default' : status === 'FAILED' ? 'destructive' : 'secondary'}>
                                    {status}
                                </Badge>
                            </div>

                            {message && (
                                <div className="flex items-start justify-between">
                                    <span className="text-gray-600">Message:</span>
                                    <span className="text-gray-800 text-right max-w-48">{message}</span>
                                </div>
                            )}

                            {/* Request ID */}
                            {requestId && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 flex items-center gap-1">
                                        <Hash className="w-3 h-3" />
                                        ID:
                                    </span>
                                    <span className="text-gray-800 font-mono text-xs">{requestId.slice(-8)}</span>
                                </div>
                            )}

                            {/* Time Information */}
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-gray-600 flex items-center justify-center gap-1">
                                        <Timer className="w-3 h-3" />
                                        <span className="text-xs">Time Passed</span>
                                    </div>
                                    <div className="text-gray-800 font-semibold">{getTimePassed() || '-'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-gray-600 flex items-center justify-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-xs">Est. Total</span>
                                    </div>
                                    <div className="text-gray-800 font-semibold">{getEstimatedTime()}</div>
                                </div>
                            </div>

                            {/* Processing Time (if available) */}
                            {processingTimeMs && (
                                <div className="text-center pt-1 border-t border-gray-200">
                                    <div className="text-gray-600 text-xs">Processing Time</div>
                                    <div className="text-gray-800 font-semibold">{formatDuration(processingTimeMs)}</div>
                                </div>
                            )}
                        </div>

                        {/* Fun Loading Messages */}
                        {(status === 'PROCESSING' || status === 'PENDING') && (
                            <div className="text-xs text-gray-400 italic">
                                {status === 'PROCESSING'
                                    ? "Analyzing speech patterns, detecting fillers, measuring pace..."
                                    : "Preparing your audio for analysis..."}
                            </div>
                        )}

                        {/* Pulse animation for active states */}
                        {(status === 'PENDING' || status === 'PROCESSING' || status === 'RETRY' || status === 'RETRYING') && (
                            <div className="flex justify-center space-x-1">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse animation-delay-200"></div>
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse animation-delay-400"></div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Additional inline styles for animations */}
            <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
        </div>
    );
};

export default AnalysisLoadingScreen;