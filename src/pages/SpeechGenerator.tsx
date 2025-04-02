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
      const response = await generateSpeechOnTopic({"topic": topic })
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
    <div className="container mx-auto p-6 w-10/12 bg-slate-50 min-h-screen mt-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Speech Practice Assistant</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">Improve your public speaking skills with AI-generated topics and real-time voice analysis</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-md border-slate-200 h-full pt-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b rounded-sm pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-800">Speech Generator</CardTitle>
                  <CardDescription className="text-slate-600">
                    Generate a speech on any topic and practice your delivery
                  </CardDescription>
                </div>
                <Button 
                  onClick={fetchRandomTopics} 
                  disabled={isLoadingTopics}
                  className="bg-blue-600 hover:bg-blue-700"
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
              <div className="px-6 pt-4">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="topics" disabled={isLoadingSpeech}>Topics</TabsTrigger>
                  <TabsTrigger value="speech" disabled={!speech}>Speech</TabsTrigger>
                </TabsList>
              </div>
              
              <CardContent>
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 flex items-center border border-red-200">
                    <div className="mr-2">⚠️</div>
                    {error}
                  </div>
                )}
                
                <TabsContent value="topics" className="mt-0">
                  {topics.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {topics.map((topic, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleTopicSelect(topic)}
                          disabled={isLoadingSpeech}
                          className={`text-left h-auto py-4 px-4 flex justify-between items-center border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all ${selectedTopic === topic ? 'border-blue-500 bg-blue-50' : ''}`}
                        >
                          <div className="flex items-center">
                            <Badge className="mr-3 bg-blue-100 text-blue-800 hover:bg-blue-100">{index + 1}</Badge>
                            <span>{topic}</span>
                          </div>
                          <ArrowRight className={`h-4 w-4 transition-opacity ${selectedTopic === topic ? 'opacity-100 text-blue-500' : 'opacity-0'}`} />
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="bg-blue-100 p-4 rounded-full mb-4">
                        <Volume2 className="h-8 w-8 text-blue-700" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">No topics generated yet</h3>
                      <p className="text-slate-600 mb-6 max-w-md">Click the "Get Topics" button to generate random speech topics and start practicing</p>
                      <Button 
                        onClick={fetchRandomTopics} 
                        disabled={isLoadingTopics}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isLoadingTopics ? 'Loading...' : 'Generate Topics'}
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="speech" className="mt-0">
                  {isLoadingSpeech ? (
                    <div className="flex flex-col justify-center items-center py-16">
                      <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                      <p className="text-slate-600">Generating your speech...</p>
                    </div>
                  ) : speech ? (
                    <div>
                      <div className="flex items-center mb-4">
                        <Badge className="bg-indigo-100 text-indigo-800 mr-3 py-1 px-3">Topic</Badge>
                        <h3 className="text-lg font-medium text-slate-800">{selectedTopic}</h3>
                      </div>
                      
                      <div className="bg-white p-6 rounded-md border border-slate-200 whitespace-pre-line text-slate-700 leading-relaxed shadow-sm mb-6">
                        {speech}
                      </div>
                      
                      <div className="bg-blue-50 p-5 rounded-md border border-blue-200 mb-4">
                        <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                          <Mic className="h-4 w-4 mr-2" />
                          Practice Instructions
                        </h4>
                        <Separator className="bg-blue-200 mb-3" />
                        <ol className="list-decimal list-inside text-blue-700 space-y-2">
                          <li>Read the speech aloud, focusing on clarity and pacing</li>
                          <li>Use the voice analyzer below to record your delivery</li>
                          <li>Review the analysis to identify areas for improvement</li>
                          <li>Try varying your tone and emphasis based on the topic</li>
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-600">
                      Select a topic to generate a speech
                    </div>
                  )}
                </TabsContent>
              </CardContent>
              
              <CardFooter className="border-t bg-slate-50 flex justify-between">
                <div className="text-xs text-slate-500">
                  {selectedTopic ? `Selected topic: ${selectedTopic}` : 'No topic selected'}
                </div>
                {speech && (
                  <Button 
                    variant="outline" 
                    onClick={fetchRandomTopics}
                    size="sm"
                    className="text-slate-700"
                  >
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Try Another Topic
                  </Button>
                )}
              </CardFooter>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="shadow-md border-slate-200 h-full pt-0">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b pt-4 rounded-sm">
              <CardTitle className="text-xl text-slate-800">Voice Analyzer</CardTitle>
              <CardDescription className="text-slate-600">
                Record and analyze your speech delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <VoiceAnalyzer />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpeechGenerator;