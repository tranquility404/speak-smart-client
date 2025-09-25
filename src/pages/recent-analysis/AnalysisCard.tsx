import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { Activity, Award, BarChart3, ChevronRight, Mic, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NewAnalysisHistoryItem } from "./RecentAnalysis";

export const AnalysisCard: React.FC<{
    analysis: NewAnalysisHistoryItem;
}> = ({ analysis }) => {

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

    return (
        <Card className="w-full shadow-sm hover:shadow-md transition-shadow mb-4">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                        {analysis.quick_results?.transcription_preview || analysis.file_name}
                        {analysis.quick_results?.transcription_preview && analysis.quick_results.transcription_preview.length > 50 ? '...' : ''}
                    </CardTitle>
                    <Badge>{timeAgo}</Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Speech Rate */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm font-medium">Speech Rate</span>
                            </div>
                            <Badge variant={getBadgeVariant(getScoreCategory(speechRateScore)) as any}>
                                {getScoreCategory(speechRateScore).charAt(0).toUpperCase() + getScoreCategory(speechRateScore).slice(1)}
                            </Badge>
                        </div>
                        <Progress value={speechRateScore} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{Math.round(averageWpm)} wpm</span>
                            <span className={getScoreColor(speechRateScore)}>{Math.round(speechRateScore)}%</span>
                        </div>
                    </div>

                    {/* Intonation */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Activity className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm font-medium">Intonation</span>
                            </div>
                            <Badge variant={getBadgeVariant(getScoreCategory(intonationScore)) as any}>
                                {getScoreCategory(intonationScore).charAt(0).toUpperCase() + getScoreCategory(intonationScore).slice(1)}
                            </Badge>
                        </div>
                        <Progress value={intonationScore} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Pitch Analysis</span>
                            <span className={getScoreColor(intonationScore)}>{Math.round(intonationScore)}%</span>
                        </div>
                    </div>

                    {/* Energy */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Volume2 className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm font-medium">Energy</span>
                            </div>
                            <Badge variant={getBadgeVariant(getScoreCategory(energyScore)) as any}>
                                {getScoreCategory(energyScore).charAt(0).toUpperCase() + getScoreCategory(energyScore).slice(1)}
                            </Badge>
                        </div>
                        <Progress value={energyScore} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{(averageEnergy * 100).toFixed(1)}%</span>
                            <span className={getScoreColor(energyScore)}>{Math.round(energyScore)}%</span>
                        </div>
                    </div>

                    {/* Confidence (from Pauses) */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Mic className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm font-medium">Confidence</span>
                            </div>
                            <Badge variant={getBadgeVariant(getScoreCategory(pauseScore)) as any}>
                                {getScoreCategory(pauseScore).charAt(0).toUpperCase() + getScoreCategory(pauseScore).slice(1)}
                            </Badge>
                        </div>
                        <Progress value={pauseScore} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{totalPauses} pauses</span>
                            <span className={getScoreColor(pauseScore)}>{Math.round(pauseScore)}%</span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 mt-2"
                    onClick={handleViewDetails}
                >
                    View Detailed Analysis
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </CardContent>

            <CardFooter className="flex justify-between items-center pt-2 border-t">
                <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">Overall Score</span>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(overallScore)}`}>
                    {Math.round(overallScore)}%
                </span>
            </CardFooter>
        </Card>
    );
};