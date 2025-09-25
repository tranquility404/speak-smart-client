// Example usage of the new data structure
// This file demonstrates how to work with the new backend response format

import { AnalysisResult } from '../types/analysis';

// Example of the new backend response data that matches your provided structure
export const exampleAnalysisResult: AnalysisResult = {
    requestId: "68d4449cd28bc5b8dd7da878",
    userId: "68cfebf05c4e3d3f415a4028",
    audioUrl: "https://res.cloudinary.com/dx9zqxbvs/video/upload/v1758741659/audio/g4ywbixd3dkfst98wkf1.wav",
    analyzedAt: "2025-09-25T00:51:02.8025389",
    processingMetrics: {
        totalProcessingTimeMs: 14754,
        audioLoadTimeMs: 181,
        transcriptionTimeMs: 5719,
        analysisTimeMs: 3486,
        memoryUsedMb: 102
    },
    audioMetadata: {
        durationSeconds: 53.54609977324263,
        sampleRate: 44100,
        channels: 1,
        format: "audio/wav",
        fileSizeBytes: 4722766
    },
    speechRate: {
        avgSpeechRate: 125.65116279069767,
        minWpm: 118.60465116279069,
        maxWpm: 132.0,
        standardDeviation: 6.367975243938174,
        segments: [
            {
                start: 0.0,
                end: 5.0,
                startIndex: 0,
                endIndex: 50,
                speechRate: 132.0
            },
            {
                start: 5.0,
                end: 11.0,
                startIndex: 50,
                endIndex: 118,
                speechRate: 120.0
            },
            {
                start: 11.0,
                end: 16.0,
                startIndex: 118,
                endIndex: 169,
                speechRate: 132.0
            },
            {
                start: 16.0,
                end: 24.6,
                startIndex: 169,
                endIndex: 251,
                speechRate: 118.60465116279069
            }
        ],
        slowestSegment: {
            start: 16.0,
            end: 24.6,
            startIndex: 169,
            endIndex: 251,
            speechRate: 118.60465116279069
        },
        fastestSegment: {
            start: 0.0,
            end: 5.0,
            startIndex: 0,
            endIndex: 50,
            speechRate: 132.0
        },
        chartUrl: "https://res.cloudinary.com/dx9zqxbvs/image/upload/v1758741674/charts/fk4idc2iz5oatbxqfkkx.png",
        score: 47.10077519379844,
        feedback: "Speed up slightly to keep the speech more dynamic.",
        category: "slow"
    },
    intonation: {
        averagePitch: 0.0,
        minPitch: 0.0,
        maxPitch: 0.0,
        pitchRange: 0.0,
        pitchVariation: 0.0,
        pitchVariationScore: 0.0,
        chartUrl: null,
        score: 0.0,
        feedback: null,
        category: null
    },
    energy: {
        averageEnergy: 0.024343242820032304,
        minEnergy: 0.0,
        maxEnergy: 0.14939886214385018,
        energyVariation: 1.0279927451637665,
        score: 38.6864856400646,
        feedback: "Increase your volume to project more confidence.",
        category: "low"
    },
    pauses: {
        totalPauses: 15,
        totalPauseDuration: 16.625494617968798,
        averagePauseDuration: 1.1083663078645865,
        longestPause: {
            startTime: 34.34231185913086,
            endTime: 36.977779388427734,
            duration: 2.635467529296875
        },
        score: 71.95542407046581,
        feedback: "Minimal pauses convey strong confidence and authority.",
        category: "less pauses"
    },
    overallScore: 39.43567122608221,
    vocabAnalysis: {
        repeatedWords: JSON.stringify([
            { word: "I", count: 2 },
            { word: "am", count: 2 },
            { word: "a", count: 2 },
            { word: "software developer", count: 1 },
            { word: "B.Tech", count: 1 },
            { word: "Access Colleges Kanpur", count: 1 },
            { word: "AIML", count: 1 },
            { word: "coding", count: 1 },
            { word: "listen", count: 1 },
            { word: "aspiring", count: 1 }
        ]),
        grammaticalErrors: JSON.stringify([
            {
                sentence: "I love to code, watch enemies and listen to music.",
                correct: "I love coding, watching movies, and listening to music.",
                explanation: "Incorrect word 'enemies' replaced with 'movies' for clarity."
            }
        ]),
        longSentences: JSON.stringify([
            {
                sentence: "My interest in coding is the reason why I am aspiring to be a software developer.",
                suggestion: "My passion for coding drives my aspiration to become a software developer."
            }
        ]),
        modifiedText: "My name is Aman Verma. I am pursuing a B.Tech in AIML at Access Colleges Kanpur. I enjoy coding, watching movies, and listening to music. My passion for coding drives my aspiration to become a software developer.",
        fancyText: "My name is Aman Verma. I am enrolled in a B.Tech program specializing in Artificial Intelligence and Machine Learning at Access Colleges Kanpur. I derive pleasure from programming, viewing cinematic productions, and appreciating musical artistry. My fervent interest in computational problem-solving motivates my ambition to evolve into a proficient software engineer.",
        meanings: JSON.stringify([
            { word: "specializing", meaning: "Focusing intensely on a specific area" },
            { word: "appreciating", meaning: "Recognizing the value of something" },
            { word: "fervent", meaning: "Strongly passionate" },
            { word: "computational", meaning: "Related to computing processes" },
            { word: "proficient", meaning: "Highly skilled in a particular area" }
        ])
    },
    transcription: {
        fullText: " My name is Aman Verma and currently I am pursuing a B.Tech from Access Colleges Kanpur with a specialization in AIML. I love to code, watch enemies and listen to music. My interest in coding is the reason why I am aspiring to be a software developer.",
        language: "English"
    }
};

// Utility function to parse JSON strings from VocabAnalysis
export function parseVocabAnalysis(vocabAnalysis: {
    repeatedWords: string;
    grammaticalErrors: string;
    longSentences: string;
    meanings: string;
    modifiedText: string;
    fancyText: string;
}) {
    try {
        return {
            repeatedWords: JSON.parse(vocabAnalysis.repeatedWords),
            grammaticalErrors: JSON.parse(vocabAnalysis.grammaticalErrors),
            longSentences: JSON.parse(vocabAnalysis.longSentences),
            meanings: JSON.parse(vocabAnalysis.meanings),
            modifiedText: vocabAnalysis.modifiedText,
            fancyText: vocabAnalysis.fancyText
        };
    } catch (error) {
        console.error('Error parsing vocab analysis JSON:', error);
        return {
            repeatedWords: [],
            grammaticalErrors: [],
            longSentences: [],
            meanings: [],
            modifiedText: vocabAnalysis.modifiedText || '',
            fancyText: vocabAnalysis.fancyText || ''
        };
    }
}

// Function to extract key insights from the analysis
export function getAnalysisInsights(analysis: AnalysisResult) {
    const insights = [];

    // Speech rate insights
    if (analysis.speechRate.score < 50) {
        insights.push(`Your speech rate of ${analysis.speechRate.avgSpeechRate.toFixed(1)} WPM is ${analysis.speechRate.category}. ${analysis.speechRate.feedback}`);
    }

    // Energy insights
    if (analysis.energy.score < 50) {
        insights.push(`Your energy level needs improvement. ${analysis.energy.feedback}`);
    }

    // Pause insights
    if (analysis.pauses.score > 70) {
        insights.push(`Good use of pauses! ${analysis.pauses.feedback}`);
    }

    return insights;
}

// Function to get formatted duration
export function getFormattedDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to get score category
export function getScoreCategory(score: number): string {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
}