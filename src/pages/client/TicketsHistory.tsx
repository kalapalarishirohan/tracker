import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Clock, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useTickets } from "@/hooks/useDatabase";
import { useClientStore } from "@/store/clientStore";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const statusConfig = {
  open: { label: "Open", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: AlertCircle },
  "in-progress": { label: "In Progress", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", icon: Clock },
  resolved: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
  closed: { label: "Closed", color: "bg-neutral-500/10 text-neutral-400 border-neutral-500/30", icon: CheckCircle2 },
};

const priorityConfig = {
  low: { label: "Low", color: "text-neutral-400" },
  medium: { label: "Medium", color: "text-blue-400" },
  high: { label: "High", color: "text-orange-400" },
  urgent: { label: "Urgent", color: "text-red-400" },
};

export default function TicketsHistory() {
  const currentClient = useClientStore((state) => state.currentClient);
  const { tickets, loading } = useTickets(currentClient?.id);

  if (!currentClient) return <div className="text-white font-mono p-8">Initializing System...</div>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800 pb-8">
        <div className="space-y-2">
          <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Support History
          </span>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
            Your Tickets
          </h1>
          <p className="text-neutral-500 text-sm">Track the progress of your support requests</p>
        </div>
        <Link to="/client/portal/tickets">
          <Button className="bg-white hover:bg-neutral-200 text-black font-medium">
            <MessageSquare className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <Card className="bg-neutral-900/20 border-neutral-800 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="text-lg font-medium text-white">No Tickets Yet</h3>
            <p className="text-neutral-500 mt-2 mb-6">You haven't submitted any support tickets.</p>
            <Link to="/client/portal/tickets">
              <Button className="bg-white text-black hover:bg-neutral-200">
                Create Your First Ticket
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const status = statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.open;
            const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig] || priorityConfig.medium;
            const StatusIcon = status.icon;

            return (
              <Card key={ticket.id} className="bg-[#0A0A0A] border-neutral-800 hover:border-neutral-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left: Ticket Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${status.color} border`}>
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white">{ticket.subject}</h3>
                          <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{ticket.message}</p>
                        </div>
                      </div>

                      {/* Response Section */}
                      {ticket.response && (
                        <div className="mt-4 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            </div>
                            <span className="text-xs font-mono text-emerald-500 uppercase tracking-wider">Admin Response</span>
                          </div>
                          <p className="text-sm text-neutral-300">{ticket.response}</p>
                        </div>
                      )}
                    </div>

                    {/* Right: Meta Info */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 text-right">
                      <Badge variant="outline" className={`${status.color} border uppercase text-[10px] tracking-widest`}>
                        {status.label}
                      </Badge>
                      <span className={`text-xs font-mono ${priority.color}`}>
                        {priority.label} Priority
                      </span>
                      <span className="text-xs text-neutral-600 font-mono">
                        {format(new Date(ticket.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}