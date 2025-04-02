import { generateRefinedSpeeches } from "@/api/apiRequests";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import VoiceAnalyzer from "@/components/VoiceAnalyzer";
import { ArrowLeft, Check, Copy, Loader, Mic, Sparkles, Volume2 } from "lucide-react";
import { useState } from "react";

interface RephraseResults {
  [key: string]: string;
}

const SpeechRefinement = () => {
  const [inputText, setInputText] = useState<string>("");
  const [rephraseResults, setRephraseResults] = useState<RephraseResults | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedVariantType, setSelectedVariantType] = useState<string | null>(null);
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("refine");

  const handleRephrase = async () => {
    setLoading(true);
    try {
      const data: RephraseResults = (await generateRefinedSpeeches(inputText)).data;
      setRephraseResults(data);
      setSelectedVariant(null);
      setSelectedVariantType(null);
      setIsPracticeMode(false);
    } catch (error) {
      console.error("Rephrasing error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (variant: string) => {
    navigator.clipboard.writeText(variant);
    setCopiedVariant(variant);
    setTimeout(() => setCopiedVariant(null), 2000);
  };

  const handlePractice = () => {
    if (selectedVariant) {
      setIsPracticeMode(true);
      setActiveTab("practice");
    }
  };

  const handleBackToVariants = () => {
    setIsPracticeMode(false);
    setActiveTab("refine");
  };

  const selectVariant = (variant: string, type: string) => {
    setSelectedVariant(variant);
    setSelectedVariantType(type);
  };

  const getVariantColor = (key: string) => {
    const variantTypes: Record<string, string> = {
      formal: "bg-blue-50 border-blue-200 text-blue-700",
      confident: "bg-green-50 border-green-200 text-green-700",
      concise: "bg-amber-50 border-amber-200 text-amber-700",
      engaging: "bg-purple-50 border-purple-200 text-purple-700",
      professional: "bg-indigo-50 border-indigo-200 text-indigo-700",
      simple: "bg-gray-50 border-gray-200 text-gray-700",
      persuasive: "bg-red-50 border-red-200 text-red-700",
      friendly: "bg-pink-50 border-pink-200 text-pink-700",
      motivational: "bg-orange-50 border-orange-200 text-orange-700"
    };
    
    const formattedKey = key.toLowerCase().replace(/_/g, "");
    for (const [type, color] of Object.entries(variantTypes)) {
      if (formattedKey.includes(type)) {
        return color;
      }
    }
    return "bg-gray-50 border-gray-200 text-gray-700";
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg pt-0 mt-8">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50 pt-4 rounded-sm">
        <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
          <Sparkles className="mr-2 text-purple-600" />
          Speech Refinement Tool
        </CardTitle>
        <CardDescription className="text-gray-600">
          Refine your speech and practice with real-time feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mx-auto">
            <TabsTrigger value="refine" className="py-3">
              <div className="flex items-center">
                <Sparkles className="mr-2 h-4 w-4" />
                Refine Text
              </div>
            </TabsTrigger>
            <TabsTrigger value="practice" className="py-3" disabled={!selectedVariant && !isPracticeMode}>
              <div className="flex items-center">
                <Mic className="mr-2 h-4 w-4" />
                Practice Speaking
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="refine" className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Enter your text</h3>
                <Textarea
                  placeholder="Enter the speech or text you want to refine..."
                  value={inputText}
                  onChange={(e: any) => setInputText(e.target.value)}
                  className="min-h-[150px] resize-y"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Enter a paragraph or speech segment for best results
                </p>
              </div>

              <Button
                onClick={handleRephrase}
                disabled={!inputText.trim() || loading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                size="lg"
              >
                {loading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Refined Variations
              </Button>

              {/* Results section */}
              {rephraseResults && Object.entries(rephraseResults).length > 0 && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Volume2 className="mr-2 h-5 w-5 text-purple-500" />
                    Choose Your Preferred Style
                  </h3>
                  
                  <div className="grid gap-4">
                    {Object.entries(rephraseResults).map(([key, variant]) => {
                      const formattedKey = key.replace(/_/g, " ");
                      const colorClass = getVariantColor(key);
                      
                      return (
                        <div
                          key={key}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedVariant === variant
                              ? "ring-2 ring-purple-500 border-transparent"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => selectVariant(variant, formattedKey)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 w-full">
                              <div className="flex items-center justify-between">
                                <Badge className={`font-medium capitalize ${colorClass}`}>
                                  {formattedKey}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(variant);
                                  }}
                                  className="h-8 px-2"
                                >
                                  {copiedVariant === variant ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4 text-gray-500" />
                                  )}
                                  <span className="ml-1 text-xs">
                                    {copiedVariant === variant ? "Copied" : "Copy"}
                                  </span>
                                </Button>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{variant}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedVariant && (
                    <Button
                      onClick={handlePractice}
                      className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                      size="lg"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Practice {selectedVariantType ? `"${selectedVariantType}"` : "Selected"} Variant
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="practice" className="p-6 space-y-6">
            {isPracticeMode && selectedVariant && (
              <>
                <Button
                  variant="outline"
                  onClick={handleBackToVariants}
                  className="mb-4"
                  size="sm"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Variants
                </Button>

                <Alert className="bg-purple-50 border-purple-100">
                  <div className="mb-2">

                  </div>
                  <AlertDescription className="text-gray-700 leading-relaxed">
                    {selectedVariant}
                  </AlertDescription>
                </Alert>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Mic className="mr-2 h-5 w-5 text-green-500" />
                    Practice Speaking
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Record yourself practicing the refined speech to receive personalized feedback
                  </p>
                </div>

                <VoiceAnalyzer />
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SpeechRefinement;