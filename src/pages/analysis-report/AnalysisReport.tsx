import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle, RefreshCw, Play, BarChart3, Activity, Award } from "lucide-react";

import AudioPlayer from "@/components/AudioPlayer";
import AnalysisLoadingScreen from "@/components/AnalysisLoadingScreen";
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
                // Still processing, continue polling
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

    const getProgressColor = (percent: number) => {
        if (percent >= 90) return "stroke-emerald-500";
        if (percent >= 80) return "stroke-green-500";
        if (percent >= 70) return "stroke-lime-500";
        if (percent >= 60) return "stroke-yellow-500";
        if (percent >= 50) return "stroke-amber-500";
        if (percent >= 40) return "stroke-orange-500";
        return "stroke-red-500";
    };

    const getScoreGradient = (percent: number) => {
        if (percent >= 90) return "from-emerald-400 to-emerald-600";
        if (percent >= 80) return "from-green-400 to-green-600";
        if (percent >= 70) return "from-lime-400 to-lime-600";
        if (percent >= 60) return "from-yellow-400 to-yellow-600";
        if (percent >= 50) return "from-amber-400 to-amber-600";
        if (percent >= 40) return "from-orange-400 to-orange-600";
        return "from-red-400 to-red-600";
    };

    if (loading || (newAnalysis && newAnalysis.status !== 'COMPLETED')) {
        const status = newAnalysis?.status || 'PENDING';
        return (
            <AnalysisLoadingScreen
                status={status}
                processingTimeMs={newAnalysis?.processing_time_ms}
                processingStartedAt={newAnalysis?.processing_started_at}
                requestedAt={newAnalysis?.requested_at}
                requestId={newAnalysis?.request_id}
                message={newAnalysis?.message}
            />
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md mx-auto shadow-lg border border-red-200">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-800">Analysis Error</CardTitle>
                        <CardDescription className="text-red-600 font-medium mt-2">{error}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <button
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-6 px-4">
            <Card className="w-full max-w-6xl mx-auto shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-200 py-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BarChart3 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-800">Voice Analysis Report</CardTitle>
                                <CardDescription className="text-gray-600 mt-1">
                                    Comprehensive breakdown of your speech performance
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">Analysis Complete</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-8">
                    {/* Audio Player Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Play className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">Audio Recording</h3>
                                <p className="text-sm text-gray-600">Your original speech sample</p>
                            </div>
                        </div>
                        {analysis.audioUrl ? (
                            <AudioPlayer audioStr={analysis.audioUrl} />
                        ) : (
                            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p className="font-medium">No audio available</p>
                                <p className="text-sm">Audio file could not be loaded</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats from New Analysis */}
                    {newAnalysis?.quick_results && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Activity className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">Analysis Summary</h3>
                                    <p className="text-sm text-gray-600">Key metrics from your speech</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {newAnalysis.quick_results.duration_seconds?.toFixed(1) || "0"}s
                                    </div>
                                    <div className="text-sm text-blue-700 font-medium mt-1">Duration</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="text-2xl font-bold text-green-600">
                                        {newAnalysis.quick_results.average_wpm?.toFixed(0) || "0"}
                                    </div>
                                    <div className="text-sm text-green-700 font-medium mt-1">Words/Min</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {newAnalysis.quick_results.total_pauses || "0"}
                                    </div>
                                    <div className="text-sm text-purple-700 font-medium mt-1">Pauses</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {((newAnalysis.quick_results.average_energy || 0) * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-sm text-orange-700 font-medium mt-1">Avg Energy</div>
                                </div>
                            </div>
                            {newAnalysis.quick_results.ai_analysis_available && (
                                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-center">
                                    <div className="text-sm text-blue-700 font-medium flex items-center justify-center gap-2">
                                        <Award className="h-4 w-4" />
                                        AI Analysis Available - Detailed insights included
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Overall Score */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Award className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg text-gray-800">Overall Performance</h3>
                                <p className="text-sm text-gray-600">Your comprehensive speech score</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="relative w-40 h-40">
                                {/* Background Circle */}
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        className="text-gray-200 stroke-current"
                                        strokeWidth="6"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                    />
                                </svg>

                                {/* Animated Progress Circle */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        className={`${getProgressColor(analysis.overallScore)} transition-all duration-1000 ease-in-out`}
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.overallScore / 100)}`}
                                        style={{
                                            transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease-in-out',
                                            filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.1))'
                                        }}
                                    />
                                </svg>

                                {/* Score Display */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreGradient(analysis.overallScore)} flex flex-col items-center justify-center shadow-lg transition-all duration-500 ease-in-out`}>
                                        <span className="text-4xl font-bold text-white drop-shadow-sm">
                                            {analysis.overallScore.toFixed(0)}
                                        </span>
                                        <span className="text-sm text-white/90 font-medium">out of 100</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            {analysis.overallScore >= 80 && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 text-sm font-semibold">🎉 Excellent Performance</Badge>
                            )}
                            {analysis.overallScore >= 65 && analysis.overallScore < 80 && (
                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-4 py-2 text-sm font-semibold">✅ Good Performance</Badge>
                            )}
                            {analysis.overallScore >= 50 && analysis.overallScore < 65 && (
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-4 py-2 text-sm font-semibold">⚡ Average Performance</Badge>
                            )}
                            {analysis.overallScore < 50 && (
                                <Badge className="bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2 text-sm font-semibold">💪 Room for Improvement</Badge>
                            )}
                        </div>
                    </div>

                    {/* Key Metrics using VoiceParams */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">Key Performance Metrics</h3>
                                <p className="text-sm text-gray-600">Detailed analysis of your speech parameters</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>

                    {/* Detailed Analysis - Use BottomSheet */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <BottomSheet analysis={analysis} />
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}