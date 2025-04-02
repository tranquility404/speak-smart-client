import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfidenceData, EnergyData, IntonationData, SpeechRateData } from "@/types/analysis";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";
// import { Progress, ProgressIndicator } from "@radix-ui/react-progress";
import * as ProgressPrimitive from "@radix-ui/react-progress";

type VoiceData =
    | SpeechRateData
    | IntonationData
    | EnergyData
    | ConfidenceData;

interface VoiceCardProps {
    status: "In Progress..." | "Loaded✅";
    type: "speech-rate" | "intonation" | "energy" | "confidence";
    data?: VoiceData;
    label: string;
    unit: string;
    description?: string;
}

export function VoiceParams({ status, type, data, label, unit }: VoiceCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Enhanced score color function with more granular ranges
    const getScoreColor = (percent: number) => {
        if (percent >= 80) return "text-emerald-500";
        if (percent >= 70) return "text-green-500";
        if (percent >= 60) return "text-lime-500";
        if (percent >= 50) return "text-yellow-500";
        if (percent >= 40) return "text-amber-500";
        return "text-red-500";
    };

    // Progress bar color based on score
    const getProgressColor = (percent: number) => {
        if (percent >= 80) return "bg-emerald-500";
        if (percent >= 70) return "bg-green-500";
        if (percent >= 60) return "bg-lime-500";
        if (percent >= 50) return "bg-yellow-500";
        if (percent >= 40) return "bg-amber-500";
        return "bg-red-500";
    };

    // Handle loading and error states with improved UI
    if (status !== "Loaded✅" && status !== "In Progress...") {
        return (
            <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full p-6">
                    <div className="text-center space-y-2">
                        <div className="p-2 bg-muted inline-flex rounded-full mx-auto">
                            <Info className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium">Not Enough Data</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (status !== "Loaded✅") {
        return (
            <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full p-6">
                    <div className="text-center space-y-2">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-muted-foreground font-medium">Analyzing...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full p-6">
                    <div className="text-center space-y-2">
                        <div className="p-2 bg-red-100 inline-flex rounded-full mx-auto">
                            <Info className="h-5 w-5 text-red-500" />
                        </div>
                        <p className="text-red-500 font-medium">No data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const metric = type == "speech-rate" ? data as SpeechRateData :
        type == "intonation" ? data as IntonationData :
            type == "energy" ? data as EnergyData :
                type == "confidence" ? data as ConfidenceData :
                    data as any;

    const displayValue = type == "speech-rate" || type == "intonation"
        ? metric.avg.toFixed(0)
        : metric.percent.toFixed(0);

    return (
        <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="px-4 flex flex-row items-center justify-between">
                <div className="flex items-center">
                    <CardTitle className="text-base sm:text-lg">
                        {label}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="px-4 space-y-4">
                <div>
                    <div className="flex items-end gap-2 mb-2">
                        <span className={`text-2xl sm:text-3xl font-bold ${getScoreColor(metric.percent)}`}>
                            {displayValue}
                        </span>
                        <span className="text-xs text-muted-foreground mb-1">{unit}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <ProgressPrimitive.Root
                            className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200"
                            value={metric.percent}
                        >
                            <ProgressPrimitive.Indicator
                                className={`h-full w-full ${getProgressColor(metric.percent)} transition-all`}
                                style={{ transform: `translateX(-${100 - metric.percent}%)` }}
                            />
                        </ProgressPrimitive.Root>
                        <span className={`text-xs font-medium whitespace-nowrap ${getScoreColor(metric.percent)}`}>
                            {metric.percent.toFixed(0)}%
                        </span>
                    </div>
                </div>

                <Badge variant={metric.percent >= 70 ? "success" : metric.percent >= 50 ? "warning" : "destructive"} className="capitalize text-xs font-medium">
                    {metric.category}
                </Badge>

                <div
                    className="flex items-center justify-between cursor-pointer pt-1 hover:bg-muted/20 rounded-md transition-colors -mx-1 px-1"
                    onClick={() => setIsExpanded(prev => !prev)}
                    role="button"
                    aria-expanded={isExpanded}
                    tabIndex={0}
                >
                    <p className="text-sm font-medium">AI Feedback</p>
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>

                {isExpanded && (
                    <div className="bg-muted/10 p-3 rounded-md border border-muted text-sm">
                        {metric.remark}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}