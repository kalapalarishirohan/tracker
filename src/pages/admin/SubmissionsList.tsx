import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubmissions, useClients, DbSubmission } from "@/hooks/useDatabase";
import { 
    FileText, 
    Search, 
    Filter, 
    Eye, 
    Calendar, 
    Inbox, 
    RefreshCw,
    Loader2,
    MessageSquare,
    Star,
    CheckCircle2
} from "lucide-react";

export default function SubmissionsList() {
    const { submissions, loading, updateSubmissionStatus, fetchSubmissions } = useSubmissions();
    const { clients } = useClients();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubmission, setSelectedSubmission] = useState<DbSubmission | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    // --- Filter Logic ---
    const filteredSubmissions = submissions.filter(submission => {
        const client = clients.find(c => c.id === submission.client_id);
        const clientName = client?.name || "";
        const searchLower = searchQuery.toLowerCase();
        return (
            clientName.toLowerCase().includes(searchLower) ||
            submission.type.toLowerCase().includes(searchLower) ||
            submission.id.toLowerCase().includes(searchLower)
        );
    });

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'project_request': return 'Project Request';
            case 'feedback': return 'Feedback';
            case 'general': return 'General';
            default: return type;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'border-emerald-900 text-emerald-500 bg-emerald-950/10';
            case 'reviewed': return 'border-blue-900 text-blue-500 bg-blue-950/10';
            case 'archived': return 'border-neutral-800 text-neutral-500 bg-neutral-900';
            default: return 'border-neutral-800 text-neutral-500';
        }
    };

    const handleMarkReviewed = async (id: string) => {
        await updateSubmissionStatus(id, 'reviewed');
    };

    const handleArchive = async (id: string) => {
        await updateSubmissionStatus(id, 'archived');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-light tracking-tight text-white">
                        Client Submissions
                    </h1>
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
                        <Inbox className="w-3 h-3" />
                        <span>Project Requests & Feedback</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => fetchSubmissions()}
                        className="h-9 bg-transparent border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 text-xs font-mono uppercase tracking-wider"
                    >
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Sync
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Pending Review</span>
                            <div className="text-2xl font-medium text-white">
                                {submissions.filter(s => s.status === 'pending').length}
                            </div>
                        </div>
                        <div className="p-2 rounded-full border border-emerald-900/50 bg-emerald-950/20 text-emerald-500">
                            <Inbox className="w-4 h-4" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Project Requests</span>
                            <div className="text-2xl font-medium text-white">
                                {submissions.filter(s => s.type === 'project_request').length}
                            </div>
                        </div>
                        <div className="p-2 rounded-full border border-blue-900/50 bg-blue-950/20 text-blue-500">
                            <FileText className="w-4 h-4" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Feedback</span>
                            <div className="text-2xl font-medium text-white">
                                {submissions.filter(s => s.type === 'feedback').length}
                            </div>
                        </div>
                        <div className="p-2 rounded-full border border-amber-900/50 bg-amber-950/20 text-amber-500">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Controls / Filter Bar */}
            <div className="flex gap-3">
                <div className="relative flex-1 max-w-sm group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
                    <Input 
                        placeholder="SEARCH SUBMISSIONS..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#0A0A0A] border-neutral-800 rounded-sm text-xs font-mono placeholder:text-neutral-700 focus:ring-0 focus:border-white transition-colors h-10"
                    />
                </div>
                <Button variant="outline" className="h-10 w-10 p-0 border-neutral-800 bg-[#0A0A0A] text-neutral-500 hover:text-white">
                    <Filter className="w-4 h-4" />
                </Button>
            </div>

            {/* Main Data Table */}
            <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm overflow-hidden shadow-none">
                <CardHeader className="border-b border-neutral-900 py-3 px-6 bg-neutral-950/30">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-3 h-3" />
                            Submission Log
                        </CardTitle>
                        <span className="text-[10px] font-mono text-neutral-600">
                            DISPLAYING {filteredSubmissions.length} OF {submissions.length}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredSubmissions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-900 bg-neutral-900/20">
                                        <th className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">ID</th>
                                        <th className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">Type</th>
                                        <th className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">Client</th>
                                        <th className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">Submitted</th>
                                        <th className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">Status</th>
                                        <th className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubmissions.map((submission) => {
                                        const client = clients.find(c => c.id === submission.client_id);
                                        const clientName = client?.name || 'Unknown';
                                        return (
                                            <tr key={submission.id} className="border-b border-neutral-900 hover:bg-neutral-900/40 transition-colors group">
                                                <td className="px-6 py-4 font-mono text-xs text-white group-hover:text-emerald-400 transition-colors">
                                                    {submission.id.slice(0, 8).toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {submission.type === 'feedback' ? (
                                                            <MessageSquare className="w-4 h-4 text-amber-500" />
                                                        ) : (
                                                            <FileText className="w-4 h-4 text-blue-500" />
                                                        )}
                                                        <span className="text-sm text-neutral-200 font-medium">{getTypeLabel(submission.type)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-neutral-400">
                                                    {clientName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(submission.submitted_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className={`
                                                        rounded-sm text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border
                                                        ${getStatusStyle(submission.status)}
                                                    `}>
                                                        {submission.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                                                        {submission.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost" 
                                                            onClick={() => {
                                                                setSelectedSubmission(submission);
                                                                setIsViewDialogOpen(true);
                                                            }}
                                                            className="h-8 w-8 p-0 text-neutral-500 hover:text-white hover:bg-neutral-800"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        {submission.status === 'pending' && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="ghost" 
                                                                onClick={() => handleMarkReviewed(submission.id)}
                                                                className="h-8 w-8 p-0 text-neutral-500 hover:text-emerald-500 hover:bg-neutral-800"
                                                            >
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // Empty State
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-neutral-900/50 rounded-full flex items-center justify-center border border-neutral-800">
                                <Inbox className="w-8 h-8 text-neutral-700" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-white tracking-wide uppercase">No Submissions Found</h3>
                                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                                    There are no matching submissions in the current query.
                                </p>
                            </div>
                            {searchQuery && (
                                <Button 
                                    variant="link" 
                                    onClick={() => setSearchQuery("")}
                                    className="text-emerald-500 text-xs font-mono uppercase tracking-widest"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Submission Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="bg-[#0A0A0A] border-neutral-800 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium">
                            {selectedSubmission && getTypeLabel(selectedSubmission.type)} Details
                        </DialogTitle>
                    </DialogHeader>
                    {selectedSubmission && (
                        <div className="space-y-4 mt-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500">Client:</span>
                                <span className="text-white font-medium">
                                    {clients.find(c => c.id === selectedSubmission.client_id)?.name || 'Unknown'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500">Submitted:</span>
                                <span className="text-white font-mono">
                                    {new Date(selectedSubmission.submitted_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="border-t border-neutral-800 pt-4">
                                <h4 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Submission Data</h4>
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-sm p-4 space-y-3">
                                    {Object.entries(selectedSubmission.data).map(([key, value]) => (
                                        <div key={key} className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">{key.replace(/_/g, ' ')}</span>
                                            {key === 'rating' ? (
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star 
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= Number(value) ? 'text-amber-500 fill-amber-500' : 'text-neutral-700'}`}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-white">{String(value) || '-'}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                                {selectedSubmission.status === 'pending' && (
                                    <Button 
                                        onClick={() => {
                                            handleMarkReviewed(selectedSubmission.id);
                                            setIsViewDialogOpen(false);
                                        }}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Mark Reviewed
                                    </Button>
                                )}
                                {selectedSubmission.status !== 'archived' && (
                                    <Button 
                                        variant="outline"
                                        onClick={() => {
                                            handleArchive(selectedSubmission.id);
                                            setIsViewDialogOpen(false);
                                        }}
                                        className="flex-1 bg-transparent border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900"
                                    >
                                        Archive
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
