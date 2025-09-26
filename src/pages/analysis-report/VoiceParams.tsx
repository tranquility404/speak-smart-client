import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Info, Target, Zap, Activity, Mic } from "lucide-react";
import { useState } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { EnergyAnalysis, IntonationAnalysis, PauseAnalysis, SpeechRateAnalysis } from "@/types/analysis";

type VoiceData =
    | SpeechRateAnalysis
    | IntonationAnalysis
    | EnergyAnalysis
    | PauseAnalysis;

interface VoiceCardProps {
    type: "speech-rate" | "intonation" | "energy" | "confidence";
    data: VoiceData;
    label: string;
    unit: string;
    description?: string;
}

export function VoiceParams({ type, data, label, unit }: VoiceCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Get icon for each voice parameter type
    const getIcon = () => {
        switch (type) {
            case "speech-rate": return Target;
            case "intonation": return Activity;
            case "energy": return Zap;
            case "confidence": return Mic;
            default: return Info;
        }
    };

    const IconComponent = getIcon();

    // Enhanced score color function with more granular ranges
    const getScoreColor = (percent: number) => {
        if (percent >= 85) return "text-emerald-600";
        if (percent >= 75) return "text-green-600";
        if (percent >= 65) return "text-lime-600";
        if (percent >= 55) return "text-yellow-600";
        if (percent >= 45) return "text-amber-600";
        if (percent >= 35) return "text-orange-600";
        return "text-red-600";
    };

    // Progress bar color with gradient
    const getProgressGradient = (percent: number) => {
        if (percent >= 85) return "bg-gradient-to-r from-emerald-500 to-green-500";
        if (percent >= 75) return "bg-gradient-to-r from-green-500 to-lime-500";
        if (percent >= 65) return "bg-gradient-to-r from-lime-500 to-yellow-500";
        if (percent >= 55) return "bg-gradient-to-r from-yellow-500 to-amber-500";
        if (percent >= 45) return "bg-gradient-to-r from-amber-500 to-orange-500";
        if (percent >= 35) return "bg-gradient-to-r from-orange-500 to-red-500";
        return "bg-gradient-to-r from-red-500 to-pink-500";
    };

    // Icon color matching the score
    const getIconColor = (percent: number) => {
        if (percent >= 85) return "text-emerald-600 bg-emerald-100";
        if (percent >= 75) return "text-green-600 bg-green-100";
        if (percent >= 65) return "text-lime-600 bg-lime-100";
        if (percent >= 55) return "text-yellow-600 bg-yellow-100";
        if (percent >= 45) return "text-amber-600 bg-amber-100";
        if (percent >= 35) return "text-orange-600 bg-orange-100";
        return "text-red-600 bg-red-100";
    };

    // Handle loading and error states with improved UI
    if (!data) {
        return (
            <Card className="h-full bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
                <CardContent className="flex items-center justify-center h-full p-4">
                    <div className="text-center space-y-2">
                        <div className="p-2 bg-gray-100 inline-flex rounded-md">
                            <Info className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-gray-700 font-medium text-sm">Not Enough Data</p>
                            <p className="text-gray-500 text-xs">Insufficient audio data</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const metric = type == "speech-rate" ? data as SpeechRateAnalysis :
        type == "intonation" ? data as IntonationAnalysis :
            type == "energy" ? data as EnergyAnalysis :
                type == "confidence" ? data as PauseAnalysis :
                    data as any;

    const displayValue = type == "speech-rate" ? metric.avgSpeechRate.toFixed(0) :
        type == "intonation" ? metric.averagePitch.toFixed(0) :
            metric.score.toFixed(0);

    return (
        <Card className={`h-full transition-all hover:shadow-md duration-200`}>
            <CardHeader className="px-4 py-3 flex flex-row items-center gap-3">
                <div className={`p-1.5 rounded-md ${getIconColor(metric.score)}`}>
                    <IconComponent className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-semibold text-gray-800">
                    {label}
                </CardTitle>
                <Badge
                    variant={metric.score >= 70 ? "success" : metric.score >= 50 ? "warning" : "destructive"}
                    className="capitalize text-xs font-medium ml-auto"
                >
                    {metric.category}
                </Badge>
            </CardHeader>

            <CardContent className="px-4 py-3 space-y-3">
                {/* Compact Score and Progress */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-end gap-2">
                        <span className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                            {displayValue}
                        </span>
                        <span className="text-xs text-gray-500 mb-1">{unit}</span>
                    </div>
                    <span className={`text-sm font-semibold ${getScoreColor(metric.score)}`}>
                        {metric.score.toFixed(0)}%
                    </span>
                </div>

                <ProgressPrimitive.Root
                    className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200/60"
                    value={metric.score}
                >
                    <ProgressPrimitive.Indicator
                        className={`h-full w-full ${getProgressGradient(metric.score)} transition-all duration-500 ease-out`}
                        style={{ transform: `translateX(-${100 - metric.score}%)` }}
                    />
                </ProgressPrimitive.Root>

                {/* AI Feedback Section */}
                <div
                    className="flex items-center justify-between cursor-pointer p-2 hover:bg-white/30 rounded-md transition-colors duration-150"
                    onClick={() => setIsExpanded(prev => !prev)}
                    role="button"
                    aria-expanded={isExpanded}
                    tabIndex={0}
                >
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium text-gray-700">AI Feedback</p>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                </div>

                {isExpanded && (
                    <div className="bg-white/50 p-3 rounded-md border border-white/30">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {metric.feedback}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}