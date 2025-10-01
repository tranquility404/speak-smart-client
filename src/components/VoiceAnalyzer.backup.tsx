import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAsyncAnalysis } from '@/hooks/useAsyncAnalysis';
import { AlertCircle, CheckCircle, Clock, Loader2, Mic, StopCircle, Upload } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from "react-dropzone";
import { useNavigate } from 'react-router-dom';
import CompactLoading from './CompactLoading';

const VoiceAnalyzer: React.FC = () => {
  const router = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("record");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // New async analysis hooks
  const {
    uploadFile,
    isUploading,
    isPolling,
    error,
    uploadResponse,
    analysisResult
  } = useAsyncAnalysis();

  const MAX_RECORDING_TIME = 240; // 4 minutes in seconds

  // Format time to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setAudioFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "audio/*": [] },
    onDrop,
  });

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/mp4" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setRecordedBlob(audioBlob);

        // Stop all tracks on the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access your microphone. Please check your browser permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Reset recording state
  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
  };

  // Handle upload to API with new async workflow
  const handleUpload = async () => {
    let fileToUpload: File | null = null;

    if (activeTab === "upload" && audioFile) {
      fileToUpload = audioFile;
    } else if (activeTab === "record" && recordedBlob) {
      fileToUpload = new File([recordedBlob], "recording.mp3", { type: "audio/mp3" });
    }

    if (!fileToUpload) {
      alert("Please upload or record an audio file first");
      return;
    }

    try {
      setShowLoadingScreen(true);
      await uploadFile(fileToUpload);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setShowLoadingScreen(false);
    }
  };

  // Navigate to analysis report when upload is complete and we have request ID
  useEffect(() => {
    if (uploadResponse?.request_id && showLoadingScreen) {
      router(`/analyse-report/${uploadResponse.request_id}`);
    }
  }, [uploadResponse, router, showLoadingScreen]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Floating Stop Recording Button */}
      {isRecording && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <Button
            onClick={stopRecording}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <StopCircle size={20} />
            <span>Stop Recording</span>
          </Button>
        </div>
      )}

      {showLoadingScreen ? (
        <CompactLoading status={analysisResult?.status || 'PENDING'} />
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Voice Practice Studio
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Record your speech or upload an audio file to get personalized feedback on your speaking skills
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-md">
              <button
                onClick={() => setActiveTab("record")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "record"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600"
                  }`}
              >
                <Mic className="inline-block w-4 h-4 mr-2" />
                Record Speech
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "upload"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600"
                  }`}
              >
                <Upload className="inline-block w-4 h-4 mr-2" />
                Upload File
              </button>
            </div>
          </div>

          {/* Recording Tab */}
          {activeTab === "record" && (
            <Card className="rounded-xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                  {!isRecording && !recordedBlob && (
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg">
                        <Mic className="text-white" size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Practice?</h3>
                        <p className="text-gray-600 mb-6">Click the button below to start recording your speech</p>
                        <Button
                          onClick={startRecording}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                        >
                          <Mic size={20} />
                          <span>Start Practicing</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {isRecording && (
                    <div className="w-full space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Recording in Progress</h3>
                        <p className="text-gray-600">Speak clearly and practice your delivery</p>
                      </div>

                      {/* Recording Timer */}
                      <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-center space-x-2 text-lg font-medium text-blue-700">
                          <Clock size={20} />
                          <span>{formatTime(recordingTime)} / 04:00</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>0:00</span>
                            <span>4:00</span>
                          </div>
                          <Progress
                            value={(recordingTime / MAX_RECORDING_TIME) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>

                      {/* Recording Animation */}
                      <div className="flex justify-center py-6">
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
                          <div className="absolute inset-2 bg-blue-500 rounded-full opacity-60 animate-ping animation-delay-75"></div>
                          <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg">
                            <Mic className="text-white" size={24} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isRecording && recordedBlob && (
                    <div className="w-full space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Recording Complete!</h3>
                        <p className="text-gray-600">Listen to your recording and get feedback</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <audio controls className="w-full mb-4">
                          <source src={URL.createObjectURL(recordedBlob)} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>

                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            onClick={resetRecording}
                            className="flex-1 border-2 hover:bg-gray-50"
                          >
                            Record Again
                          </Button>
                          <Button
                            onClick={handleUpload}
                            disabled={isUploading || isPolling}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            {isUploading ? "Uploading..." : isPolling ? "Processing..." : "Get Feedback"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <Card className="rounded-xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Audio File</h3>
                    <p className="text-gray-600">Upload your recorded speech for analysis</p>
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${isDragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                  >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                      <Upload size={24} className="text-white" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {isDragActive ? "Drop your file here" : "Drag & drop your audio file"}
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to browse (MP3, WAV, M4A supported)
                    </p>
                  </div>

                  {/* File Details & Upload Button */}
                  {audioFile && (
                    <div className="bg-green-50 rounded-xl p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">File Selected</p>
                          <p className="text-sm text-gray-600">{audioFile.name}</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleUpload}
                        disabled={isUploading || isPolling}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isUploading ? "Uploading..." : isPolling ? "Processing..." : "Analyze My Speech"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Status Display */}
          {(uploadResponse || isUploading || isPolling || error) && (
            <Card className="mt-6 rounded-xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  {isUploading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                  {isPolling && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                  {analysisResult?.status === 'COMPLETED' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {error && <AlertCircle className="h-4 w-4 text-red-500" />}
                  Analysis Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4 border-red-200 bg-red-50 rounded-xl">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {uploadResponse && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-blue-700">Request ID</span>
                        <Badge variant="outline" className="ml-2 font-mono text-xs">
                          {uploadResponse.request_id.slice(0, 8)}...
                        </Badge>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-blue-700">Status</span>
                        <Badge
                          className="ml-2"
                          variant={
                            analysisResult?.status === 'COMPLETED' ? 'default' :
                              analysisResult?.status === 'FAILED' ? 'destructive' :
                                'secondary'
                          }
                        >
                          {analysisResult?.status || uploadResponse.status}
                        </Badge>
                      </div>
                    </div>

                    {uploadResponse.duration_seconds && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-700">Duration: </span>
                        <span className="text-sm">{Math.round(uploadResponse.duration_seconds)}s</span>
                      </div>
                    )}

                    {uploadResponse.estimated_processing_time_seconds && analysisResult?.status !== 'COMPLETED' && (
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-yellow-700">Est. Processing Time: </span>
                        <span className="text-sm">{Math.round(uploadResponse.estimated_processing_time_seconds)}s</span>
                      </div>
                    )}

                    {isPolling && (
                      <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between text-sm font-medium text-blue-700">
                          <span>Processing your speech...</span>
                          <span>Please wait</span>
                        </div>
                        <Progress value={undefined} className="h-2" />
                      </div>
                    )}

                    {analysisResult?.status === 'COMPLETED' && analysisResult.quick_results && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-green-800 mb-3">Quick Results Preview</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white rounded-lg p-2">
                            <span className="text-gray-600">Overall Score:</span>
                            <span className="font-bold text-green-600 ml-1">{analysisResult.quick_results.overall_score}/100</span>
                          </div>
                          <div className="bg-white rounded-lg p-2">
                            <span className="text-gray-600">Speech Rate:</span>
                            <span className="font-bold text-green-600 ml-1">{analysisResult.quick_results.speech_rate_score}/100</span>
                          </div>
                          <div className="bg-white rounded-lg p-2">
                            <span className="text-gray-600">Intonation:</span>
                            <span className="font-bold text-green-600 ml-1">{analysisResult.quick_results.intonation_score}/100</span>
                          </div>
                          <div className="bg-white rounded-lg p-2">
                            <span className="text-gray-600">Energy:</span>
                            <span className="font-bold text-green-600 ml-1">{analysisResult.quick_results.energy_score}/100</span>
                          </div>
                        </div>
                        <p className="text-sm text-green-700 mt-3 font-medium">
                          Redirecting to detailed results...
                        </p>
                      </div>
                    )}

                    {analysisResult?.message && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 italic">
                          {analysisResult.message}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Your audio is processed securely to provide personalized speaking feedback
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAnalyzer;