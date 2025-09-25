import { useState, useCallback } from 'react';
import { uploadAudio, getAnalysisStatus } from '@/api/apiRequests';
import { UploadResponse, AnalysisStatusResponse } from '@/types/analysis';

interface UseAsyncAnalysisResult {
    uploadFile: (file: File) => Promise<void>;
    pollForResults: (requestId: string) => Promise<AnalysisStatusResponse>;
    isUploading: boolean;
    isPolling: boolean;
    error: string | null;
    uploadResponse: UploadResponse | null;
    analysisResult: AnalysisStatusResponse | null;
}

const POLLING_INTERVAL = 3000; // 3 seconds
const MAX_POLLING_TIME = 10 * 60 * 1000; // 10 minutes

export const useAsyncAnalysis = (): UseAsyncAnalysisResult => {
    const [isUploading, setIsUploading] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisStatusResponse | null>(null);

    const uploadFile = useCallback(async (file: File) => {
        try {
            setIsUploading(true);
            setError(null);
            setUploadResponse(null);
            setAnalysisResult(null);

            const formData = new FormData();
            formData.append('file', file);

            const response = await uploadAudio(formData);
            setUploadResponse(response.data);

            // Automatically start polling for results
            await pollForResults(response.data.request_id);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload audio file');
            throw err;
        } finally {
            setIsUploading(false);
        }
    }, []);

    const pollForResults = useCallback(async (requestId: string): Promise<AnalysisStatusResponse> => {
        return new Promise((resolve, reject) => {
            setIsPolling(true);
            setError(null);

            const startTime = Date.now();

            const poll = async () => {
                try {
                    // Check if we've exceeded the maximum polling time
                    if (Date.now() - startTime > MAX_POLLING_TIME) {
                        setError('Analysis is taking longer than expected. Please check back later.');
                        setIsPolling(false);
                        reject(new Error('Polling timeout'));
                        return;
                    }

                    const response = await getAnalysisStatus(requestId);
                    const result = response.data;
                    setAnalysisResult(result);

                    if (result.status === 'COMPLETED') {
                        setIsPolling(false);
                        resolve(result);
                    } else if (result.status === 'FAILED') {
                        const errorMessage = result.error || 'Analysis failed';
                        setError(errorMessage);
                        setIsPolling(false);
                        reject(new Error(errorMessage));
                    } else if (result.status === 'PENDING' || result.status === 'PROCESSING' || result.status === 'RETRYING') {
                        // Continue polling
                        setTimeout(poll, POLLING_INTERVAL);
                    } else {
                        // Unknown status
                        setError(`Unexpected status: ${result.status}`);
                        setIsPolling(false);
                        reject(new Error(`Unexpected status: ${result.status}`));
                    }
                } catch (err: any) {
                    setError(err.response?.data?.message || 'Failed to check analysis status');
                    setIsPolling(false);
                    reject(err);
                }
            };

            // Start polling
            poll();
        });
    }, []);

    return {
        uploadFile,
        pollForResults,
        isUploading,
        isPolling,
        error,
        uploadResponse,
        analysisResult
    };
};