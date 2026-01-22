import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTickets, DbTicket } from "@/hooks/useDatabase";
import { useClientStore } from "@/store/clientStore";
import { Send, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

export default function TicketForm() {
    const currentClient = useClientStore((state) => state.currentClient);
    const { addTicket } = useTickets(currentClient?.id);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ticket, setTicket] = useState({
        subject: "",
        message: "",
        priority: "medium" as DbTicket['priority']
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentClient) return;

        setIsSubmitting(true);

        const result = await addTicket({
            client_id: currentClient.id,
            project_id: null,
            subject: ticket.subject,
            message: ticket.message,
            priority: ticket.priority,
            status: 'open',
        });

        setIsSubmitting(false);

        if (result) {
            setIsSubmitted(true);
            toast.success("Ticket raised successfully!");
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm">
                    <CardContent className="p-12 text-center space-y-6">
                        <div className="w-20 h-20 mx-auto bg-emerald-950/30 border border-emerald-900/50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-medium text-white">Ticket Submitted</h2>
                            <p className="text-neutral-500 max-w-md mx-auto">
                                Your support ticket has been created. Our team will respond within 24-48 hours.
                            </p>
                        </div>
                        <Button 
                            onClick={() => {
                                setIsSubmitted(false);
                                setTicket({ subject: "", message: "", priority: "medium" });
                            }}
                            variant="outline"
                            className="bg-transparent border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900"
                        >
                            Submit Another Ticket
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm">
                <CardHeader className="border-b border-neutral-900 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-sm">
                            <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">SUPPORT</span>
                    </div>
                    <CardTitle className="text-xl font-medium text-white">Raise Support Ticket</CardTitle>
                    <CardDescription className="text-neutral-500">
                        Report an issue or request assistance for your project.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-xs uppercase tracking-widest text-neutral-500">Subject *</Label>
                            <Input
                                id="subject"
                                value={ticket.subject}
                                onChange={e => setTicket({ ...ticket, subject: e.target.value })}
                                placeholder="e.g. Bug in login page"
                                className="bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-xs uppercase tracking-widest text-neutral-500">Issue Description *</Label>
                            <Textarea
                                id="message"
                                value={ticket.message}
                                onChange={e => setTicket({ ...ticket, message: e.target.value })}
                                placeholder="Please describe the issue in detail..."
                                className="min-h-[120px] bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm resize-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority" className="text-xs uppercase tracking-widest text-neutral-500">Priority</Label>
                            <Select
                                value={ticket.priority}
                                onValueChange={(v: DbTicket['priority']) => setTicket({ ...ticket, priority: v })}
                            >
                                <SelectTrigger className="bg-neutral-900/50 border-neutral-800 focus:border-white transition-colors rounded-sm h-11">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-white hover:bg-neutral-200 text-black font-bold h-12 rounded-sm tracking-wider uppercase text-xs"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        SUBMITTING...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Ticket
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
