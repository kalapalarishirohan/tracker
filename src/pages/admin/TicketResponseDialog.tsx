import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MessageSquare, Send, Clock, User, AlertCircle, Loader2 } from "lucide-react";
import type { DbTicket } from "@/hooks/useDatabase";
import { Badge } from "@/components/ui/badge";

interface TicketResponseDialogProps {
    ticket: DbTicket;
    clientName: string;
    isOpen: boolean;
    onClose: () => void;
    onRespond: (ticketId: string, response: string) => Promise<void>;
}

export default function TicketResponseDialog({ ticket, clientName, isOpen, onClose, onRespond }: TicketResponseDialogProps) {
    const [response, setResponse] = useState(ticket.response || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!response.trim()) {
            toast.error("Response required", { description: "Please enter a response before submitting." });
            return;
        }

        setIsSubmitting(true);
        await onRespond(ticket.id, response.trim());
        toast.success("Response sent", { description: "Ticket has been marked as resolved." });
        setIsSubmitting(false);
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'urgent': return "border-red-900 text-red-500 bg-red-950/20";
            case 'high': return "border-orange-900 text-orange-500 bg-orange-950/20";
            case 'medium': return "border-amber-900 text-amber-500 bg-amber-950/20";
            case 'low': return "border-blue-900 text-blue-500 bg-blue-950/20";
            default: return "border-neutral-800 text-neutral-500";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#050505] border-neutral-800 text-white sm:max-w-[600px] p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-neutral-900 bg-neutral-950/50">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-neutral-900 rounded border border-neutral-800">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase">TICKET RESPONSE</span>
                    </div>
                    <DialogTitle className="text-xl font-medium tracking-tight">{ticket.subject}</DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Ticket Meta */}
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-neutral-400">
                            <User className="w-4 h-4" />
                            <span>{clientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                        <Badge variant="outline" className={`rounded-sm text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border ${getPriorityStyle(ticket.priority)}`}>
                            {(ticket.priority === 'high' || ticket.priority === 'urgent') && <AlertCircle className="w-3 h-3 mr-1" />}
                            {ticket.priority}
                        </Badge>
                    </div>

                    {/* Original Message */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Issue Description</Label>
                        <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-sm">
                            <p className="text-sm text-neutral-300 whitespace-pre-wrap">{ticket.message}</p>
                        </div>
                    </div>

                    {/* Response Area */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Your Response</Label>
                        <Textarea
                            value={response}
                            onChange={e => setResponse(e.target.value)}
                            placeholder="Write your response to this ticket..."
                            className="min-h-[120px] bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 gap-3">
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="bg-transparent border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                        className="bg-white hover:bg-neutral-200 text-black font-bold tracking-wider rounded-sm px-6"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Response
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
