import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mic, Volume2, RefreshCw, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import VoiceAnalyzer from '@/components/VoiceAnalyzer';
import { generateRandomTopics, generateSpeechOnTopic } from '@/api/apiRequests';

const SpeechGenerator: React.FC = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [speech, setSpeech] = useState<string | null>(null);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingSpeech, setIsLoadingSpeech] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("topics");

  const fetchRandomTopics = async () => {
    setIsLoadingTopics(true);
    setError(null);
    try {
      const response = await generateRandomTopics();
      setTopics(response.data.topics);
      setSelectedTopic(null);
      setSpeech(null);
      setActiveTab("topics");
    } catch (err) {
      setError('Failed to fetch topics. Please try again.');
      console.error(err);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const generateSpeech = async (topic: string) => {
    setIsLoadingSpeech(true);
    setError(null);
    try {
      const response = await generateSpeechOnTopic({ "topic": topic })
      setSpeech(response.data.speech);
      setActiveTab("speech");
    } catch (err) {
      setError('Failed to generate speech. Please try again.');
      console.error(err);
    } finally {
      setIsLoadingSpeech(false);
    }
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    generateSpeech(topic);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl bg-slate-50 min-h-screen py-4 sm:py-6 lg:py-8">
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Speech Practice Assistant</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base hidden sm:block">Improve your public speaking skills with AI-generated topics and real-time voice analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="shadow-md border-slate-200 h-full pt-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b rounded-sm px-3 sm:px-6 py-3 sm:py-4 pt-4">
              <CardTitle className="text-lg sm:text-xl text-slate-800">Voice Analyzer</CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                Record and analyze your speech delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <VoiceAnalyzer />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-md border-slate-200 h-full pt-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b rounded-sm px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <CardTitle className="text-lg sm:text-xl text-slate-800">Need something to say?</CardTitle>
                  <CardDescription className="text-slate-600 text-sm sm:block">
                    Generate a speech and practice your delivery
                  </CardDescription>
                </div>
                <Button
                  onClick={fetchRandomTopics}
                  disabled={isLoadingTopics}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  size="sm"
                >
                  {isLoadingTopics ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {topics.length > 0 ? 'New Topics' : 'Get Topics'}
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-3 sm:px-6 pt-3 sm:pt-4">
                <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4">
                  <TabsTrigger value="topics" disabled={isLoadingSpeech} className="text-sm">Topics</TabsTrigger>
                  <TabsTrigger value="speech" disabled={!speech} className="text-sm">Speech</TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="px-3 sm:px-6">
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 sm:p-4 rounded-md mb-3 sm:mb-4 flex items-center border border-red-200 text-sm">
                    <div className="mr-2">⚠️</div>
                    {error}
                  </div>
                )}

                <TabsContent value="topics" className="mt-0">
                  {topics.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 sm:gap-3 mt-2">
                      {topics.map((topic, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleTopicSelect(topic)}
                          disabled={isLoadingSpeech}
                          className={`text-left h-auto py-3 sm:py-4 px-3 sm:px-4 flex justify-between items-center border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm sm:text-base ${selectedTopic === topic ? 'border-blue-500 bg-blue-50' : ''}`}
                        >
                          <div className="flex items-center">
                            <Badge className="mr-2 sm:mr-3 bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">{index + 1}</Badge>
                            <span className="text-left">{topic}</span>
                          </div>
                          <ArrowRight className={`h-3 w-3 sm:h-4 sm:w-4 transition-opacity ${selectedTopic === topic ? 'opacity-100 text-blue-500' : 'opacity-0'}`} />
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                      <div className="bg-blue-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                        <Volume2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-slate-800 mb-2">Need something to say?</h3>
                      <p className="text-slate-600 mb-4 sm:mb-6 max-w-md text-sm sm:text-base px-4 sm:px-0">Click the "Get Topics" button to generate random speech topics and start practicing</p>
                      <Button
                        onClick={fetchRandomTopics}
                        disabled={isLoadingTopics}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto max-w-xs"
                      >
                        {isLoadingTopics ? 'Loading...' : 'Generate Topics'}
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="speech" className="mt-0">
                  {isLoadingSpeech ? (
                    <div className="flex flex-col justify-center items-center py-12 sm:py-16">
                      <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-600 mb-3 sm:mb-4" />
                      <p className="text-slate-600 text-sm sm:text-base">Generating your speech...</p>
                    </div>
                  ) : speech ? (
                    <div>
                      <div className="flex items-center mb-3 sm:mb-4">
                        <Badge className="bg-indigo-100 text-indigo-800 mr-2 sm:mr-3 py-1 px-2 sm:px-3 text-xs">Topic</Badge>
                        <h3 className="text-base sm:text-lg font-medium text-slate-800 line-clamp-2">{selectedTopic}</h3>
                      </div>

                      <div className="bg-white p-4 sm:p-6 rounded-md border border-slate-200 whitespace-pre-line text-slate-700 leading-relaxed shadow-sm mb-4 sm:mb-6 text-sm sm:text-base">
                        {speech}
                      </div>

                      <div className="bg-blue-50 p-4 sm:p-5 rounded-md border border-blue-200 mb-4">
                        <h4 className="font-medium text-blue-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                          <Mic className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Practice Instructions
                        </h4>
                        <Separator className="bg-blue-200 mb-2 sm:mb-3" />
                        <ol className="list-decimal list-inside text-blue-700 space-y-1 sm:space-y-2 text-xs sm:text-sm">
                          <li>Read the speech aloud, focusing on clarity and pacing</li>
                          <li className="hidden sm:list-item">Use the voice analyzer below to record your delivery</li>
                          <li className="sm:hidden">Use the voice analyzer to record your delivery</li>
                          <li>Review the analysis to identify areas for improvement</li>
                          <li className="hidden sm:list-item">Try varying your tone and emphasis based on the topic</li>
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-600 text-sm sm:text-base">
                      Select a topic to generate a speech
                    </div>
                  )}
                </TabsContent>
              </CardContent>

              <CardFooter className="border-t bg-slate-50 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 px-3 sm:px-6 py-3 sm:py-4">
                <div className="text-xs text-slate-500 truncate">
                  {selectedTopic ? `Selected topic: ${selectedTopic}` : 'No topic selected'}
                </div>
                {speech && (
                  <Button
                    variant="outline"
                    onClick={fetchRandomTopics}
                    size="sm"
                    className="text-slate-700 w-full sm:w-auto"
                  >
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Try Another Topic
                  </Button>
                )}
              </CardFooter>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpeechGenerator;