import { uploadAudio } from '@/api/apiRequests';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Mic, StopCircle, Upload } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from "react-dropzone";
import { useNavigate } from 'react-router-dom';

const VoiceAnalyzer: React.FC = () => {
  const router = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("record");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
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

  // Handle upload to API
  const handleUpload = async () => {
    let fileToUpload: File | null = null;
    
    if (activeTab === "upload" && audioFile) {
      fileToUpload = audioFile;
    } else if (activeTab === "record" && recordedBlob) {
      fileToUpload = new File([recordedBlob], "audio.mp3", { type: "audio/mp3" });
    }
    
    if (!fileToUpload) {
      alert("Please upload or record an audio file first");
      return;
    }
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append("file", fileToUpload, "audio.mp3");
      
      const response = await uploadAudio(formData)
      if (response.data.id) {
        router(`/analyse-report/${response.data.id}`);
      } else {
        throw new Error("No ID received from server");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Failed to upload audio. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Voice Analyzer</CardTitle>
        <CardDescription>
          Analyze your voice and get feedback on your public speaking skills
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="record" disabled={isRecording}>Record Audio</TabsTrigger>
            <TabsTrigger value="upload" disabled={isRecording}>Upload Audio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="record" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              {!isRecording && !recordedBlob && (
                <Button 
                  onClick={startRecording}
                  className="flex items-center space-x-2"
                >
                  <Mic size={20} />
                  <span>Start Recording</span>
                </Button>
              )}
              
              {isRecording && (
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock size={20} />
                      <span>{formatTime(recordingTime)} / 04:00</span>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={stopRecording}
                      className="flex items-center space-x-2"
                    >
                      <StopCircle size={20} />
                      <span>Stop Recording</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>0:00</span>
                      <span>4:00</span>
                    </div>
                    <Progress value={(recordingTime / MAX_RECORDING_TIME) * 100} />
                  </div>
                  
                  {/* Recording animation */}
                  <div className="flex justify-center py-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 bg-red-500 rounded-full opacity-75 animate-ping"></div>
                      <div className="relative flex items-center justify-center w-16 h-16 bg-red-600 rounded-full">
                        <Mic className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!isRecording && recordedBlob && (
                <div className="w-full space-y-4">
                  <audio controls className="w-full">
                    <source src={URL.createObjectURL(recordedBlob)} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={resetRecording} className="flex-1">
                      Record Again
                    </Button>
                    <Button onClick={handleUpload} disabled={isUploading} className="flex-1">
                      {isUploading ? "Uploading..." : "Get Feedback"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center p-6 space-y-4 border-2 border-dashed rounded-md cursor-pointer transition hover:border-primary"
      >
        <input {...getInputProps()} />
        <Upload size={40} className="text-gray-400" />
        <p className="text-sm text-gray-500">
          {isDragActive ? "Drop your file here..." : "Drag & drop or click to upload (MP3, WAV, etc.)"}
        </p>
      </div>

      {/* File Details & Upload Button */}
      {audioFile && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Selected file: {audioFile.name}</p>
          <Button onClick={handleUpload} disabled={isUploading} className="w-full">
            {isUploading ? "Uploading..." : "Get Feedback"}
          </Button>
        </div>
      )}
    </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <p className="text-xs text-gray-500">
          Your audio will be processed securely to provide personalized speaking feedback.
        </p>
      </CardFooter>
    </Card>
  );
};

export default VoiceAnalyzer;