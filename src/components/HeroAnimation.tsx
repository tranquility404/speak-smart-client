import { useEffect, useState } from 'react';
import { Mic, Radio, Zap, Sparkles, BarChart3, Brain } from 'lucide-react';

interface FloatingElementProps {
    icon: React.ReactNode;
    delay: number;
    duration: number;
    startX: number;
    startY: number;
}

const FloatingElement = ({ icon, delay, duration, startX, startY }: FloatingElementProps) => {
    return (
        <div
            className="absolute opacity-30 hover:opacity-60 transition-opacity duration-300"
            style={{
                left: `${startX}%`,
                top: `${startY}%`,
                animation: `float-${delay} ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
            }}
        >
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 shadow-lg backdrop-blur-sm">
                {icon}
            </div>
        </div>
    );
};

interface WaveBarProps {
    height: number;
    delay: number;
    duration: number;
}

const WaveBar = ({ height, delay, duration }: WaveBarProps) => {
    return (
        <div
            className="bg-gradient-to-t from-blue-400 to-blue-600 rounded-full animate-pulse"
            style={{
                width: '4px',
                height: `${height}px`,
                animation: `wave ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
            }}
        />
    );
};

const PulsingOrb = ({ size, color, delay }: { size: number; color: string; delay: number }) => {
    return (
        <div
            className={`absolute rounded-full ${color} opacity-20 animate-ping`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: '3s',
            }}
        />
    );
};

export default function HeroAnimation() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const floatingElements = [
        { icon: <Mic className="h-4 w-4" />, delay: 0, duration: 6, startX: 10, startY: 20 },
        { icon: <Radio className="h-4 w-4" />, delay: 1, duration: 8, startX: 85, startY: 15 },
        { icon: <Zap className="h-4 w-4" />, delay: 2, duration: 7, startX: 20, startY: 70 },
        { icon: <Sparkles className="h-4 w-4" />, delay: 0.5, duration: 9, startX: 75, startY: 75 },
        { icon: <BarChart3 className="h-4 w-4" />, delay: 1.5, duration: 5, startX: 50, startY: 10 },
        { icon: <Brain className="h-4 w-4" />, delay: 2.5, duration: 6.5, startX: 5, startY: 50 },
    ];

    const waveHeights = [20, 35, 28, 42, 15, 38, 22, 45, 18, 32, 25, 40, 12, 35, 30];

    return (
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
            <style>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-5px) rotate(-3deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(-5deg); }
          66% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          20% { transform: translateY(-8px) rotate(3deg); }
          40% { transform: translateY(-15px) rotate(-3deg); }
          60% { transform: translateY(-5px) rotate(2deg); }
          80% { transform: translateY(-12px) rotate(-2deg); }
        }
        @keyframes float-0.5 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes float-1.5 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          30% { transform: translateY(-8px) rotate(-4deg); }
          70% { transform: translateY(-12px) rotate(4deg); }
        }
        @keyframes float-2.5 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          40% { transform: translateY(-14px) rotate(2deg); }
          80% { transform: translateY(-6px) rotate(-2deg); }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.8); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
      `}</style>

            {/* Background gradient animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 animate-pulse" />

            {/* Central pulsing orbs */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    <PulsingOrb size={200} color="bg-blue-500" delay={0} />
                    <PulsingOrb size={150} color="bg-indigo-500" delay={1} />
                    <PulsingOrb size={100} color="bg-purple-500" delay={2} />
                </div>
            </div>

            {/* Central microphone icon with glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className={`
            p-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl
            transition-all duration-1000 transform
            ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
          `}
                    style={{ animation: 'glow 3s ease-in-out infinite' }}
                >
                    <Mic className="h-8 w-8 md:h-12 md:w-12" />
                </div>
            </div>

            {/* Floating elements */}
            {floatingElements.map((element, index) => (
                <FloatingElement
                    key={index}
                    icon={element.icon}
                    delay={element.delay}
                    duration={element.duration}
                    startX={element.startX}
                    startY={element.startY}
                />
            ))}

            {/* Sound wave visualization at the bottom */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-end space-x-1">
                {waveHeights.map((height, index) => (
                    <WaveBar
                        key={index}
                        height={height}
                        delay={index * 0.1}
                        duration={1.5 + (index % 3) * 0.5}
                    />
                ))}
            </div>

            {/* Animated connection lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                {/* Animated curved lines connecting floating elements */}
                <path
                    d="M 50 50 Q 150 100 250 80 T 400 120"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                    style={{ animationDuration: '4s' }}
                />
                <path
                    d="M 100 200 Q 200 150 300 180 T 450 160"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                    style={{ animationDuration: '5s', animationDelay: '1s' }}
                />
            </svg>

            {/* Subtle particle effects */}
            <div className="absolute inset-0">
                {Array.from({ length: 20 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-ping"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Speech analysis visualization on the sides */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 space-y-2 opacity-40">
                {[30, 20, 40, 15, 35, 25].map((height, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                        style={{
                            width: '3px',
                            height: `${height}px`,
                            animation: `wave ${1.8 + index * 0.2}s ease-in-out infinite`,
                            animationDelay: `${index * 0.15}s`,
                        }}
                    />
                ))}
            </div>

            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2 opacity-40">
                {[25, 40, 18, 35, 22, 38].map((height, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"
                        style={{
                            width: '3px',
                            height: `${height}px`,
                            animation: `wave ${2 + index * 0.2}s ease-in-out infinite`,
                            animationDelay: `${index * 0.1}s`,
                        }}
                    />
                ))}
            </div>

            {/* Mobile-optimized overlay to reduce animation intensity */}
            <div className="md:hidden absolute inset-0 bg-white/10 backdrop-blur-[0.5px]" />
        </div>
    );
}