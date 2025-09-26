import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, FileText, Gauge, Activity, BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult } from "@/types/analysis";
import AudioPlayer from "@/components/AudioPlayer";

interface BottomSheetProps {
    analysis: AnalysisResult;
}

const parseJsonString = (jsonString: string): any[] => {
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error parsing JSON string:', error);
        return [];
    }
};

export default function BottomSheet({ analysis }: BottomSheetProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
                <div className="p-2 bg-slate-100 rounded-lg">
                    <FileText className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                    <h2 className="font-semibold text-lg text-gray-800">Detailed Analysis</h2>
                    <p className="text-sm text-gray-600">Comprehensive breakdown of your speech performance</p>
                </div>
            </div>

            <div className="px-6 pb-6">
                <Tabs defaultValue="transcription" className="w-full">
                    <TabsList className="grid grid-cols-5 mb-8 w-full bg-gray-100 h-12 rounded-xl p-1">
                        <TabsTrigger value="transcription" className="flex items-center gap-2 font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200">
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">Transcript</span>
                        </TabsTrigger>
                        <TabsTrigger value="speech-rate" className="flex items-center gap-2 font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200">
                            <Gauge className="h-4 w-4" />
                            <span className="hidden sm:inline">Rate</span>
                        </TabsTrigger>
                        <TabsTrigger value="intonation" className="flex items-center gap-2 font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200">
                            <Activity className="h-4 w-4" />
                            <span className="hidden sm:inline">Tone</span>
                        </TabsTrigger>
                        <TabsTrigger value="vocabulary" className="flex items-center gap-2 font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200">
                            <BookOpen className="h-4 w-4" />
                            <span className="hidden sm:inline">Vocab</span>
                        </TabsTrigger>
                        <TabsTrigger value="refined-speech" className="flex items-center gap-2 font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200">
                            <Sparkles className="h-4 w-4" />
                            <span className="hidden sm:inline">Polish</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="transcription" className="space-y-0">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">Original Transcription</h3>
                                    <p className="text-sm text-gray-600">Exact text from your speech recording</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                <p className="text-base leading-relaxed text-gray-700 whitespace-pre-line">
                                    {analysis.transcription.fullText || "No transcription available"}
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="speech-rate" className="space-y-0">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-8">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Gauge className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">Speech Rate Analysis</h3>
                                        <p className="text-sm text-gray-600">Your speaking pace and rhythm patterns</p>
                                    </div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6 inline-block">
                                    <div className="text-3xl font-bold text-green-600 mb-1">
                                        {analysis.speechRate.avgSpeechRate.toFixed(0)}
                                    </div>
                                    <div className="text-sm font-medium text-green-700">words per minute</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                <div className="max-w-2xl mx-auto">
                                    {analysis.speechRate.chartUrl ? (
                                        <img
                                            src={analysis.speechRate.chartUrl}
                                            alt="Speech Rate Chart"
                                            className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
                                            onError={(e) => {
                                                console.error("Failed to load speech rate chart");
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent mb-4"></div>
                                            <p className="text-gray-600 font-medium">Creating visualization...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Sparkles className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold text-lg text-gray-800">AI Insights</h4>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <p className="text-base text-blue-800 leading-relaxed">
                                        {analysis.speechRate.feedback}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg text-gray-800">Sample Segments</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-semibold text-gray-800">Slowest Segment</span>
                                            <Badge variant="destructive" className="font-semibold">
                                                {Math.floor(analysis.speechRate.slowestSegment.speechRate)} wpm
                                            </Badge>
                                        </div>
                                        <AudioPlayer
                                            audioStr={analysis.audioUrl}
                                            startTimestamp={analysis.speechRate.slowestSegment.start}
                                            endTimestamp={analysis.speechRate.slowestSegment.end}
                                        />
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-semibold text-gray-800">Fastest Segment</span>
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 font-semibold">
                                                {Math.floor(analysis.speechRate.fastestSegment.speechRate)} wpm
                                            </Badge>
                                        </div>
                                        <AudioPlayer
                                            audioStr={analysis.audioUrl}
                                            startTimestamp={analysis.speechRate.fastestSegment.start}
                                            endTimestamp={analysis.speechRate.fastestSegment.end}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="intonation" className="space-y-0">
                        {analysis.intonation ? (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-8">
                                {/* Header Section */}
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-3 mb-6">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Activity className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-800">Intonation Analysis</h3>
                                            <p className="text-sm text-gray-600">Voice tone and emotional expression patterns</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Section */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                    <div className="max-w-2xl mx-auto">
                                        {analysis.intonation.chartUrl ? (
                                            <img
                                                src={analysis.intonation.chartUrl}
                                                alt="Intonation Chart"
                                                className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
                                                onError={(e) => {
                                                    console.error("Failed to load intonation chart");
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mb-4"></div>
                                                <p className="text-gray-600 font-medium">Creating visualization...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* AI Feedback Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Sparkles className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-lg text-gray-800">AI Insights</h4>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                        <p className="text-base text-purple-800 leading-relaxed">
                                            {analysis.intonation.feedback || "Analysis in progress..."}
                                        </p>
                                    </div>
                                </div>

                                {/* Pause Analysis */}
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-4">Pause Analysis</h4>
                                    <div className="inline-flex items-center gap-2">
                                        <span className="text-lg text-gray-700">You had</span>
                                        <span className="text-2xl font-bold text-orange-600">
                                            {analysis.pauses ? analysis.pauses.totalPauses : "..."}
                                        </span>
                                        <span className="text-lg text-gray-700">pauses during your speech</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="flex flex-col items-center py-12">
                                    <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Not Enough Data</h3>
                                    <p className="text-sm text-gray-600">Your speech sample is too short for intonation analysis</p>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="vocabulary" className="space-y-0">
                        {analysis.vocabAnalysis ? (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-8">
                                {/* Header Section */}
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">Vocabulary Analysis</h3>
                                        <p className="text-sm text-gray-600">Word usage patterns and potential improvements</p>
                                    </div>
                                </div>

                                {/* Issues Detection */}
                                <div className="space-y-6">
                                    {/* Repeated Words */}
                                    {analysis.vocabAnalysis.repeatedWords && (() => {
                                        const repeatedWordsList = parseJsonString(analysis.vocabAnalysis.repeatedWords)
                                            .filter((item: any) => {
                                                const count = item.count || (typeof item === 'string' ? 1 : 0);
                                                return count > 2;
                                            });
                                        return repeatedWordsList.length > 0 && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                                <h4 className="font-semibold text-lg text-gray-800 mb-4">Repeated Words</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {repeatedWordsList.map((item: any, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full shadow-sm"
                                                        >
                                                            <span className="font-medium text-yellow-800">{item.word || item}</span>
                                                            {item.count && (
                                                                <Badge variant="outline" className="bg-yellow-200 text-yellow-800 text-xs">
                                                                    {item.count}×
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Long Sentences */}
                                    {analysis.vocabAnalysis.longSentences && (() => {
                                        const longSentencesList = parseJsonString(analysis.vocabAnalysis.longSentences);
                                        return longSentencesList.length > 0 && (
                                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                                <h4 className="font-semibold text-lg text-gray-800 mb-4">Long Sentences</h4>
                                                <div className="space-y-4">
                                                    {longSentencesList.map((item: any, index: number) => (
                                                        <div key={index} className="bg-white border border-orange-300 rounded-lg overflow-hidden shadow-sm">
                                                            <div className="p-4 bg-orange-100 border-b border-orange-200">
                                                                <p className="text-base text-orange-800">
                                                                    {item.sentence || item}
                                                                </p>
                                                            </div>
                                                            {item.suggestion && (
                                                                <div className="p-4">
                                                                    <div className="flex items-start gap-2">
                                                                        <span className="font-semibold text-sm text-gray-600 mt-0.5">Suggestion:</span>
                                                                        <p className="text-sm text-gray-700">{item.suggestion}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Grammar Errors */}
                                    {analysis.vocabAnalysis.grammaticalErrors && (() => {
                                        const grammarErrorsList = parseJsonString(analysis.vocabAnalysis.grammaticalErrors);
                                        return grammarErrorsList.length > 0 && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                                <h4 className="font-semibold text-lg text-gray-800 mb-4">Grammar Corrections</h4>
                                                <div className="space-y-4">
                                                    {grammarErrorsList.map((error: any, index: number) => (
                                                        <div key={index} className="bg-white border border-red-300 rounded-lg overflow-hidden shadow-sm">
                                                            <div className="p-4 bg-red-100 border-b border-red-200">
                                                                <p className="text-base text-red-800 line-through">
                                                                    {error.sentence || error.original || error}
                                                                </p>
                                                            </div>
                                                            {error.correct && (
                                                                <div className="p-4 bg-green-50 border-b border-green-200">
                                                                    <p className="text-base text-green-800">
                                                                        {error.correct}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {error.explanation && (
                                                                <div className="p-4">
                                                                    <p className="text-sm text-gray-700">
                                                                        {error.explanation}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* No Issues Found */}
                                    {(() => {
                                        const hasRepeatedWords = parseJsonString(analysis.vocabAnalysis.repeatedWords || '[]').some((item: any) => {
                                            const count = item.count || (typeof item === 'string' ? 1 : 0);
                                            return count > 2;
                                        });
                                        const hasLongSentences = parseJsonString(analysis.vocabAnalysis.longSentences || '[]').length > 0;
                                        const hasGrammarErrors = parseJsonString(analysis.vocabAnalysis.grammaticalErrors || '[]').length > 0;

                                        return !hasRepeatedWords && !hasLongSentences && !hasGrammarErrors && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                                <h4 className="font-semibold text-xl text-gray-800 mb-2">No Issues Detected</h4>
                                                <p className="text-gray-600">
                                                    Excellent! Your vocabulary usage was clear and effective.
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="flex flex-col items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mb-4"></div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Vocabulary</h3>
                                    <p className="text-sm text-gray-600">This may take a moment...</p>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="refined-speech" className="space-y-0">
                        {analysis.vocabAnalysis ? (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-8">
                                {/* Header Section */}
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <Sparkles className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">Speech Refinements</h3>
                                        <p className="text-sm text-gray-600">Enhanced versions of your speech for different contexts</p>
                                    </div>
                                </div>

                                {/* Refined Versions */}
                                <div className="space-y-8">
                                    {/* Concise Version */}
                                    {analysis.vocabAnalysis.modifiedText && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                                                <h4 className="font-semibold text-lg text-gray-800">Concise Version</h4>
                                            </div>
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                                                <p className="text-base text-emerald-800 leading-relaxed whitespace-pre-line">
                                                    {analysis.vocabAnalysis.modifiedText}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sophisticated Version */}
                                    {analysis.vocabAnalysis.fancyText && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                                <h4 className="font-semibold text-lg text-gray-800">Sophisticated Version</h4>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                                <p className="text-base text-blue-800 leading-relaxed whitespace-pre-line">
                                                    {analysis.vocabAnalysis.fancyText}
                                                </p>
                                            </div>

                                            {/* Vocabulary Reference */}
                                            {analysis.vocabAnalysis.meanings && (() => {
                                                const meaningsList = parseJsonString(analysis.vocabAnalysis.meanings);
                                                return meaningsList.length > 0 && (
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                                        <h5 className="font-semibold text-base text-gray-800 mb-4">Vocabulary Reference</h5>
                                                        <div className="grid gap-3">
                                                            {meaningsList.map((item: any, index: number) => (
                                                                <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-2">
                                                                    <span className="font-medium text-blue-600 min-w-[120px]">
                                                                        {item.word || Object.keys(item)[0]}:
                                                                    </span>
                                                                    <span className="text-gray-700 text-sm leading-relaxed">
                                                                        {item.meaning || item.definition || Object.values(item)[0]}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* No Refinements Available */}
                                    {!analysis.vocabAnalysis.modifiedText && !analysis.vocabAnalysis.fancyText && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                            <h4 className="font-semibold text-xl text-gray-800 mb-2">No Refinements Needed</h4>
                                            <p className="text-gray-600">
                                                Great job! Your speech was already well-structured and clear.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="flex flex-col items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent mb-4"></div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Generating Refinements</h3>
                                    <p className="text-sm text-gray-600">This may take a moment...</p>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
