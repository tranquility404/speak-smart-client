import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Award, BarChart2, Brain, Clock, Mic, PlayCircle, Radio, Sparkles, ThumbsUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [, setActiveTab] = useState('features');
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <header className="py-8 md:py-16 px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center text-center">
        <Badge className="mb-4 px-4 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
          Hackathon Project
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          SpeakSmart<span className="text-blue-600">.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8">
          Transform your communication skills with AI-powered speech analysis and personalized improvement suggestions
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 rounded-lg" onClick={() => navigate("/speech-analyzer")}>
            Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="text-gray-500 text-center pt-8">
          Developed by Aman Verma
        </div>
      </header>

      {/* Main Tabs Section */}
      <main className="flex-grow px-4 py-12 md:px-8 lg:px-16">
        <Tabs defaultValue="features" className="max-w-6xl mx-auto" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8 mx-auto">
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          </TabsList>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Speech Analysis Card */}
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <BarChart2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Comprehensive Speech Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Speech rate tracking
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Intonation & energy analysis
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Confidence scoring
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Vocabulary enhancement suggestions
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Grammar correction
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Practice Sessions Card */}
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Interactive Practice Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Impromptu speaking challenges
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Mock interview simulations
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Slow-fast drill for speech rate control
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Random topic generator
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Timed speaking exercises
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Speech Refinement Card */}
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Speech Refinement Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Generate concise speech variants
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Add humor to your presentations
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Elevate with sophisticated vocabulary
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Create philosophical perspectives
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      Technical speech adaptation
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center mt-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 rounded-lg">
                Explore All Features
              </Button>
            </div>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-6 w-6 mr-2 text-yellow-500" />
                    Professional Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Enhance your career prospects with improved communication skills that make you stand out in interviews, presentations, and workplace interactions.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="secondary">Career Advancement</Badge>
                    <Badge variant="secondary">Leadership Skills</Badge>
                    <Badge variant="secondary">Presentation Mastery</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-6 w-6 mr-2 text-purple-500" />
                    Cognitive Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Sharpen your critical thinking and verbal processing abilities through impromptu speaking exercises and quick thinking drills.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="secondary">Quick Thinking</Badge>
                    <Badge variant="secondary">Mental Agility</Badge>
                    <Badge variant="secondary">Adaptive Communication</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ThumbsUp className="h-6 w-6 mr-2 text-green-500" />
                    Social Confidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Build self-assurance in social situations through regular practice with varied speech styles and constructive feedback on your delivery.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="secondary">Public Speaking</Badge>
                    <Badge variant="secondary">Interpersonal Skills</Badge>
                    <Badge variant="secondary">Self-Expression</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Radio className="h-6 w-6 mr-2 text-blue-500" />
                    Versatile Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Master different communication styles from technical to humorous, allowing you to adapt to any audience or situation with ease.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="secondary">Audience Adaptation</Badge>
                    <Badge variant="secondary">Stylistic Range</Badge>
                    <Badge variant="secondary">Context Awareness</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* How It Works Tab */}
          <TabsContent value="how-it-works" className="space-y-8">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 flex flex-col items-center md:items-end justify-center p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                    <Mic className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Record or Upload</h3>
                </div>
                <div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    Begin by recording your speech directly through our platform or uploading an existing audio file. Our system supports various formats and can handle speeches of any length, from brief elevator pitches to lengthy presentations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 flex flex-col items-center md:items-end justify-center p-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                    <BarChart2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold">AI Analysis</h3>
                </div>
                <div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    Our advanced AI engine analyzes your speech across multiple parameters: speech rate, intonation patterns, energy levels, confidence markers, vocabulary usage, grammatical accuracy, and sentence structure. The system generates both a detailed report and an overall communication score.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 flex flex-col items-center md:items-end justify-center p-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Personalized Suggestions</h3>
                </div>
                <div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    Receive customized improvement suggestions including alternative vocabulary options, sentence restructuring for clarity, speech rate adjustments, and intonation guidance. The system provides multiple transcript variants (concise, sophisticated, humorous, etc.) to help you explore different communication styles.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 flex flex-col items-center md:items-end justify-center p-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mb-2">
                    <PlayCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Practice & Improve</h3>
                </div>
                <div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    Engage with interactive practice modules including impromptu speaking challenges, mock interviews, and speech rate drills. Track your progress over time with our comprehensive analytics dashboard, visualizing your improvement across all communication parameters.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Feature Showcase */}
      <section className="bg-blue-50 dark:bg-blue-950 py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col pt-0">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <Mic className="h-16 w-16 text-white" />
              </div>
              <CardHeader>
                <CardTitle>Speech Analyzer</CardTitle>
                <CardDescription>
                  Get detailed feedback on your communication
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Upload or record a speech to receive comprehensive analysis on speech rate, intonation, energy, confidence, and vocabulary usage. Identify areas for improvement with our AI-powered assessment.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate("/speech-analyzer")}>Try Speech Analyzer</Button>
              </CardFooter>
            </Card>

            <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col pt-0">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <Clock className="h-16 w-16 text-white" />
              </div>
              <CardHeader>
                <CardTitle>Practice Sessions</CardTitle>
                <CardDescription>
                  Train your speech with guided exercises
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Master fluency, clarity, and confidence through structured drills.
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                  <li><strong>Impromptu Speaking:</strong> Think on your feet with random topics.</li>
                  <li><strong>Mock Interviews:</strong> Simulate real interview scenarios.</li>
                  <li><strong>Slow & Fast Drill:</strong> Improve pacing and articulation.</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate("/practice-session")}>
                  Start Practicing
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col pt-0">
              <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
              <CardHeader>
                <CardTitle>Speech Refinement</CardTitle>
                <CardDescription>
                  Transform your content with style variants
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Generate five different versions of your speech: concise, humorous, sophisticated, philosophical, and technical. Practice each variant with our analyzer to master versatile communication styles.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate("/speech-refinement")}>Refine Your Speech</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Communication Skills?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8">
          Join thousands of professionals, students, and public speakers who have elevated their communication with SpeechMaster.
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-6 text-xl rounded-lg" onClick={() => navigate("/speech-analyzer")}>
          Start Free Practice Session
        </Button>
      </section>

      {/* Testimonials/Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">87%</div>
              <p className="text-gray-600 dark:text-gray-300">
                of users report improved confidence in public speaking after just 2 weeks
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">32%</div>
              <p className="text-gray-600 dark:text-gray-300">
                average improvement in communication assessment scores
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <p className="text-gray-600 dark:text-gray-300">
                practice sessions completed by users worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">SpeakSmart<span className="text-blue-600">.</span></h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Elevate your communication skills</p>
          </div>
          {/* <div className="flex gap-6">
            <Button variant="ghost" size="sm">Features</Button>
            <Button variant="ghost" size="sm">Pricing</Button>
            <Button variant="ghost" size="sm">About</Button>
            <Button variant="ghost" size="sm">Contact</Button>
          </div> */}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;