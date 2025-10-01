import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getLeaderboard, getMyUserInfo } from '@/api/apiRequests';
import {
    Trophy,
    Medal,
    Flame,
    BarChart3,
    Crown,
    Star,
    Filter,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Updated interface to match API response
interface LeaderboardUser {
    _id: string;
    name: string;
    profilePicCloudUrl?: string;
    points: number;
    analysisCount: number;
    streak: number;
    lastRequestDate: string;
    rank?: number;
    badge?: 'gold' | 'silver' | 'bronze' | 'diamond' | 'platinum' | null;
    isCurrentUser?: boolean;
}

const Leaderboard: React.FC = () => {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);

    // Helper functions for badges and avatars
    const getBadgeFromPoints = (points: number): 'gold' | 'silver' | 'bronze' | 'diamond' | 'platinum' | null => {
        if (points >= 2000) return 'diamond';
        if (points >= 1500) return 'platinum';
        if (points >= 1000) return 'gold';
        if (points >= 500) return 'silver';
        if (points >= 100) return 'bronze';
        return null;
    };

    const getBadgeColor = (badge: string | null): string => {
        switch (badge) {
            case 'diamond': return 'bg-gradient-to-r from-cyan-400 to-blue-500';
            case 'platinum': return 'bg-gradient-to-r from-gray-300 to-gray-500';
            case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
            case 'silver': return 'bg-gradient-to-r from-gray-200 to-gray-400';
            case 'bronze': return 'bg-gradient-to-r from-orange-400 to-orange-600';
            default: return 'bg-gradient-to-r from-blue-400 to-blue-600';
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
        if (rank === 2) return <Trophy className="h-6 w-6 text-gray-400" />;
        if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />;
        if (rank <= 10) return <Star className="h-5 w-5 text-blue-500" />;
        return <span className="text-sm font-bold text-gray-600">#{rank}</span>;
    };

    // Avatar fallback functions
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

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch both user info and leaderboard data
            const [userInfoRes, leaderboardRes] = await Promise.all([
                getMyUserInfo(),
                getLeaderboard()
            ]);

            const userData = userInfoRes.data;
            const leaderboardData: LeaderboardUser[] = leaderboardRes.data;

            // Add badges and rankings based on points, and identify current user
            const processedUsers = leaderboardData.map((user, index) => ({
                ...user,
                rank: index + 1,
                badge: getBadgeFromPoints(user.points),
                isCurrentUser: user._id === userData.id && user.name !== undefined
            }));

            setUsers(processedUsers);

            // Find current user in the leaderboard
            const currentUserData = processedUsers.find(user => user.isCurrentUser);
            setCurrentUser(currentUserData || null);

        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboardData();
    }, [timeFilter]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-gray-600">Loading leaderboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Leaderboard</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={fetchLeaderboardData} className="bg-blue-600 hover:bg-blue-700">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filter by:</span>
                        <Select value={timeFilter} onValueChange={(value: 'all' | 'month' | 'week') => setTimeFilter(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={fetchLeaderboardData}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* Current User Stats */}
                {currentUser && (
                    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Your Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                <div className="relative">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-white/50 overflow-hidden">
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
                                                <div className={`absolute inset-0 ${getAvatarBgColor(currentUser.name)} text-white flex items-center justify-center text-lg font-bold`} style={{ display: 'none' }}>
                                                    {getInitials(currentUser.name)}
                                                </div>
                                            </>
                                        ) : (
                                            <div className={`w-full h-full ${getAvatarBgColor(currentUser.name)} text-white flex items-center justify-center text-lg font-bold`}>
                                                {getInitials(currentUser.name)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-white text-gray-800 rounded-full p-1">
                                        {getRankIcon(currentUser.rank || 0)}
                                    </div>
                                </div>
                                <div className="text-center sm:text-left flex-1">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-1">{currentUser.name}</h3>
                                    <Badge className="bg-white/20 text-white border-white/30 mb-3">
                                        Rank #{currentUser.rank} • {currentUser.badge?.toUpperCase() || 'MEMBER'}
                                    </Badge>
                                    <div className="grid grid-cols-3 gap-4 sm:gap-8">
                                        <div className="text-center">
                                            <div className="text-2xl sm:text-3xl font-bold">{currentUser.points.toLocaleString()}</div>
                                            <div className="text-xs sm:text-sm opacity-90">Points</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl sm:text-3xl font-bold">{currentUser.analysisCount}</div>
                                            <div className="text-xs sm:text-sm opacity-90">
                                                <span className="sm:hidden">Analyses</span>
                                                <span className="hidden sm:inline">Analyses</span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-1">
                                                <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-orange-300" />
                                                {currentUser.streak}
                                            </div>
                                            <div className="text-xs sm:text-sm opacity-90">Streak</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Main Leaderboard */}
                <div className="space-y-6">
                    {/* Top 3 Podium */}
                    {users.length >= 3 && (
                        <div className="mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">🏆 Top Performers</h2>
                            {/* Mobile: Vertical layout in correct order (1st, 2nd, 3rd) */}
                            <div className="flex flex-col gap-4 sm:hidden">
                                {users.slice(0, 3).map((user, index) => (
                                    <Card
                                        key={user._id}
                                        className={`
                                            ${user.isCurrentUser ? 'ring-2 ring-blue-500' : ''}
                                            ${index === 0 ? 'transform scale-105' : ''}
                                            hover:shadow-xl transition-all duration-300 overflow-hidden
                                        `}
                                    >
                                        <div className={`h-2 ${getBadgeColor(user.badge || null)}`}></div>
                                        <CardContent className="p-4 text-center">
                                            <div className="flex items-center gap-4">
                                                {/* Rank Number */}
                                                <div className="flex-shrink-0">
                                                    <div className={`
                                                        w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                                                        ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : ''}
                                                        ${index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : ''}
                                                        ${index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800' : ''}
                                                    `}>
                                                        {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                                                    </div>
                                                </div>

                                                {/* User Avatar */}
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-14 h-14 rounded-full ring-3 ring-white shadow-lg relative overflow-hidden">
                                                        {user.profilePicCloudUrl ? (
                                                            <>
                                                                <img
                                                                    src={user.profilePicCloudUrl}
                                                                    alt={user.name}
                                                                    className="w-full h-full rounded-full object-cover"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                        const fallback = target.nextElementSibling as HTMLElement;
                                                                        if (fallback) fallback.style.display = 'flex';
                                                                    }}
                                                                />
                                                                <div className={`absolute inset-0 ${getAvatarBgColor(user.name)} text-white flex items-center justify-center text-lg font-bold`} style={{ display: 'none' }}>
                                                                    {getInitials(user.name)}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className={`w-full h-full ${getAvatarBgColor(user.name)} text-white flex items-center justify-center text-lg font-bold rounded-full`}>
                                                                {getInitials(user.name)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                                                        {getRankIcon(user.rank || (index + 1))}
                                                    </div>
                                                </div>

                                                {/* User Info */}
                                                <div className="flex-1 text-left">
                                                    <h3 className="font-bold text-lg text-gray-800 mb-1">{user.name}</h3>
                                                    <Badge className={`${getBadgeColor(user.badge || null)} text-white border-0 text-xs`}>
                                                        {user.badge?.toUpperCase() || 'MEMBER'}
                                                    </Badge>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex-shrink-0 text-right">
                                                    <div className="text-lg font-bold text-blue-600">{user.points.toLocaleString()}</div>
                                                    <div className="text-xs text-gray-500">Points</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Desktop: Podium layout with 2nd-1st-3rd order */}
                            <div className="hidden sm:grid sm:grid-cols-3 gap-6">
                                {users.slice(0, 3).map((user, index) => (
                                    <Card
                                        key={user._id}
                                        className={`
                                            ${index === 0 ? 'order-2 transform scale-105' : ''}
                                            ${index === 1 ? 'order-1' : ''}
                                            ${index === 2 ? 'order-3' : ''}
                                            ${user.isCurrentUser ? 'ring-2 ring-blue-500' : ''}
                                            hover:shadow-xl transition-all duration-300 overflow-hidden
                                        `}
                                    >
                                        <div className={`h-2 ${getBadgeColor(user.badge || null)}`}></div>
                                        <CardContent className="p-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="relative mb-4">
                                                    <div className="relative">
                                                        <div className="w-20 h-20 rounded-full ring-4 ring-white shadow-lg relative overflow-hidden">
                                                            {user.profilePicCloudUrl ? (
                                                                <>
                                                                    <img
                                                                        src={user.profilePicCloudUrl}
                                                                        alt={user.name}
                                                                        className="w-full h-full rounded-full object-cover"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.style.display = 'none';
                                                                            const fallback = target.nextElementSibling as HTMLElement;
                                                                            if (fallback) fallback.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                    <div className={`absolute inset-0 ${getAvatarBgColor(user.name)} text-white flex items-center justify-center text-2xl font-bold`} style={{ display: 'none' }}>
                                                                        {getInitials(user.name)}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className={`w-full h-full ${getAvatarBgColor(user.name)} text-white flex items-center justify-center text-2xl font-bold rounded-full`}>
                                                                    {getInitials(user.name)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                                                            {getRankIcon(user.rank || (index + 1))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-xl text-gray-800 mb-1">{user.name}</h3>
                                                <Badge className={`${getBadgeColor(user.badge || null)} text-white border-0 mb-3 text-sm`}>
                                                    {user.badge?.toUpperCase() || 'MEMBER'}
                                                </Badge>

                                                <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full text-center">
                                                    <div>
                                                        <div className="text-lg sm:text-xl font-bold text-blue-600">{user.points.toLocaleString()}</div>
                                                        <div className="text-xs text-gray-500">Points</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg sm:text-xl font-bold text-green-600">{user.analysisCount}</div>
                                                        <div className="text-xs text-gray-500">
                                                            <span className="sm:hidden">Tests</span>
                                                            <span className="hidden sm:inline">Analyses</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg sm:text-xl font-bold text-orange-600 flex items-center justify-center gap-1">
                                                            <Flame className="h-4 w-4" />
                                                            {user.streak}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Streak</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Remaining Rankings */}
                    {users.length > 3 && (
                        <Card className="shadow-lg">
                            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                    <span className="sm:hidden">Rankings</span>
                                    <span className="hidden sm:inline">Full Rankings</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-0">
                                    {users.slice(3).map((user) => (
                                        <div
                                            key={user._id}
                                            className={`
                      flex items-center p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors
                      ${user.isCurrentUser ? 'bg-blue-50 border-blue-200' : ''}
                    `}
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                                <div className="flex-shrink-0 text-center w-8">
                                                    {getRankIcon(user.rank || 0)}
                                                </div>

                                                <div className="relative flex-shrink-0">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full relative overflow-hidden">
                                                        {user.profilePicCloudUrl ? (
                                                            <>
                                                                <img
                                                                    src={user.profilePicCloudUrl}
                                                                    alt={user.name}
                                                                    className="w-full h-full rounded-full object-cover"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                        const fallback = target.nextElementSibling as HTMLElement;
                                                                        if (fallback) fallback.style.display = 'flex';
                                                                    }}
                                                                />
                                                                <div className={`absolute inset-0 ${getAvatarBgColor(user.name)} text-white flex items-center justify-center text-sm font-bold`} style={{ display: 'none' }}>
                                                                    {getInitials(user.name)}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className={`w-full h-full ${getAvatarBgColor(user.name)} text-white flex items-center justify-center text-sm font-bold rounded-full`}>
                                                                {getInitials(user.name)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {user.streak > 0 && (
                                                        <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                            {user.streak}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                                                            {user.name}
                                                        </h4>
                                                        {user.badge && (
                                                            <Badge className={`${getBadgeColor(user.badge)} text-white border-0 text-xs`}>
                                                                {user.badge.charAt(0).toUpperCase()}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                                                        <div>
                                                            <span className="font-medium text-blue-600">{user.points.toLocaleString()}</span>
                                                            <span className="text-gray-500 ml-1">pts</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-green-600">{user.analysisCount}</span>
                                                            <span className="text-gray-500 ml-1 hidden sm:inline">analyses</span>
                                                            <span className="text-gray-500 ml-1 sm:hidden">tests</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Flame className="h-3 w-3 text-orange-500 mr-1" />
                                                            <span className="font-medium text-orange-600">{user.streak}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {user.isCurrentUser && (
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                                        You
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Empty State */}
                    {users.length === 0 && !loading && (
                        <Card className="text-center py-12">
                            <CardContent>
                                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Rankings Yet</h3>
                                <p className="text-gray-500">
                                    Be the first to complete an analysis and claim your spot on the leaderboard!
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;