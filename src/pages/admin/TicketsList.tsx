import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTickets, useClients, DbTicket } from "@/hooks/useDatabase";
import { 
    Ticket as TicketIcon, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    Search, 
    Filter, 
    MoreHorizontal,
    MessageSquare,
    Reply,
    Loader2
} from "lucide-react";
import TicketResponseDialog from "./TicketResponseDialog";

export default function TicketsList() {
    const { tickets, loading, updateTicketStatus, respondToTicket } = useTickets();
    const { clients } = useClients();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTicket, setSelectedTicket] = useState<DbTicket | null>(null);
    const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);

    // --- Stats Calculation ---
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const criticalTickets = tickets.filter(t => (t.priority === 'high' || t.priority === 'urgent') && t.status !== 'resolved').length;
    const resolvedRate = tickets.length > 0 
        ? Math.round((tickets.filter(t => t.status === 'resolved').length / tickets.length) * 100) 
        : 100;

    // --- Filter Logic ---
    const filteredTickets = tickets.filter(ticket => {
        const client = clients.find(c => c.id === ticket.client_id);
        const clientName = client?.name || "";
        const searchLower = searchQuery.toLowerCase();
        return (
            ticket.subject.toLowerCase().includes(searchLower) ||
            clientName.toLowerCase().includes(searchLower) ||
            ticket.priority.toLowerCase().includes(searchLower)
        );
    });

    // --- Helper for Priority Styles ---
    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'urgent': return "border-red-900 text-red-500 bg-red-950/20";
            case 'high': return "border-orange-900 text-orange-500 bg-orange-950/20";
            case 'medium': return "border-amber-900 text-amber-500 bg-amber-950/20";
            case 'low': return "border-blue-900 text-blue-500 bg-blue-950/20";
            default: return "border-neutral-800 text-neutral-500";
        }
    };

    // --- Helper for Status Styles ---
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open': return "text-white bg-neutral-800 border-neutral-700";
            case 'in-progress': return "text-blue-400 bg-blue-950/30 border-blue-900";
            case 'resolved': return "text-emerald-500 bg-emerald-950/30 border-emerald-900";
            case 'closed': return "text-neutral-500 bg-neutral-900 border-neutral-800";
            default: return "text-neutral-500";
        }
    };

    const handleRespond = async (ticketId: string, response: string) => {
        await respondToTicket(ticketId, response);
        setIsResponseDialogOpen(false);
        setSelectedTicket(null);
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
            
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-light tracking-tight text-white">
                    Support Operations
                </h1>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
                    <MessageSquare className="w-3 h-3" />
                    <span>Ticket Queue Management</span>
                </div>
            </div>

            {/* Stats HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Active Issues</span>
                            <div className="text-2xl font-medium text-white">{openTickets}</div>
                        </div>
                        <div className={`p-2 rounded-full border ${openTickets > 0 ? "border-blue-900/50 bg-blue-950/20 text-blue-500" : "border-neutral-800 bg-neutral-900 text-neutral-600"}`}>
                            <TicketIcon className="w-4 h-4" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Critical Attention</span>
                            <div className="text-2xl font-medium text-white">{criticalTickets}</div>
                        </div>
                        <div className={`p-2 rounded-full border ${criticalTickets > 0 ? "border-red-900/50 bg-red-950/20 text-red-500" : "border-neutral-800 bg-neutral-900 text-neutral-600"}`}>
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Resolution Rate</span>
                            <div className="text-2xl font-medium text-white">{resolvedRate}%</div>
                        </div>
                        <div className="p-2 rounded-full border border-emerald-900/50 bg-emerald-950/20 text-emerald-500">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="space-y-4">
                
                {/* Toolbar */}
                <div className="flex gap-3">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
                        <Input 
                            placeholder="SEARCH TICKETS..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[#0A0A0A] border-neutral-800 rounded-sm text-xs font-mono placeholder:text-neutral-700 focus:ring-0 focus:border-white transition-colors h-10"
                        />
                    </div>
                    <Button variant="outline" className="h-10 w-10 p-0 border-neutral-800 bg-[#0A0A0A] text-neutral-500 hover:text-white">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>

                {/* Data Grid */}
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm overflow-hidden shadow-none">
                    <CardHeader className="border-b border-neutral-900 py-3 px-6 bg-neutral-950/30">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                <TicketIcon className="w-3 h-3" />
                                Incident Log
                            </CardTitle>
                            <span className="text-[10px] font-mono text-neutral-600">
                                {filteredTickets.length} RECORDS
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredTickets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-neutral-900/50 rounded-full flex items-center justify-center border border-neutral-800">
                                    <CheckCircle2 className="w-8 h-8 text-neutral-700" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-white tracking-wide uppercase">All Clear</h3>
                                    <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                                        No active tickets found matching your query.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-neutral-900/50">
                                        <TableRow className="border-neutral-900 hover:bg-transparent">
                                            <TableHead className="w-[180px] h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">State</TableHead>
                                            <TableHead className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">Details</TableHead>
                                            <TableHead className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">Client</TableHead>
                                            <TableHead className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">Priority</TableHead>
                                            <TableHead className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal">Created</TableHead>
                                            <TableHead className="h-10 px-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-normal text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTickets.map(ticket => {
                                            const client = clients.find(c => c.id === ticket.client_id);
                                            const clientName = client?.name || 'Unknown';
                                            return (
                                                <TableRow key={ticket.id} className="border-b border-neutral-900 hover:bg-neutral-900/40 transition-colors group">
                                                    
                                                    {/* Status Selector */}
                                                    <TableCell className="px-6 py-4">
                                                        <Select
                                                            defaultValue={ticket.status}
                                                            onValueChange={(v) => updateTicketStatus(ticket.id, v as DbTicket['status'])}
                                                        >
                                                            <SelectTrigger className={`w-[130px] h-8 text-[10px] uppercase font-bold tracking-wider rounded-sm border transition-all ${getStatusStyle(ticket.status)}`}>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                                <SelectItem value="open" className="text-xs focus:bg-neutral-800 focus:text-white">OPEN</SelectItem>
                                                                <SelectItem value="in-progress" className="text-xs focus:bg-neutral-800 focus:text-white">IN PROGRESS</SelectItem>
                                                                <SelectItem value="resolved" className="text-xs focus:bg-neutral-800 focus:text-white">RESOLVED</SelectItem>
                                                                <SelectItem value="closed" className="text-xs focus:bg-neutral-800 focus:text-white">CLOSED</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>

                                                    {/* Subject */}
                                                    <TableCell className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{ticket.subject}</span>
                                                            <span className="text-[10px] text-neutral-600 font-mono">ID: {ticket.id.slice(0, 8).toUpperCase()}</span>
                                                        </div>
                                                    </TableCell>

                                                    {/* Client */}
                                                    <TableCell className="px-6 py-4 text-sm text-neutral-400">
                                                        {clientName}
                                                    </TableCell>

                                                    {/* Priority Badge */}
                                                    <TableCell className="px-6 py-4">
                                                        <Badge variant="outline" className={`rounded-sm text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border ${getPriorityStyle(ticket.priority)}`}>
                                                            {(ticket.priority === 'high' || ticket.priority === 'urgent') && <AlertCircle className="w-3 h-3 mr-1" />}
                                                            {ticket.priority}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Date */}
                                                    <TableCell className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(ticket.created_at).toLocaleDateString()}
                                                        </div>
                                                    </TableCell>

                                                    {/* Actions */}
                                                    <TableCell className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="ghost" 
                                                                    onClick={() => {
                                                                        setSelectedTicket(ticket);
                                                                        setIsResponseDialogOpen(true);
                                                                    }}
                                                                    className="h-8 w-8 p-0 text-neutral-500 hover:text-white hover:bg-neutral-800"
                                                                >
                                                                    <Reply className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-neutral-500 hover:text-white hover:bg-neutral-800">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            {/* Response Dialog */}
            {selectedTicket && (
                <TicketResponseDialog
                    ticket={selectedTicket}
                    clientName={clients.find(c => c.id === selectedTicket.client_id)?.name || 'Unknown'}
                    isOpen={isResponseDialogOpen}
                    onClose={() => {
                        setIsResponseDialogOpen(false);
                        setSelectedTicket(null);
                    }}
                    onRespond={handleRespond}
                />
            )}
        </div>
    );
}
