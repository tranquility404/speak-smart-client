import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Activity, Award, BarChart3, ChevronRight, Mic, Volume2, Trash2, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NewAnalysisHistoryItem } from "./RecentAnalysis";

export const AnalysisCard: React.FC<{
    analysis: NewAnalysisHistoryItem;
    onDelete?: (requestId: string) => void;
}> = ({ analysis, onDelete }) => {

    // Extract data directly from new format
    const speechRateScore = analysis.quick_results?.speech_rate_score || 0;
    const intonationScore = analysis.quick_results?.intonation_score || 0;
    const energyScore = analysis.quick_results?.energy_score || 0;
    const pauseScore = analysis.quick_results?.pause_score || 0;
    const overallScore = analysis.quick_results?.overall_score || 0;
    const averageWpm = analysis.quick_results?.average_wpm || 0;
    const averageEnergy = analysis.quick_results?.average_energy || 0;
    const totalPauses = analysis.quick_results?.total_pauses || 0;

    // Format date
    const analysisDate = new Date(analysis.requested_at);
    const timeAgo = formatDistanceToNow(analysisDate, { addSuffix: true });

    // Get color based on score
    const getScoreColor = (percent: number) => {
        if (percent >= 80) return "text-green-600";
        if (percent >= 60) return "text-blue-600";
        if (percent >= 40) return "text-yellow-600";
        return "text-red-600";
    };

    // Get category based on score
    const getScoreCategory = (score: number) => {
        if (score >= 80) return "excellent";
        if (score >= 60) return "good";
        if (score >= 40) return "average";
        return "poor";
    };

    // Get badge variant based on category
    const getBadgeVariant = (category: string) => {
        switch (category.toLowerCase()) {
            case 'excellent': return "success";
            case 'good': return "success";
            case 'average': return "warning";
            case 'poor': return "destructive";
            default: return "secondary";
        }
    };

    const navigate = useNavigate()
    const handleViewDetails = () => {
        navigate(`/analyse-report/${analysis.request_id}`)
    };

    const handleDelete = () => {
        if (onDelete && window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
            onDelete(analysis.request_id);
        }
    };

    return (
        <Card className="w-[98%] mx-1 shadow-lg hover:shadow-xl transition-all duration-300 mb-3 sm:mb-4 border-0 bg-gradient-to-br from-white to-gray-50/50 hover:from-white hover:to-blue-50/30">
            <CardHeader className="-mb-3 px-3 sm:px-6">
                <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                        <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800 leading-tight truncate">
                            {analysis.file_name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{timeAgo}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                            variant={getBadgeVariant(getScoreCategory(overallScore)) as any}
                            className="font-medium text-xs sm:text-sm"
                        >
                            <span className="sm:hidden">{getScoreCategory(overallScore).charAt(0).toUpperCase() + getScoreCategory(overallScore).slice(1)}</span>
                            <span className="hidden sm:inline">{Math.round(overallScore)}% Overall</span>
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                {/* Overall Score Highlight */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 sm:p-2.5 border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-100 rounded-md">
                                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm leading-tight">
                                    <span>Overall Performance</span>
                                </h3>
                                <p className="text-xs text-gray-600 hidden sm:block">Your speech analysis score</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-xl sm:text-2xl font-bold leading-none ${getScoreColor(overallScore)}`}>
                                {Math.round(overallScore)}%
                            </div>
                            <Badge variant={getBadgeVariant(getScoreCategory(overallScore)) as any} className="text-xs mt-0.5 hidden sm:inline">
                                {getScoreCategory(overallScore).charAt(0).toUpperCase() + getScoreCategory(overallScore).slice(1)}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Compact Metrics Row */}
                <div className="flex justify-evenly items-center gap-1 sm:gap-2 bg-gray-50 rounded-lg px-2 pt-2 sm:px-2.5 -mb-4">
                    {/* Speech Rate */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-1">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-gray-200"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                                />
                                <path
                                    className="text-emerald-500"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeDasharray={`${speechRateScore}, 100`}
                                    strokeLinecap="round"
                                    fill="none"
                                    d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-700">{Math.round(speechRateScore)}%</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-0.5 sm:gap-1 text-emerald-600 mb-0.5">
                                <BarChart3 className="h-3 w-3" />
                                <span className="text-xs font-medium">Rate</span>
                            </div>
                            <span className="text-xs text-gray-500 leading-none">
                                <span className="sm:hidden">{Math.round(averageWpm)}</span>
                                <span className="hidden sm:inline">{Math.round(averageWpm)} wpm</span>
                            </span>
                        </div>
                    </div>

                    {/* Intonation */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-1">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-gray-200"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                                />
                                <path
                                    className="text-purple-500"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeDasharray={`${intonationScore}, 100`}
                                    strokeLinecap="round"
                                    fill="none"
                                    d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-700">{Math.round(intonationScore)}%</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-0.5 sm:gap-1 text-purple-600 mb-0.5">
                                <Activity className="h-3 w-3" />
                                <span className="text-xs font-medium">Tone</span>
                            </div>
                            <span className="text-xs text-gray-500 leading-none">
                                <span className="sm:hidden">Var</span>
                                <span className="hidden sm:inline">Variation</span>
                            </span>
                        </div>
                    </div>

                    {/* Energy */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-1">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-gray-200"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                                />
                                <path
                                    className="text-orange-500"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeDasharray={`${energyScore}, 100`}
                                    strokeLinecap="round"
                                    fill="none"
                                    d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-700">{Math.round(energyScore)}%</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-0.5 sm:gap-1 text-orange-600 mb-0.5">
                                <Volume2 className="h-3 w-3" />
                                <span className="text-xs font-medium">Energy</span>
                            </div>
                            <span className="text-xs text-gray-500 leading-none">{(averageEnergy * 100).toFixed(1)}%</span>
                        </div>
                    </div>

                    {/* Confidence */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-1">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-gray-200"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                                />
                                <path
                                    className="text-indigo-500"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeDasharray={`${pauseScore}, 100`}
                                    strokeLinecap="round"
                                    fill="none"
                                    d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-700">{Math.round(pauseScore)}%</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-0.5 sm:gap-1 text-indigo-600 mb-0.5">
                                <Mic className="h-3 w-3" />
                                <span className="text-xs font-medium">Flow</span>
                            </div>
                            <span className="text-xs text-gray-500 leading-none">
                                <span className="sm:hidden">{totalPauses}</span>
                                <span className="hidden sm:inline">{totalPauses} pauses</span>
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center border-t border-gray-100 px-3 sm:px-6">
                <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 mr-2 h-8 text-xs sm:text-sm"
                    onClick={handleViewDetails}
                >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    <span className="sm:hidden">View Details</span>
                    <span className="hidden sm:inline">View Detailed Analysis</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-colors h-8 px-2"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};