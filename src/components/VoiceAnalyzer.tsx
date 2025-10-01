import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAsyncAnalysis } from '@/hooks/useAsyncAnalysis';
import { AlertCircle, CheckCircle, Clock, Mic, StopCircle, Upload } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from "react-dropzone";
import { useNavigate } from 'react-router-dom';
import CompactLoading from './CompactLoading';

interface VoiceAnalyzerProps {
  externalRecordingControl?: {
    shouldStartRecording?: boolean;
    onRecordingStateChange?: (isRecording: boolean) => void;
  };
}

const VoiceAnalyzer: React.FC<VoiceAnalyzerProps> = ({ externalRecordingControl }) => {
  const router = useNavigate();
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

    if (audioFile) {
      fileToUpload = audioFile;
    } else if (recordedBlob) {
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

  // Handle external recording control
  useEffect(() => {
    if (externalRecordingControl?.shouldStartRecording && !isRecording && !recordedBlob) {
      startRecording();
    }
  }, [externalRecordingControl?.shouldStartRecording, isRecording, recordedBlob]);

  // Notify external component of recording state changes
  useEffect(() => {
    if (externalRecordingControl?.onRecordingStateChange) {
      externalRecordingControl.onRecordingStateChange(isRecording);
    }
  }, [isRecording, externalRecordingControl]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Floating Stop Recording Button */}
      {isRecording && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <Button
            onClick={stopRecording}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <StopCircle size={18} />
            <span>Stop Recording</span>
          </Button>
        </div>
      )}

      {showLoadingScreen ? (
        <CompactLoading status={analysisResult?.status || 'PENDING'} />
      ) : (
        <div className="w-full max-w-md mx-auto rounded-xl border-0 bg-white/90 backdrop-blur-sm">
          {/* Recording Section */}
          {!isRecording && !recordedBlob && (
            <div className="text-center space-y-4">

              <Button
                onClick={startRecording}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <Mic size={18} />
                <span>Start Practicing</span>
              </Button>
            </div>
          )}

          {isRecording && (
            <div className="space-y-4">
              {/* Recording Timer */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center space-x-2 text-sm font-medium text-blue-700">
                  <Clock size={16} />
                  <span>{formatTime(recordingTime)} / 04:00</span>
                </div>
                <Progress
                  value={(recordingTime / MAX_RECORDING_TIME) * 100}
                  className="h-1.5"
                />
              </div>

              {/* Recording Animation */}
              <div className="flex justify-center py-3">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
                  <div className="absolute inset-1 bg-blue-500 rounded-full opacity-60 animate-ping animation-delay-75"></div>
                  <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                    <Mic className="text-white" size={18} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isRecording && recordedBlob && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <audio controls className="w-full mb-3">
                  <source src={URL.createObjectURL(recordedBlob)} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={resetRecording}
                    className="flex-1 text-sm py-2"
                  >
                    Record Again
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || isPolling}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-sm py-2"
                  >
                    {isUploading ? "Uploading..." : isPolling ? "Processing..." : "Get Feedback"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          {!isRecording && !recordedBlob && (
            <p className="w-fit mx-auto text-xs text-gray-500 font-medium my-4">Or</p>
          )}

          {/* Upload Section */}
          {!isRecording && !recordedBlob && (
            <div className="space-y-3">
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${isDragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
              >
                <input {...getInputProps()} />
                <Upload size={20} className="text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600 text-center">
                  {isDragActive ? "Drop your file here" : "Drag & drop audio file"}
                </p>
                <p className="text-xs text-gray-500 text-center">
                  MP3, WAV, M4A supported
                </p>
              </div>

              {audioFile && (
                <div className="bg-green-50 rounded-lg p-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{audioFile.name}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || isPolling}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-sm py-2"
                  >
                    {isUploading ? "Uploading..." : isPolling ? "Processing..." : "Analyze Speech"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Analysis Status Display */}
          {(uploadResponse || isUploading || isPolling || error) && (
            <div className="mt-4 space-y-3">
              {error && (
                <Alert className="border-red-200 bg-red-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {uploadResponse && (
                <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-700">Status:</span>
                    <Badge
                      className="text-xs"
                      variant={
                        analysisResult?.status === 'COMPLETED' ? 'default' :
                          analysisResult?.status === 'FAILED' ? 'destructive' :
                            'secondary'
                      }
                    >
                      {analysisResult?.status || uploadResponse.status}
                    </Badge>
                  </div>

                  {isPolling && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-700">Processing...</span>
                        <span className="text-blue-600">Please wait</span>
                      </div>
                      <Progress value={undefined} className="h-1" />
                    </div>
                  )}

                  {analysisResult?.status === 'COMPLETED' && analysisResult.quick_results && (
                    <div className="bg-green-50 rounded-lg p-3 space-y-2">
                      <p className="text-xs font-semibold text-green-800">Quick Results</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white rounded p-1">
                          <span className="text-gray-600">Overall:</span>
                          <span className="font-bold text-green-600 ml-1">{analysisResult.quick_results.overall_score}/100</span>
                        </div>
                        <div className="bg-white rounded p-1">
                          <span className="text-gray-600">Speech Rate:</span>
                          <span className="font-bold text-green-600 ml-1">{analysisResult.quick_results.speech_rate_score}/100</span>
                        </div>
                      </div>
                      <p className="text-xs text-green-700 font-medium">
                        Redirecting to detailed results...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VoiceAnalyzer;