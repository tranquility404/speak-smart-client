import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

import AudioPlayer from "@/components/AudioPlayer";
import { VoiceParams } from "./VoiceParams";
import BottomSheet from "./BottomSheet";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnalysisResult, AnalysisStatusResponse } from "../../types/analysis";
import { getAnalysis, getAnalysisStatus } from "@/api/apiRequests";

export function AnalysisReport({ type }: { type: "live" | "old" }) {
    const { id } = useParams<{ id: string }>();
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [newAnalysis, setNewAnalysis] = useState<AnalysisStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [polling, setPolling] = useState(false);

    // Load full analysis JSON from Cloudinary
    const loadFullAnalysisJson = async (analysisResultUrl: string) => {
        try {
            console.log("=== LOADING FULL ANALYSIS JSON ===");
            console.log("Fetching from URL:", analysisResultUrl);
            const response = await fetch(analysisResultUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch analysis JSON: ${response.statusText}`);
            }
            const fullAnalysis = await response.json();
            console.log("=== FULL ANALYSIS JSON RECEIVED ===");
            console.log("Complete object:", fullAnalysis);
            console.log("Object keys:", Object.keys(fullAnalysis));
            console.log("Object structure:");
            Object.keys(fullAnalysis).forEach(key => {
                console.log(`  ${key}:`, typeof fullAnalysis[key], fullAnalysis[key]);
            });
            console.log("===================================");
            return fullAnalysis;
        } catch (error) {
            console.error("Error loading full analysis JSON:", error);
            // Don't fail the entire analysis if JSON loading fails
            return null;
        }
    };

    // New async analysis loading - use new format directly
    const loadNewAnalysis = async (id: string) => {
        try {
            setLoading(true);
            const response = await getAnalysisStatus(id);
            const result = response.data;

            // Check if the response contains direct analysis data (new format)
            if (result.analysis_data) {
                console.log("=== DIRECT ANALYSIS DATA ===");
                console.log("Direct analysis data:", result.analysis_data);
                setAnalysis(result.analysis_data);
                setLoading(false);
                return;
            }

            // Handle the old async workflow
            setNewAnalysis(result);

            if (result.status === 'COMPLETED') {
                // Load full analysis JSON if available
                if (result.analysis_result_url) {
                    const fullAnalysis = await loadFullAnalysisJson(result.analysis_result_url);
                    if (fullAnalysis) {
                        setAnalysis(fullAnalysis);
                    }
                }
                setLoading(false);
            } else if (result.status === 'FAILED') {
                setError(result.error || 'Analysis failed');
                setLoading(false);
            } else {
                // Still processing, start polling
                setPolling(true);
                setTimeout(() => loadNewAnalysis(id), 3000);
            }
        } catch (error) {
            console.error("Error loading analysis:", error);
            setError("Failed to load analysis data");
            setLoading(false);
        }
    };

    // Legacy analysis loading for old format - convert to new format
    const loadOldAnalysis = async (id: string) => {
        try {
            const response = await getAnalysis(id);
            console.log("=== OLD FORMAT ANALYSIS DATA ===");
            console.log("Legacy analysis data received:", response.data);
            console.log("===================================");
            // Note: This might need conversion if old format is very different
            // For now, assume the API returns compatible format or update accordingly
            setAnalysis(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading old analysis:", error);
            setError("Failed to load analysis data");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            // Try new async API first, fallback to legacy if needed
            if (type === "live") {
                // For new async workflow, try the new API first
                loadNewAnalysis(id);
            } else {
                // For legacy analyses, use old API
                loadOldAnalysis(id);
            }
        }
    }, [id, type]);

    const getScoreColor = (percent: number) => {
        if (percent >= 80) return "text-green-600";
        if (percent >= 65) return "text-emerald-500";
        if (percent >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getProgressColor = (percent: number) => {
        if (percent >= 80) return "bg-green-600";
        if (percent >= 65) return "bg-emerald-500";
        if (percent >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    if (loading) {
        return (
            <Card className="w-full max-w-4xl mx-auto shadow-lg mt-4">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Voice Analysis</CardTitle>
                    <CardDescription>
                        {polling ? "Processing your audio analysis..." : "Loading analysis data..."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* New Analysis Status Display */}
                    {newAnalysis && (
                        <Alert className="mb-4">
                            <div className="flex items-center gap-2">
                                {polling && <Loader2 className="h-4 w-4 animate-spin" />}
                                <AlertDescription>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Status:</span>
                                            <Badge variant={
                                                newAnalysis.status === 'COMPLETED' ? 'default' :
                                                    newAnalysis.status === 'FAILED' ? 'destructive' : 'secondary'
                                            }>
                                                {newAnalysis.status}
                                            </Badge>
                                        </div>
                                        {newAnalysis.processing_time_ms && (
                                            <div className="flex justify-between">
                                                <span>Processing Time:</span>
                                                <span>{Math.round(newAnalysis.processing_time_ms / 1000)}s</span>
                                            </div>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            {newAnalysis.message}
                                        </p>
                                    </div>
                                </AlertDescription>
                            </div>
                        </Alert>
                    )}

                    <div className="flex justify-center items-center py-8">
                        <div className="w-32 h-32 relative flex items-center justify-center">
                            <svg className="animate-spin h-16 w-16 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full max-w-4xl mx-auto shadow-lg mt-4">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-red-500">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center p-6">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <p className="text-lg font-medium">{error}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!analysis) return null;

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg mt-4 overflow-hidden border-t-4" style={{ borderTopColor: getProgressColor(analysis.overallScore) }}>
            <CardHeader className="pb-2 bg-muted/30">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold">Voice Analysis Report</CardTitle>
                        <CardDescription>
                            Detailed breakdown of your speech performance
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full border shadow-sm">
                            <span className="text-sm font-medium">Status:</span>
                            <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="ml-1 text-sm">Complete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {/* Audio Player */}
                <div className="mb-6 bg-muted/20 p-4 rounded-lg border">
                    <h3 className="text-sm font-medium mb-2 text-muted-foreground">AUDIO RECORDING</h3>
                    {analysis.audioUrl ? (
                        <AudioPlayer audioStr={analysis.audioUrl} />
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">
                            No audio URL available
                        </div>
                    )}
                </div>

                {/* Quick Stats from New Analysis */}
                {newAnalysis?.quick_results && (
                    <div className="mb-6 bg-background p-4 rounded-lg border shadow-sm">
                        <h3 className="text-sm font-medium mb-3 text-muted-foreground">ANALYSIS SUMMARY</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {newAnalysis.quick_results.duration_seconds?.toFixed(1) || "0"}s
                                </div>
                                <div className="text-xs text-muted-foreground">Duration</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {newAnalysis.quick_results.average_wpm?.toFixed(0) || "0"}
                                </div>
                                <div className="text-xs text-muted-foreground">Words/Min</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {newAnalysis.quick_results.total_pauses || "0"}
                                </div>
                                <div className="text-xs text-muted-foreground">Pauses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {((newAnalysis.quick_results.average_energy || 0) * 100).toFixed(0)}%
                                </div>
                                <div className="text-xs text-muted-foreground">Avg Energy</div>
                            </div>
                        </div>
                        {newAnalysis.quick_results.ai_analysis_available && (
                            <div className="mt-3 p-2 bg-blue-50 rounded text-center">
                                <div className="text-xs text-blue-600 font-medium">✨ AI Analysis Available</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Score Overview */}

                {/* Overall Score */}
                <div className="md:col-span-1 bg-background rounded-xl p-4 border shadow-sm mb-8">
                    <h3 className="text-sm font-medium text-center text-muted-foreground mb-2">
                        OVERALL SCORE
                    </h3>
                    <div className="flex justify-center items-center">
                        <div className="relative w-32 h-32">
                            <>
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle
                                        className="text-muted/30 stroke-current"
                                        strokeWidth="10"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                    />
                                    <circle
                                        className={`${getProgressColor(analysis.overallScore)} stroke-current`}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.overallScore / 100)}`}
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                                        {analysis.overallScore.toFixed(0)}
                                    </span>
                                    <span className="text-xs mt-1">out of 100</span>
                                </div>
                            </>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        {analysis.overallScore >= 80 && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Excellent</Badge>
                        )}
                        {analysis.overallScore >= 65 && analysis.overallScore < 80 && (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Good</Badge>
                        )}
                        {analysis.overallScore >= 50 && analysis.overallScore < 65 && (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Average</Badge>
                        )}
                        {analysis.overallScore < 50 && (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Needs Improvement</Badge>
                        )}
                    </div>
                </div>

                {/* Key Metrics using VoiceParams */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4 mb-8">
                    <VoiceParams
                        type="speech-rate"
                        data={analysis.speechRate}
                        label="Speech Rate"
                        unit="wpm"
                    />
                    <VoiceParams
                        type="intonation"
                        data={analysis.intonation}
                        label="Intonation"
                        unit="Hz"
                    />
                    <VoiceParams
                        type="energy"
                        data={analysis.energy}
                        label="Energy"
                        unit="%"
                    />
                    <VoiceParams
                        type="confidence"
                        data={analysis.pauses}
                        label="Confidence"
                        unit="%"
                    />
                </div>

                {/* Detailed Analysis - Use BottomSheet */}
                <BottomSheet analysis={analysis} />

            </CardContent>
        </Card>
    );
}