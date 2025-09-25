// Backend response types matching the provided data structure
export type ProcessingMetrics = {
  totalProcessingTimeMs: number;
  audioLoadTimeMs: number;
  transcriptionTimeMs: number;
  analysisTimeMs: number;
  memoryUsedMb: number;
};

export type AudioMetadata = {
  durationSeconds: number;
  sampleRate: number;
  channels: number;
  format: string;
  fileSizeBytes: number;
};

export type SpeechRateSegment = {
  start: number;
  end: number;
  startIndex: number;
  endIndex: number;
  speechRate: number;
};

export type SpeechRateAnalysis = {
  avgSpeechRate: number;
  minWpm: number;
  maxWpm: number;
  standardDeviation: number;
  segments: SpeechRateSegment[];
  slowestSegment: SpeechRateSegment;
  fastestSegment: SpeechRateSegment;
  chartUrl: string | null;
  score: number;
  feedback: string;
  category: string;
};

export type IntonationAnalysis = {
  averagePitch: number;
  minPitch: number;
  maxPitch: number;
  pitchRange: number;
  pitchVariation: number;
  pitchVariationScore: number;
  chartUrl: string | null;
  score: number;
  feedback: string | null;
  category: string | null;
};

export type EnergyAnalysis = {
  averageEnergy: number;
  minEnergy: number;
  maxEnergy: number;
  energyVariation: number;
  score: number;
  feedback: string;
  category: string;
};

export type LongestPause = {
  startTime: number;
  endTime: number;
  duration: number;
};

export type PauseAnalysis = {
  totalPauses: number;
  totalPauseDuration: number;
  averagePauseDuration: number;
  longestPause: LongestPause;
  score: number;
  feedback: string;
  category: string;
};

export type VocabWord = {
  word: string;
  count: number;
};

export type GrammaticalError = {
  sentence: string;
  correct: string;
  explanation: string;
};

export type LongSentenceItem = {
  sentence: string;
  suggestion: string;
};

export type WordMeaning = {
  word: string;
  meaning: string;
};

export type VocabAnalysis = {
  repeatedWords: string;
  grammaticalErrors: string;
  longSentences: string;
  modifiedText: string;
  fancyText: string;
  meanings: string;
};

export type Transcription = {
  fullText: string;
  language: string;
};

export type AnalysisResult = {
  requestId: string;
  userId: string;
  audioUrl: string;
  analyzedAt: string;
  processingMetrics: ProcessingMetrics;
  audioMetadata: AudioMetadata;
  speechRate: SpeechRateAnalysis;
  intonation: IntonationAnalysis;
  energy: EnergyAnalysis;
  pauses: PauseAnalysis;
  overallScore: number;
  vocabAnalysis: VocabAnalysis;
  transcription: Transcription;
};

// Legacy types for backward compatibility
export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RETRYING';

export type UploadResponse = {
  request_id: string;
  status: AnalysisStatus;
  message: string;
  audio_url: string;
  duration_seconds: number;
  upload_time_ms: number;
  estimated_processing_time_seconds: number;
};

export type QuickResults = {
  overall_score: number;
  average_wpm: number;
  speech_rate_score: number;
  intonation_score: number;
  energy_score: number;
  pause_score: number;
  duration_seconds?: number;
  total_pauses?: number;
  transcription_preview?: string;
  ai_analysis_available?: boolean;
  overall_feedback?: string;
  pitch_variation?: number;
  average_energy?: number;
  speech_rate_chart_url?: string;
  intonation_chart_url?: string;
  energy_chart_url?: string;
};

export type FileInfo = {
  original_filename: string;
  file_size_bytes: number;
  duration_seconds: number;
  sample_rate: number;
  channels: number;
};

export type AnalysisStatusResponse = {
  request_id: string;
  status: AnalysisStatus;
  message: string;
  requested_at?: string;
  processing_started_at?: string;
  completed_at?: string;
  processing_time_ms?: number;
  audio_url?: string;
  analysis_result_url?: string;
  chart_urls?: {
    speech_rate?: string;
    intonation?: string;
    energy?: string;
  };
  quick_results?: QuickResults;
  processing_metrics?: ProcessingMetrics;
  file_info?: FileInfo;
  error?: string;
  retry_count?: number;
  max_retries_reached?: boolean;
  analysis_data?: AnalysisResult;
};

export type AnalysisHistoryItem = {
  request_id: string;
  file_name: string;
  status: AnalysisStatus;
  requested_at: string;
  duration_seconds: number;
  quick_results?: QuickResults;
};

export type AnalysisHistory = {
  history: AnalysisHistoryItem[];
  page: number;
  size: number;
  total: number;
  has_more: boolean;
};

type LegacySpeechSegment = {
  speech_rate: number;
  type: string;
  start: number;
  end: number;
};

export type LegacySpeechRateData = {
  avg: number;
  percent: number;
  category: string;
  remark: string;
  slowest_segment: LegacySpeechSegment;
  fastest_segment: LegacySpeechSegment;
};

export type LegacyIntonationData = {
  avg: number;
  percent: number;
  category: string;
  remark: string;
};

export type LegacyEnergyData = {
  avg: number;
  percent: number;
  category: string;
  remark: string;
};

export type LegacyConfidenceData = {
  avg: number;
  percent: number;
  category: string;
  remark: string;
};

export type LegacyVocabAnalysisData = {
  repeated_words: VocabWord[];
  meanings: WordMeaning[];
  grammatical_errors: GrammaticalError[];
  long_sentences: LongSentenceItem[];
  modified_text: string;
  fancy_text: string;
};

type SpeechAnalysis = {
  audio: string;
  transcription: string;
  speech_rate: LegacySpeechRateData;
  intonation: LegacyIntonationData;
  energy: LegacyEnergyData;
  confidence: LegacyConfidenceData;
  conversation_score: number;
  vocab_analysis: LegacyVocabAnalysisData;
  speech_rate_fig: string;
  intonation_fig: string;
  energy_fig: string;
};

// Export aliases for backward compatibility
export type SpeechRateData = LegacySpeechRateData;
export type IntonationData = LegacyIntonationData;
export type EnergyData = LegacyEnergyData;
export type ConfidenceData = LegacyConfidenceData;

export default SpeechAnalysis;