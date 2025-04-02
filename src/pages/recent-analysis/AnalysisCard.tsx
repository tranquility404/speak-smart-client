import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { Activity, Award, BarChart3, ChevronRight, Mic, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Analysis } from "./RecentAnalysis";

interface AnalysisMetric {
    avg: number;
    percent: number;
    category: string;
}

export const AnalysisCard: React.FC<{ 
    analysis: Analysis;
}> = ({ analysis }) => {

    const speechRate: AnalysisMetric = JSON.parse(analysis.speech_rate);
    const intonation: AnalysisMetric = JSON.parse(analysis.intonation);
    const energy: AnalysisMetric = JSON.parse(analysis.energy);
    const confidence: AnalysisMetric = JSON.parse(analysis.confidence);

    // Format date
    const analysisDate = new Date(analysis.request_made_at);
    const timeAgo = formatDistanceToNow(analysisDate, { addSuffix: true });

    // Get color based on score
    const getScoreColor = (percent: number) => {
        if (percent >= 80) return "text-green-600";
        if (percent >= 60) return "text-blue-600";
        if (percent >= 40) return "text-yellow-600";
        return "text-red-600";
    };

    // Get badge color based on category
    const getBadgeVariant = (category: string) => {
        switch (category.toLowerCase()) {
            case 'good': return "success";
            case 'less pauses': return "success";
            case 'moderate': return "warning";
            case 'poor': return "destructive";
            default: return "secondary";
        }
    };

    const navigate = useNavigate()
    const handleViewDetails = () => {
        navigate(`/analysis-history/${analysis._id}`)
    };

    return (
        <Card className="w-full shadow-sm hover:shadow-md transition-shadow mb-4">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{analysis.transcript}...</CardTitle>
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
                            <Badge variant={getBadgeVariant(speechRate.category) as any}>
                                {speechRate.category.charAt(0).toUpperCase() + speechRate.category.slice(1)}
                            </Badge>
                        </div>
                        <Progress value={speechRate.percent} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{Math.round(speechRate.avg)} wpm</span>
                            <span className={getScoreColor(speechRate.percent)}>{Math.round(speechRate.percent)}%</span>
                        </div>
                    </div>

                    {/* Intonation */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Activity className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm font-medium">Intonation</span>
                            </div>
                            <Badge variant={getBadgeVariant(intonation.category) as any}>
                                {intonation.category.charAt(0).toUpperCase() + intonation.category.slice(1)}
                            </Badge>
                        </div>
                        <Progress value={intonation.percent} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{Math.round(intonation.avg)} Hz</span>
                            <span className={getScoreColor(intonation.percent)}>{Math.round(intonation.percent)}%</span>
                        </div>
                    </div>

                    {/* Energy */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Volume2 className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm font-medium">Energy</span>
                            </div>
                            <Badge variant={getBadgeVariant(energy.category) as any}>
                                {energy.category.charAt(0).toUpperCase() + energy.category.slice(1)}
                            </Badge>
                        </div>
                        <Progress value={energy.percent} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{energy.avg.toFixed(3)}</span>
                            <span className={getScoreColor(energy.percent)}>{Math.round(energy.percent)}%</span>
                        </div>
                    </div>

                    {/* Confidence */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Mic className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm font-medium">Confidence</span>
                            </div>
                            <Badge variant={getBadgeVariant(confidence.category) as any}>
                                {confidence.category.charAt(0).toUpperCase() + confidence.category.slice(1).replace(/([A-Z])/g, ' $1')}
                            </Badge>
                        </div>
                        <Progress value={confidence.percent} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{Math.round(confidence.avg)}</span>
                            <span className={getScoreColor(confidence.percent)}>{Math.round(confidence.percent)}%</span>
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
                <span className={`text-lg font-bold ${getScoreColor(analysis.conversation_score)}`}>
                    {Math.round(analysis.conversation_score)}%
                </span>
            </CardFooter>
        </Card>
    );
};