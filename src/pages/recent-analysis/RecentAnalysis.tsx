import { getAnalysisHistory } from '@/api/apiRequests';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Filter, Search, SortDesc } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AnalysisCard } from './AnalysisCard';

// New format types matching the API response
export interface NewQuickResults {
    duration_seconds: number;
    average_wpm: number;
    total_pauses: number;
    energy_score: number;
    intonation_score: number;
    speech_rate_score: number;
    pitch_variation: number;
    average_energy: number;
    pause_score: number;
    intonation_chart_url: string | null;
    overall_score: number;
    speech_rate_chart_url: string | null;
    transcription_preview?: string;
    overall_feedback?: string | null;
    ai_analysis_available?: boolean;
    energy_chart_url?: string | null;
}

export interface NewAnalysisHistoryItem {
    duration_seconds: number;
    completed_at: string;
    file_name: string;
    quick_results: NewQuickResults;
    request_id: string;
    status: string;
    requested_at: string;
}

export interface NewAnalysisHistory {
    total: number;
    size: number;
    history: NewAnalysisHistoryItem[];
    page: number;
    has_more: boolean;
}

const RecentAnalysisList: React.FC = () => {
    const [analysisList, setAnalysisList] = useState<NewAnalysisHistoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [filterScore, setFilterScore] = useState("all");
    // const [loading, setLoading] = useState(false);
    const [page] = useState(0);  // Only using first page for now
    // const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const loadAnalysisHistory = async () => {
            try {
                // setLoading(true);
                const res = await getAnalysisHistory(page, 20);
                // Use new format directly
                const newFormatData = res.data as NewAnalysisHistory;

                if (page === 0) {
                    setAnalysisList(newFormatData.history);
                } else {
                    setAnalysisList(prev => [...prev, ...newFormatData.history]);
                }

                // setHasMore(newFormatData.has_more);
            } catch (e) {
                console.log('Error loading analysis history:', e);
            } finally {
                // setLoading(false);
            }
        }

        loadAnalysisHistory();
    }, [page]);    // Filter and sort the analysis list
    const filteredAnalysisList = analysisList
        .filter(analysis => {
            // Search filter - search in file name and transcription preview
            const searchContent = (analysis.file_name + ' ' + (analysis.quick_results?.transcription_preview || '')).toLowerCase();
            const matchesSearch = searchContent.includes(searchTerm.toLowerCase());

            // Score filter
            let matchesScoreFilter = true;
            if (filterScore !== "all") {
                const score = analysis.quick_results?.overall_score || 0;
                switch (filterScore) {
                    case "excellent":
                        matchesScoreFilter = score >= 80;
                        break;
                    case "good":
                        matchesScoreFilter = score >= 60 && score < 80;
                        break;
                    case "average":
                        matchesScoreFilter = score >= 40 && score < 60;
                        break;
                    case "poor":
                        matchesScoreFilter = score < 40;
                        break;
                }
            }

            return matchesSearch && matchesScoreFilter;
        })
        .sort((a, b) => {
            // Sort options
            switch (sortBy) {
                case "date":
                    return new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime();
                case "score":
                    return (b.quick_results?.overall_score || 0) - (a.quick_results?.overall_score || 0);
                case "transcript":
                    return a.file_name.localeCompare(b.file_name);
                default:
                    return 0;
            }
        });

    return (
        <div className="w-full max-w-6xl mx-auto my-4 px-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Recent Analysis</h1>
                <p className="text-gray-500">
                    Review your past speech analysis results and track your progress over time
                </p>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search by transcript..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Select value={filterScore} onValueChange={setFilterScore}>
                        <SelectTrigger className="w-40">
                            <div className="flex items-center">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by score" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Scores</SelectItem>
                            <SelectItem value="excellent">Excellent (80%+)</SelectItem>
                            <SelectItem value="good">Good (60-79%)</SelectItem>
                            <SelectItem value="average">Average (40-59%)</SelectItem>
                            <SelectItem value="poor">Needs Work (0-39%)</SelectItem>
                        </SelectContent>
                    </Select>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center">
                                <SortDesc className="h-4 w-4 mr-2" />
                                Sort
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSortBy("date")}>
                                Latest First
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("score")}>
                                Highest Score
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("transcript")}>
                                Alphabetical
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Analysis Cards */}
            <div className="space-y-4">
                {filteredAnalysisList.length > 0 ? (
                    filteredAnalysisList.map((analysis, index) => (
                        <AnalysisCard key={index} analysis={analysis} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No analysis records found with the current filters.</p>
                        {searchTerm && <p className="text-gray-500 mt-2">Try adjusting your search terms or filters.</p>}
                    </div>
                )}
            </div>

            {filteredAnalysisList.length > 0 && (
                <div className="mt-4 text-center text-gray-500">
                    Showing {filteredAnalysisList.length} of {analysisList.length} analysis records
                </div>
            )}
        </div>
    );
};

export default RecentAnalysisList;