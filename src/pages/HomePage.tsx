import { getMyUserInfo } from '@/api/apiRequests';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserInfo } from '@/types/userInfo';
import {
    ArrowRight,
    BarChart3,
    Flame,
    Mic,
    Sparkles
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardUser {
    _id: string;
    name: string;
    profilePicCloudUrl?: string;
    points: number;
    analysisCount: number;
    streak: number;
    lastRequestDate: string;
}

const HomePage: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getAvatarBgColor = (name: string): string => {
        const colors = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
            'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Load user performance data
    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);

                const userInfoRes = await getMyUserInfo();

                const userData = userInfoRes.data;
                setUserInfo(userData);
                setCurrentUser(userData);

            } catch (error) {
                console.error("Failed to load user data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const features = [
        {
            title: "Start Practicing",
            description: "Record and analyze your speech delivery",
            icon: Mic,
            path: "/speech-analyzer",
            gradient: "from-blue-500 to-blue-600"
        },
        {
            title: "Refine Speeches",
            description: "Polish and improve your speaking style",
            icon: Sparkles,
            path: "/speech-refinement",
            gradient: "from-purple-500 to-purple-600"
        },
        {
            title: "View Performance",
            description: "Track your progress and improvements",
            icon: BarChart3,
            path: "/analysis-history",
            gradient: "from-green-500 to-green-600"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your performance...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Welcome Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
                        Welcome back, {userInfo?.name?.split(' ')[0] || 'Speaker'}!
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        Where words meet wisdom and stage fright meets its match
                    </p>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Your Performance Section */}
                    {currentUser && (
                        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
                            <CardContent>
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-white/50 overflow-hidden">
                                            {currentUser.profilePicCloudUrl ? (
                                                <>
                                                    <img
                                                        src={currentUser.profilePicCloudUrl}
                                                        alt={currentUser.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const fallback = target.nextElementSibling as HTMLElement;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className={`absolute inset-0 ${getAvatarBgColor(currentUser.name)} text-white flex items-center justify-center text-xl font-bold`} style={{ display: 'none' }}>
                                                        {getInitials(currentUser.name)}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className={`w-full h-full ${getAvatarBgColor(currentUser.name)} text-white flex items-center justify-center text-xl font-bold`}>
                                                    {getInitials(currentUser.name)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left flex-1">
                                        <div className="grid grid-cols-3 gap-4 sm:gap-8">
                                            <div className="text-center">
                                                <div className="text-2xl sm:text-3xl font-bold">{currentUser.points.toLocaleString()}</div>
                                                <div className="text-sm sm:text-base opacity-90">Points</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl sm:text-3xl font-bold">{currentUser.analysisCount}</div>
                                                <div className="text-sm sm:text-base opacity-90">Analyses</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-1">
                                                    <Flame className="h-6 w-6 sm:h-7 sm:w-7 text-orange-300" />
                                                    {currentUser.streak}
                                                </div>
                                                <div className="text-sm sm:text-base opacity-90">Streak</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Features Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card
                                    key={index}
                                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-gray-200 overflow-hidden"
                                    onClick={() => navigate(feature.path)}
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 group-hover:text-gray-700">
                                            {feature.description}
                                        </p>
                                        <div className="w-fit flex items-center mx-auto text-blue-600 font-medium group-hover:text-blue-700">
                                            <span>Get Started</span>
                                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center pt-8">
                        <p className="text-gray-600 mb-6">
                            Ready to take your speaking skills to the next level?
                        </p>
                        <Button
                            onClick={() => navigate('/speech-analyzer')}
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Start Your Journey
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;