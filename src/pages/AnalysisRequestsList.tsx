import { deleteRequest, getAnalysisHistory } from '@/api/apiRequests';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle, ChevronDown, Clock, Eye, Pause, Play, RefreshCw, RotateCw, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AnalysisHistoryItem, AnalysisHistory } from '@/types/analysis';

// Legacy type for backward compatibility - now mapped from new types
interface AnalysisRequest {
  id: string;
  file_url: string;
  status: "pending" | "processing" | "complete" | "failed";
  expected_time: string;
}

const AnalysisRequestsList = () => {
  const [requests, setRequests] = useState<AnalysisRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [deletingRequestIds, setDeletingRequestIds] = useState<string[]>([]);

  // New pagination state
  const [page] = useState(0);  // Only using first page for now
  // const [hasMore, setHasMore] = useState(true);
  // const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchRequests();

    // Create audio element
    const audio = new Audio();
    setAudioElement(audio);

    // Cleanup on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [page]);

  // Helper function to map new status types to legacy ones
  const mapStatusToLegacy = (status: string): "pending" | "processing" | "complete" | "failed" => {
    switch (status) {
      case 'PENDING':
      case 'RETRYING':
        return 'pending';
      case 'PROCESSING':
        return 'processing';
      case 'COMPLETED':
        return 'complete';
      case 'FAILED':
      default:
        return 'failed';
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getAnalysisHistory(page, 20);
      const historyData: AnalysisHistory = response.data;

      // Map new API response to legacy format
      const mappedRequests: AnalysisRequest[] = historyData.history.map((item: AnalysisHistoryItem) => ({
        id: item.request_id,
        file_url: "", // Will need to fetch this separately if needed
        status: mapStatusToLegacy(item.status),
        expected_time: item.requested_at,
        created_at: item.requested_at,
        duration: Math.round(item.duration_seconds || 0),
        file_name: item.file_name,
        quick_results: item.quick_results
      } as any)); // Use 'as any' to bypass type checking since we're extending the interface

      setRequests(mappedRequests);
      // setHasMore(historyData.has_more);
      // setTotalItems(historyData.total);
      setError(null);
    } catch (err) {
      setError(`Failed to load request data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <Clock size={14} /> Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <RotateCw size={14} className="animate-spin" /> Processing
          </Badge>
        );
      case "complete":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle size={14} /> Complete
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <AlertCircle size={14} /> Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">Unknown</Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const timeRemaining = formatDistanceToNow(date, { addSuffix: true });
      return timeRemaining;
    } catch (err) {
      return "Invalid date";
    }
  };

  const handleViewAnalysis = (requestId: string) => {
    // Navigate to analysis view or open modal
    window.location.href = `/analysis/${requestId}`;
  };

  const handlePlayAudio = (fileUrl: string, requestId: string) => {
    if (!audioElement) return;

    // If the same audio is currently playing, pause it
    if (currentlyPlaying === requestId) {
      audioElement.pause();
      setCurrentlyPlaying(null);
      return;
    }

    // If a different audio is playing, pause it first
    if (currentlyPlaying) {
      audioElement.pause();
    }

    // Set the new audio source and play
    audioElement.src = fileUrl;
    audioElement.play().catch(error => {
      console.error("Error playing audio:", error);
    });

    setCurrentlyPlaying(requestId);

    // Add event listener for when audio finishes playing
    audioElement.onended = () => {
      setCurrentlyPlaying(null);
    };
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      // Show loading state
      setDeletingRequestIds(prev => [...prev, requestId]);

      // Call API to delete request
      await deleteRequest(requestId);

      // Update local state
      setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));

      // If the audio for this request is playing, stop it
      if (currentlyPlaying === requestId && audioElement) {
        audioElement.pause();
        setCurrentlyPlaying(null);
      }

      // Show success toast
      toast.success(`Request ${requestId.substring(0, 8)}... was successfully deleted.`)
    } catch (err) {
      // Show error toast
      toast.error(`Failed to delete request: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      // Remove from loading state
      setDeletingRequestIds(prev => prev.filter(id => id !== requestId));
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.id.includes(searchTerm);
    const matchesStatus = statusFilter ? request.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    fetchRequests();
  };

  if (loading && requests.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analysis Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && requests.length === 0) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertCircle size={18} />
            Error Loading Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleRefresh}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Analysis Requests</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 gap-1"
          >
            <RefreshCw size={14} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by ID"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1 min-w-32 justify-between">
                {statusFilter ? (
                  <span className="capitalize">{statusFilter}</span>
                ) : (
                  <span>All Statuses</span>
                )}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("processing")}>
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("complete")}>
                Complete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("failed")}>
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Status</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead className="hidden md:table-cell">Expected Time</TableHead>
                <TableHead className="w-24">Audio</TableHead>
                <TableHead className="w-48 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {request.id}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(request.expected_time)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePlayAudio(request.file_url, request.id)}
                        title="Play audio"
                      >
                        {currentlyPlaying === request.id ? (
                          <Pause size={14} className="m-auto" />
                        ) : (
                          <Play size={14} className="m-auto" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {request.status === "complete" ? (
                          <Button
                            size="sm"
                            className="h-8 gap-1"
                            onClick={() => handleViewAnalysis(request.id)}
                          >
                            <Eye size={14} />
                            View
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            disabled
                          >
                            Waiting
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 gap-1"
                          onClick={() => handleDeleteRequest(request.id)}
                          title="Delete request"
                          disabled={deletingRequestIds.includes(request.id)}
                        >
                          {deletingRequestIds.includes(request.id) ? (
                            <RotateCw size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisRequestsList;