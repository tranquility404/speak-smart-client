import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

import AudioPlayer from "@/components/AudioPlayer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SpeechAnalysis from "../../types/analysis";
import { VoiceParams } from "./VoiceParams";
import { getAnalysis } from "@/api/apiRequests";

export function AnalysisReport({ type }: { type: "live" | "old" }) {
    const { id } = useParams<{ id: string }>();
    const [analysis, setAnalysis] = useState<SpeechAnalysis>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const connectWebSocket = (id: string): (() => void) => {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const ws = new WebSocket(`ws://localhost:8000/analysis-report/${id}?token=${token}`);

        ws.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                console.log("Analysis data received:", response);
                setAnalysis(response);
                setLoading(false);
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
                setError("Failed to parse analysis data");
                setLoading(false);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setError("Connection error. Please try again later.");
            setLoading(false);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            ws.close();
        };
    };

    const loadOldAnalysis = async (id: string) => {
        try {
            const response = await getAnalysis(id);
            console.log("Analysis data received:", response.data);
            setAnalysis(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
            setError("Failed to parse analysis data");
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            if (type == "live")
                connectWebSocket(id);
            else
                loadOldAnalysis(id);
        }

    }, [id]);

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

    const getStatusIcon = (status: string) => {
        if (status === "Loaded✅") return <CheckCircle className="h-4 w-4 text-green-500" />;
        if (status === "In Progress...") return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    };

    if (loading) {
        return (
            <Card className="w-full max-w-4xl mx-auto shadow-lg mt-4">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Voice Analysis</CardTitle>
                    <CardDescription>Your speech is being analyzed...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
        <Card className="w-full max-w-4xl mx-auto shadow-lg mt-4 overflow-hidden border-t-4" style={{ borderTopColor: getProgressColor(analysis.conversation_score.data) }}>
            <CardHeader className="pb-2 bg-muted/30">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold">Voice Analysis Report</CardTitle>
                        <CardDescription>
                            Detailed breakdown of your speech performance
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full border shadow-sm">
                        <span className="text-sm font-medium">Status:</span>
                        <div className="flex items-center">
                            {getStatusIcon(analysis.conversation_score.status)}
                            <span className="ml-1 text-sm">
                                {analysis.conversation_score.status === "Loaded✅" ? "Complete" : "Processing"}
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {/* Audio Player */}
                <div className="mb-6 bg-muted/20 p-4 rounded-lg border">
                    <h3 className="text-sm font-medium mb-2 text-muted-foreground">AUDIO RECORDING</h3>
                    <AudioPlayer audioStr={analysis.audio} />
                </div>

                {/* Score Overview */}

                {/* Overall Score */}
                <div className="md:col-span-1 bg-background rounded-xl p-4 border shadow-sm mb-8">
                    <h3 className="text-sm font-medium text-center text-muted-foreground mb-2">
                        OVERALL SCORE
                    </h3>
                    <div className="flex justify-center items-center">
                        <div className="relative w-32 h-32">
                            {analysis.conversation_score.status === "Loaded✅" ? (
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
                                            className={`${getProgressColor(analysis.conversation_score.data)} stroke-current`}
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="transparent"
                                            strokeDasharray={`${2 * Math.PI * 40}`}
                                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.conversation_score.data / 100)}`}
                                            transform="rotate(-90 50 50)"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-3xl font-bold ${getScoreColor(analysis.conversation_score.data)}`}>
                                            {analysis.conversation_score.data.toFixed(0)}
                                        </span>
                                        <span className="text-xs mt-1">out of 100</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        {analysis.conversation_score.data >= 80 && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Excellent</Badge>
                        )}
                        {analysis.conversation_score.data >= 65 && analysis.conversation_score.data < 80 && (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Good</Badge>
                        )}
                        {analysis.conversation_score.data >= 50 && analysis.conversation_score.data < 65 && (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Average</Badge>
                        )}
                        {analysis.conversation_score.data < 50 && (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Needs Improvement</Badge>
                        )}
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4 mb-8">
                    <VoiceParams
                        status={analysis.speech_rate.status}
                        data={analysis.speech_rate.data}
                        type={"speech-rate"}
                        label="Speech Rate"
                        unit="wpm"
                    />
                    <VoiceParams
                        status={analysis.intonation.status}
                        data={analysis.intonation.data}
                        type={"intonation"}
                        unit="Hz"
                        label="Intonation"
                    />
                    <VoiceParams
                        status={analysis.energy.status}
                        data={analysis.energy.data}
                        type={"energy"}
                        unit="%"
                        label="Energy"
                    />
                    <VoiceParams
                        status={analysis.confidence.status}
                        data={analysis.confidence.data}
                        type={"confidence"}
                        unit="%"
                        label="Confidence"
                    />
                </div>

                {/* Detailed Analysis Tabs */}
                <Tabs defaultValue="transcription" className="w-full">
                    <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6 w-full bg-muted/30 overflow-y-visible">
                        <TabsTrigger value="transcription">Transcript</TabsTrigger>
                        <TabsTrigger value="speech-rate">Speech Rate</TabsTrigger>
                        <TabsTrigger value="intonation">Intonation</TabsTrigger>
                        <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                        <TabsTrigger value="refined-speech">Refinements</TabsTrigger>
                    </TabsList>

                    {/* Transcription Tab */}
                    <TabsContent
                        value="transcription"
                        className="p-6 bg-background rounded-lg border shadow-sm"
                    >
                        <h3 className="font-semibold mb-4 text-lg">Original Transcription</h3>
                        {analysis.transcription.status === "Loaded✅" ? (
                            <p className="text-base leading-relaxed whitespace-pre-line">
                                {analysis.transcription.data}
                            </p>
                        ) : (
                            <div className="flex flex-col items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                                <p>Transcribing your speech...</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Speech Rate Tab */}
                    <TabsContent value="speech-rate">
                        {analysis.speech_rate.status === "Loaded✅" ? (
                            <div className="space-y-6">
                                <div className="p-6 bg-background rounded-lg border shadow-sm">
                                    <div className="mb-10">
                                        <h1 className="font-medium mb-2 text-center">Average Speech Rate</h1>
                                        <div className="flex justify-center items-center gap-2">
                                            <span className="text-xl font-bold">
                                                {analysis.speech_rate.data.avg.toFixed(0)}
                                            </span>
                                            <span className="text-sm text-muted-foreground">words per minute</span>
                                        </div>
                                    </div>


                                    <div className="md:w-1/2 mx-auto">
                                        {analysis.speech_rate_fig.status === "Loaded✅" ? (
                                            <img
                                                src={`data:image/png;base64,${analysis.speech_rate_fig.data}`}
                                                alt="Speech Rate Chart"
                                                className="w-full h-auto rounded-lg shadow-sm"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                                                <p>Creating Graph...</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pl-4 mt-8 md:w-10/12">
                                        <h3 className="font-semibold mb-3 text-lg">AI Feedback</h3>
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                                            <p className="text-base text-blue-800">
                                                {analysis.speech_rate.data.remark}
                                            </p>
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                        <div className="p-4 bg-muted/20 rounded-lg">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-medium">Slowest Segment</span>
                                                <span className="font-semibold text-red-600">
                                                    {Math.floor(analysis.speech_rate.data.slowest_segment.speech_rate)} wpm
                                                </span>
                                            </div>
                                            <AudioPlayer
                                                audioStr={analysis.audio}
                                                startTimestamp={analysis.speech_rate.data.slowest_segment.start}
                                                endTimestamp={analysis.speech_rate.data.slowest_segment.end}
                                            />
                                        </div>

                                        <div className="p-4 bg-muted/20 rounded-lg">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-medium">Fastest Segment</span>
                                                <span className="font-semibold text-green-600">
                                                    {Math.floor(analysis.speech_rate.data.fastest_segment.speech_rate)} wpm
                                                </span>
                                            </div>
                                            <AudioPlayer
                                                audioStr={analysis.audio}
                                                startTimestamp={analysis.speech_rate.data.fastest_segment.start}
                                                endTimestamp={analysis.speech_rate.data.fastest_segment.end}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-12 bg-background rounded-lg border shadow-sm">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                                <p className="text-lg">Analyzing speech rate patterns...</p>
                                <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Intonation Tab */}
                    <TabsContent value="intonation">
                        {analysis.intonation.status === "Loaded✅" ? (
                            <div className="space-y-6">
                                <div className="p-6 bg-background rounded-lg border shadow-sm">
                                    <div className="mb-10">
                                        <h1 className="font-medium mb-2 text-center">Average Pitch</h1>
                                        <div className="flex justify-center items-center gap-2">
                                            <span className="text-2xl font-bold">
                                                {analysis.intonation.data.avg.toFixed(0)}
                                            </span>
                                            <span className="text-sm text-muted-foreground">Hz</span>
                                        </div>
                                    </div>

                                    <div className="md:w-1/2 mx-auto">
                                        {analysis.intonation_fig?.data ? (
                                            <img
                                                src={`data:image/png;base64,${analysis.intonation_fig.data}`}
                                                alt="Intonation Chart"
                                                className="w-full h-auto rounded-lg shadow-sm"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                                                <p>Creating Graph...</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pl-4 mt-8 md:w-10/12">
                                        <h3 className="font-semibold mb-3 text-lg">AI Feedback</h3>
                                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
                                            <p className="text-base text-purple-800">
                                                {analysis.intonation.data.remark}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-muted/20 rounded-lg text-center">
                                        <h4 className="font-medium mb-2">Pause Analysis</h4>
                                        <p className="text-lg">
                                            You had <span className="font-bold text-orange-600">{analysis.confidence.status === "Loaded✅" ? analysis.confidence.data.avg : "..."}</span> awkward pauses during your speech.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : analysis.intonation.status === "In Progress..." ? (
                            <div className="flex flex-col items-center py-12 bg-background rounded-lg border shadow-sm">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                                <p className="text-lg">Analyzing intonation patterns...</p>
                                <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-12 bg-background rounded-lg border shadow-sm">
                                <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                                <p className="text-lg font-medium">Not Enough Data</p>
                                <p className="text-sm text-muted-foreground mt-2">Your speech sample is too short for intonation analysis</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Vocabulary Tab */}
                    <TabsContent value="vocabulary">
                        {analysis.vocab_analysis.status === "Loaded✅" ? (
                            <div className="space-y-6">
                                {analysis.vocab_analysis.data.repeated_words.length > 0 && (
                                    <div className="p-6 bg-background rounded-lg border shadow-sm">
                                        <h3 className="font-semibold mb-4 text-lg flex items-center">
                                            <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                                            Repeated Words
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {analysis.vocab_analysis.data.repeated_words.map(
                                                (item: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                                                    >
                                                        <span className="font-medium">{item.word}</span>
                                                        <Badge variant="outline" className="bg-yellow-100 border-yellow-300">
                                                            {item.count}×
                                                        </Badge>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {analysis.vocab_analysis.data.long_sentences.length > 0 && (
                                    <div className="p-6 bg-background rounded-lg border shadow-sm">
                                        <h3 className="font-semibold mb-4 text-lg flex items-center">
                                            <span className="inline-block w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                                            Long Sentences
                                        </h3>
                                        <div className="space-y-4">
                                            {analysis.vocab_analysis.data.long_sentences.map(
                                                (item: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-lg overflow-hidden border shadow-sm"
                                                    >
                                                        <div className="p-4 bg-orange-50 border-b border-orange-200">
                                                            <p className="text-base text-orange-800">
                                                                {item.sentence}
                                                            </p>
                                                        </div>
                                                        <div className="p-4 bg-background">
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-semibold text-sm text-muted-foreground mt-0.5">Suggestion:</span>
                                                                <p className="text-base">{item.suggestion}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {analysis.vocab_analysis.data.grammatical_errors.length > 0 && (
                                    <div className="p-6 bg-background rounded-lg border shadow-sm">
                                        <h3 className="font-semibold mb-4 text-lg flex items-center">
                                            <span className="inline-block w-3 h-3 bg-red-400 rounded-full mr-2"></span>
                                            Grammar Corrections
                                        </h3>
                                        <div className="space-y-4">
                                            {analysis.vocab_analysis.data.grammatical_errors.map(
                                                (error: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-lg overflow-hidden border shadow-sm"
                                                    >
                                                        <div className="p-4 bg-red-50 border-b border-red-200">
                                                            <p className="text-base text-red-800 line-through">
                                                                {error.sentence}
                                                            </p>
                                                        </div>
                                                        <div className="p-4 bg-green-50 border-b border-green-200">
                                                            <p className="text-base text-green-800">
                                                                {error.correct}
                                                            </p>
                                                        </div>
                                                        <div className="p-4 bg-background">
                                                            <p className="text-sm text-muted-foreground">
                                                                {error.explanation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {!analysis.vocab_analysis.data.repeated_words.length &&
                                    !analysis.vocab_analysis.data.long_sentences.length &&
                                    !analysis.vocab_analysis.data.grammatical_errors.length && (
                                        <div className="p-6 bg-background rounded-lg border shadow-sm text-center">
                                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                            <h3 className="font-semibold text-lg mb-2">No Issues Detected</h3>
                                            <p className="text-muted-foreground">
                                                Great job! Your vocabulary usage was clear and effective.
                                            </p>
                                        </div>
                                    )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-12 bg-background rounded-lg border shadow-sm">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                                <p className="text-lg">Analyzing vocabulary usage...</p>
                                <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Refined Speech Tab */}
                    <TabsContent value="refined-speech">
                        {analysis.vocab_analysis.status === "Loaded✅" ? (
                            <div className="space-y-6">
                                <div className="p-6 bg-background rounded-lg border shadow-sm">
                                    <h3 className="font-semibold mb-3 text-lg flex items-center">
                                        <span className="inline-block w-3 h-3 bg-emerald-400 rounded-full mr-2"></span>
                                        Concise Version
                                    </h3>
                                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg mb-6">
                                        <p className="text-base text-emerald-800 whitespace-pre-line">
                                            {analysis.vocab_analysis.data.modified_text}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 bg-background rounded-lg border shadow-sm">
                                    <h3 className="font-semibold mb-3 text-lg flex items-center">
                                        <span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                                        Sophisticated Version
                                    </h3>
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                                        <p className="text-base text-blue-800 whitespace-pre-line">
                                            {analysis.vocab_analysis.data.fancy_text}
                                        </p>
                                    </div>

                                    {analysis.vocab_analysis.data.meanings.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="font-medium mb-3">Vocabulary Reference</h4>
                                            <div className="bg-muted/20 p-4 rounded-lg">
                                                <ul className="space-y-2">
                                                    {analysis.vocab_analysis.data.meanings.map(
                                                        (item: any, index: number) => (
                                                            <li key={index} className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                                                                <span className="font-semibold text-primary">{item.word}:</span>
                                                                <span className="text-muted-foreground">{item.meaning}</span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>) :
                            (<div className="flex flex-col items-center py-12 bg-background rounded-lg border shadow-sm">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                                <p className="text-lg">Refining Speech...</p>
                                <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
                            </div>
                            )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}