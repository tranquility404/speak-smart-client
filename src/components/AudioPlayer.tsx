import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Play, Pause, Volume2, VolumeX, Loader2, AlertCircle } from "lucide-react";
import { Slider } from "./ui/slider";

type AudioPlayerProps = {
  audioStr: string;
  startTimestamp?: number;
  endTimestamp?: number;
  className?: string;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioStr,
  startTimestamp = 0,
  endTimestamp,
  className = "",
}) => {
  // Check if audioStr is a URL or base64 data
  const isUrl = audioStr.startsWith('http://') || audioStr.startsWith('https://');
  const audioUrl = isUrl ? audioStr : `data:audio/wav;base64,${audioStr}`;
  console.log("AudioPlayer initialized with:", { isUrl, audioStr: audioStr.substring(0, 100) + '...', audioUrl: audioUrl.substring(0, 100) + '...' });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    console.log("AudioPlayer: Loading audio from", isUrl ? 'URL' : 'base64', audioUrl.substring(0, 100) + '...');

    audio.currentTime = startTimestamp;

    const handleLoadedMetadata = () => {
      console.log("AudioPlayer: Audio loaded successfully, duration:", audio.duration);
      setDuration(audio.duration);
      setLoading(false);
    };

    const handleError = (e: any) => {
      console.error("AudioPlayer: Error loading audio:", e, audio.error);
      setError(true);
      setLoading(false);
    };

    const handleCanPlay = () => {
      console.log("AudioPlayer: Audio can play");
      setLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [startTimestamp, audioStr, audioUrl, isUrl]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current || loading) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (endTimestamp && currentTime >= endTimestamp) {
        audioRef.current.currentTime = startTimestamp;
      }
      audioRef.current.play().catch(() => {
        setError(true);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (endTimestamp && audioRef.current.currentTime >= endTimestamp) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0] / 100;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // const toggleMute = () => {
  //   if (!audioRef.current) return;
  //   if (volume > 0) {
  //     audioRef.current.volume = 0;
  //     setVolume(0);
  //   } else {
  //     audioRef.current.volume = 1;
  //     setVolume(1);
  //   }
  // };

  return (
    <div className={`bg-gradient-to-r from-slate-50 to-gray-50 shadow-md border border-gray-200 rounded-xl p-5 transition-all hover:shadow-lg ${className}`}>
      {loading ? (
        <div className="flex items-center justify-center h-16 bg-white rounded-lg">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            <span className="text-sm font-medium text-gray-600">Loading audio...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-16 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">Failed to load audio</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              onClick={handlePlayPause}
              disabled={loading}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 ml-0.5 text-white" />
              )}
            </Button>

            <div className="flex-1 mt-auto">
              <Slider
                value={[currentTime / duration * 100 || 0]}
                min={0}
                max={100}
                step={0.1}
                onValueChange={handleSliderChange}
                className="cursor-pointer"
                aria-label="Audio progress"
              />
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded-md">{formatTime(currentTime)}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="relative flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 rounded-full border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                onMouseEnter={() => setShowVolumeSlider(true)}
                aria-label="Volume control"
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-gray-600" />
                ) : (
                  <Volume2 className="h-4 w-4 text-gray-600" />
                )}
              </Button>

              {showVolumeSlider && (
                <div
                  className="absolute bottom-full mb-3 p-4 bg-white shadow-xl rounded-xl w-36 right-0 z-10 border border-gray-200"
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Volume</span>
                      <span className="text-xs font-medium text-gray-800">{Math.round(volume * 100)}%</span>
                    </div>
                    <Slider
                      value={[volume * 100]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      aria-label="Volume slider"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <audio
        ref={audioRef}
        src={audioUrl}
        crossOrigin={isUrl ? "anonymous" : undefined}
        onTimeUpdate={handleTimeUpdate}
        className="hidden"
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
    </div>
  );
};

export default AudioPlayer;