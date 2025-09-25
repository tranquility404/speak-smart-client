import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult } from "@/types/analysis";
import AudioPlayer from "@/components/AudioPlayer";

interface BottomSheetProps {
    analysis: AnalysisResult;
}

// Helper function to safely parse JSON strings
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
    return <>
        <Tabs defaultValue="transcription" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6 w-full bg-muted/30 overflow-y-visible">
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
                <p className="text-base leading-relaxed whitespace-pre-line">
                    {analysis.transcription.fullText || "No transcription available"}
                </p>
            </TabsContent>

            {/* Speech Rate Tab */}
            <TabsContent value="speech-rate">
                <div className="space-y-6">
                    <div className="p-6 bg-background rounded-lg border shadow-sm">
                        <div className="mb-10">
                            <h1 className="font-medium mb-2 text-center">Average Speech Rate</h1>
                            <div className="flex justify-center items-center gap-2">
                                <span className="text-xl font-bold">
                                    {analysis.speechRate.avgSpeechRate.toFixed(0)}
                                </span>
                                <span className="text-sm text-muted-foreground">words per minute</span>
                            </div>
                        </div>

                        <div className="md:w-1/2 mx-auto">
                            {analysis.speechRate.chartUrl ? (
                                <img
                                    src={analysis.speechRate.chartUrl}
                                    alt="Speech Rate Chart"
                                    className="w-full h-auto rounded-lg shadow-sm"
                                    onError={(e) => {
                                        console.error("Failed to load speech rate chart");
                                        e.currentTarget.style.display = 'none';
                                    }}
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
                                    {analysis.speechRate.feedback}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="p-4 bg-muted/20 rounded-lg">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">Slowest Segment</span>
                                    <span className="font-semibold text-red-600">
                                        {Math.floor(analysis.speechRate.slowestSegment.speechRate)} wpm
                                    </span>
                                </div>
                                <AudioPlayer
                                    audioStr={analysis.audioUrl}
                                    startTimestamp={analysis.speechRate.slowestSegment.start}
                                    endTimestamp={analysis.speechRate.slowestSegment.end}
                                />
                            </div>

                            <div className="p-4 bg-muted/20 rounded-lg">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">Fastest Segment</span>
                                    <span className="font-semibold text-green-600">
                                        {Math.floor(analysis.speechRate.fastestSegment.speechRate)} wpm
                                    </span>
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

            {/* Intonation Tab */}
            <TabsContent value="intonation">
                {analysis.intonation ? (
                    <div className="space-y-6">
                        <div className="p-6 bg-background rounded-lg border shadow-sm">
                            <div className="mb-10">
                                <h1 className="font-medium mb-2 text-center">Average Pitch</h1>
                                <div className="flex justify-center items-center gap-2">
                                    <span className="text-2xl font-bold">
                                        {analysis.intonation.averagePitch.toFixed(0)}
                                    </span>
                                    <span className="text-sm text-muted-foreground">Hz</span>
                                </div>
                            </div>

                            <div className="md:w-1/2 mx-auto">
                                {analysis.intonation.chartUrl ? (
                                    <img
                                        src={analysis.intonation.chartUrl}
                                        alt="Intonation Chart"
                                        className="w-full h-auto rounded-lg shadow-sm"
                                        onError={(e) => {
                                            console.error("Failed to load intonation chart");
                                            e.currentTarget.style.display = 'none';
                                        }}
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
                                        {analysis.intonation.feedback || "Analysis in progress..."}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-muted/20 rounded-lg text-center">
                                <h4 className="font-medium mb-2">Pause Analysis</h4>
                                <p className="text-lg">
                                    You had <span className="font-bold text-orange-600">{analysis.pauses ? analysis.pauses.totalPauses : "..."}</span> pauses during your speech.
                                </p>
                            </div>
                        </div>
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
                {analysis.vocabAnalysis ? (
                    <div className="space-y-6">
                        {/* Vocabulary issues detection */}
                        <div className="p-6 bg-background rounded-lg border shadow-sm">
                            <h3 className="font-semibold mb-4 text-lg flex items-center">
                                <span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                                Vocabulary Issues
                            </h3>
                            <div className="space-y-4">
                                {analysis.vocabAnalysis.repeatedWords && (() => {
                                    const repeatedWordsList = parseJsonString(analysis.vocabAnalysis.repeatedWords)
                                        .filter((item: any) => {
                                            const count = item.count || (typeof item === 'string' ? 1 : 0);
                                            return count > 2;
                                        });
                                    return repeatedWordsList.length > 0 && (
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <h4 className="font-medium mb-3">Repeated Words</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {repeatedWordsList.map((item: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-full border border-yellow-300 text-sm"
                                                    >
                                                        <span className="font-medium">{item.word || item}</span>
                                                        {item.count && (
                                                            <Badge variant="outline" className="bg-yellow-200 border-yellow-400 text-xs px-1.5 py-0.5">
                                                                {item.count}×
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {analysis.vocabAnalysis.longSentences && (() => {
                                    const longSentencesList = parseJsonString(analysis.vocabAnalysis.longSentences);
                                    return longSentencesList.length > 0 && (
                                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                            <h4 className="font-medium mb-3">Long Sentences</h4>
                                            <div className="space-y-4">
                                                {longSentencesList.map((item: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-lg overflow-hidden border shadow-sm"
                                                    >
                                                        <div className="p-4 bg-orange-100 border-b border-orange-200">
                                                            <p className="text-base text-orange-800">
                                                                {item.sentence || item}
                                                            </p>
                                                        </div>
                                                        {item.suggestion && (
                                                            <div className="p-4 bg-background">
                                                                <div className="flex items-start gap-2">
                                                                    <span className="font-semibold text-sm text-muted-foreground mt-0.5">Suggestion:</span>
                                                                    <p className="text-base">{item.suggestion}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {analysis.vocabAnalysis.grammaticalErrors && (() => {
                                    const grammarErrorsList = parseJsonString(analysis.vocabAnalysis.grammaticalErrors);
                                    return grammarErrorsList.length > 0 && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <h4 className="font-medium mb-3">Grammar Corrections</h4>
                                            <div className="space-y-4">
                                                {grammarErrorsList.map((error: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-lg overflow-hidden border shadow-sm"
                                                    >
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
                                                            <div className="p-4 bg-background">
                                                                <p className="text-sm text-muted-foreground">
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

                                {(() => {
                                    const hasRepeatedWords = parseJsonString(analysis.vocabAnalysis.repeatedWords || '[]').length > 0;
                                    const hasLongSentences = parseJsonString(analysis.vocabAnalysis.longSentences || '[]').length > 0;
                                    const hasGrammarErrors = parseJsonString(analysis.vocabAnalysis.grammaticalErrors || '[]').length > 0;

                                    return !hasRepeatedWords && !hasLongSentences && !hasGrammarErrors && (
                                        <div className="p-6 bg-background rounded-lg border shadow-sm text-center">
                                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                            <h3 className="font-semibold text-lg mb-2">No Issues Detected</h3>
                                            <p className="text-muted-foreground">
                                                Great job! Your vocabulary usage was clear and effective.
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
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
                {analysis.vocabAnalysis ? (
                    <div className="space-y-6">
                        {/* Refined versions and enhancements */}
                        {analysis.vocabAnalysis.modifiedText && (
                            <div className="p-6 bg-background rounded-lg border shadow-sm">
                                <h3 className="font-semibold mb-3 text-lg flex items-center">
                                    <span className="inline-block w-3 h-3 bg-emerald-400 rounded-full mr-2"></span>
                                    Concise Version
                                </h3>
                                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <p className="text-base text-emerald-800 whitespace-pre-line">
                                        {analysis.vocabAnalysis.modifiedText}
                                    </p>
                                </div>
                            </div>
                        )}

                        {analysis.vocabAnalysis.fancyText && (
                            <div className="p-6 bg-background rounded-lg border shadow-sm">
                                <h3 className="font-semibold mb-3 text-lg flex items-center">
                                    <span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                                    Sophisticated Version
                                </h3>
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-base text-blue-800 whitespace-pre-line">
                                        {analysis.vocabAnalysis.fancyText}
                                    </p>
                                </div>

                                {analysis.vocabAnalysis.meanings && (() => {
                                    const meaningsList = parseJsonString(analysis.vocabAnalysis.meanings);
                                    return meaningsList.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="font-medium mb-3">Vocabulary Reference</h4>
                                            <div className="bg-muted/20 p-4 rounded-lg">
                                                <ul className="space-y-2">
                                                    {meaningsList.map((item: any, index: number) => (
                                                        <li key={index} className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                                                            <span className="font-semibold text-primary">
                                                                {item.word || Object.keys(item)[0]}:
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                {item.meaning || item.definition || Object.values(item)[0]}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {!analysis.vocabAnalysis.modifiedText && !analysis.vocabAnalysis.fancyText && (
                            <div className="flex flex-col items-center py-12 bg-background rounded-lg border shadow-sm">
                                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                                <p className="text-lg font-medium">No Refinements Available</p>
                                <p className="text-sm text-muted-foreground mt-2">Your speech was already well-structured</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-12 bg-background rounded-lg border shadow-sm">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                        <p className="text-lg">Generating refinements...</p>
                        <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    </>
}