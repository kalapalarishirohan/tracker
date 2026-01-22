import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Users, 
    FolderGit2, 
    Ticket,
    Activity, 
    ArrowUpRight, 
    Plus, 
    Terminal, 
    BarChart3, 
    AlertCircle,
    FileText,
    Loader2,
    Mail,
    Rocket,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useClients, useProjects, useTickets, useSubmissions } from "@/hooks/useDatabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface SubmissionData {
    name?: string;
    email?: string;
    company?: string;
    projectName?: string;
    projectType?: string;
    budget?: string;
    timeline?: string;
    description?: string;
    subject?: string;
    message?: string;
}

export default function DashboardOverview() {
    const { clients, loading: clientsLoading } = useClients();
    const { projects, loading: projectsLoading } = useProjects();
    const { tickets, loading: ticketsLoading } = useTickets();
    const { submissions, loading: submissionsLoading, updateSubmissionStatus } = useSubmissions();
    
    const [selectedSubmission, setSelectedSubmission] = useState<{
        id: string;
        type: string;
        data: SubmissionData;
        submitted_at: string;
        status: string;
    } | null>(null);

    const isLoading = clientsLoading || projectsLoading || ticketsLoading || submissionsLoading;

    // Calculate real stats from database
    const openTicketCount = tickets.filter(t => t.status === 'open').length;
    const systemHealth = openTicketCount > 5 ? "WARNING" : "OPTIMAL";

    const totalClients = clients.length;
    const activeProjects = projects.filter(p => !p.is_completed).length;
    const completedProjects = projects.filter(p => p.is_completed).length;
    const totalProjects = projects.length || 1;
    const successRate = Math.round((completedProjects / totalProjects) * 100);
    const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
    
    // Filter submissions by type
    const projectRequests = submissions.filter(s => s.type === 'project_request');
    const contactInquiries = submissions.filter(s => s.type === 'contact');
    const pendingProjectRequests = projectRequests.filter(s => s.status === 'pending').length;
    const pendingContactInquiries = contactInquiries.filter(s => s.status === 'pending').length;

    const stats = [
        { 
            label: "Total Clients", 
            value: totalClients, 
            icon: Users, 
            trend: `${totalClients > 0 ? '+' : ''}${totalClients}`, 
            desc: "Active Database" 
        },
        { 
            label: "Active Projects", 
            value: activeProjects, 
            icon: FolderGit2, 
            trend: `${completedProjects} Done`, 
            desc: "In Development" 
        },
        { 
            label: "Open Tickets", 
            value: openTicketCount, 
            icon: Ticket, 
            trend: systemHealth === "WARNING" ? "High" : "Low", 
            desc: "Support Queue",
            alert: systemHealth === "WARNING"
        },
        { 
            label: "Success Rate", 
            value: `${successRate}%`, 
            icon: Activity, 
            trend: "All Time", 
            desc: "Completion Metric" 
        },
    ];

    const getProjectTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'web-app': 'Web Application',
            'mobile-app': 'Mobile App',
            'website': 'Website',
            'e-commerce': 'E-Commerce',
            'branding': 'Branding & Design',
            'other': 'Other'
        };
        return types[type] || type;
    };

    const handleMarkReviewed = async (id: string) => {
        await updateSubmissionStatus(id, 'reviewed');
        setSelectedSubmission(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            
            {/* Header / HUD */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white mb-2">
                        System Overview
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            LIVE MONITORING
                        </span>
                        <span>|</span>
                        <span>LAST UPDATED: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
                
                <div className="flex gap-2">
                     <div className="bg-neutral-900 border border-neutral-800 px-4 py-2 flex items-center gap-3 rounded-sm">
                        <Terminal className="w-4 h-4 text-neutral-400" />
                        <span className="text-xs font-mono text-neutral-300">
                            SYS_HEALTH: <span className={systemHealth === "OPTIMAL" ? "text-emerald-500" : "text-amber-500"}>{systemHealth}</span>
                        </span>
                     </div>
                </div>
            </div>

            {/* Stat Modules */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="bg-[#0A0A0A] border-neutral-800 rounded-sm hover:border-neutral-700 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.alert ? "text-amber-500" : "text-neutral-600 group-hover:text-white transition-colors"}`} />
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-medium text-white tracking-tight mb-1">{stat.value}</div>
                            <div className="flex justify-between items-end">
                                <p className="text-xs text-neutral-600 font-mono">{stat.desc}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border ${stat.alert ? "border-amber-900/50 text-amber-500 bg-amber-950/10" : "border-neutral-800 text-neutral-400 bg-neutral-900"}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* New Project Requests & Contact Inquiries Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Project Requests */}
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm shadow-none">
                    <CardHeader className="border-b border-neutral-900 py-4 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-blue-500" />
                            <CardTitle className="text-sm font-medium text-white uppercase tracking-wider">New Project Requests</CardTitle>
                            {pendingProjectRequests > 0 && (
                                <Badge className="bg-blue-950 text-blue-400 border-blue-900 text-[10px]">
                                    {pendingProjectRequests} Pending
                                </Badge>
                            )}
                        </div>
                        <Button variant="link" className="h-auto p-0 text-xs text-neutral-500 hover:text-white" asChild>
                            <Link to="/admin/dashboard/submissions">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-neutral-900 max-h-[300px] overflow-y-auto">
                            {projectRequests.length > 0 ? (
                                projectRequests.slice(0, 5).map((submission) => {
                                    const data = submission.data as SubmissionData;
                                    return (
                                        <div 
                                            key={submission.id} 
                                            className="flex items-center justify-between p-4 hover:bg-neutral-900/30 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedSubmission({
                                                id: submission.id,
                                                type: submission.type,
                                                data: data,
                                                submitted_at: submission.submitted_at,
                                                status: submission.status
                                            })}
                                        >
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${submission.status === 'pending' ? 'bg-blue-500 animate-pulse' : 'bg-neutral-600'}`} />
                                                    <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors truncate">
                                                        {data.projectName || 'Untitled Project'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 pl-3.5">
                                                    <p className="text-xs text-neutral-600 font-mono truncate">{data.name} • {data.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] px-2 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-sm hidden md:block">
                                                    {getProjectTypeLabel(data.projectType || '')}
                                                </span>
                                                <span className="text-[10px] text-neutral-500">
                                                    {new Date(submission.submitted_at).toLocaleDateString()}
                                                </span>
                                                <Eye className="w-4 h-4 text-neutral-700 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-neutral-600 text-sm">
                                    No project requests yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Inquiries */}
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm shadow-none">
                    <CardHeader className="border-b border-neutral-900 py-4 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-emerald-500" />
                            <CardTitle className="text-sm font-medium text-white uppercase tracking-wider">Contact Inquiries</CardTitle>
                            {pendingContactInquiries > 0 && (
                                <Badge className="bg-emerald-950 text-emerald-400 border-emerald-900 text-[10px]">
                                    {pendingContactInquiries} Pending
                                </Badge>
                            )}
                        </div>
                        <Button variant="link" className="h-auto p-0 text-xs text-neutral-500 hover:text-white" asChild>
                            <Link to="/admin/dashboard/submissions">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-neutral-900 max-h-[300px] overflow-y-auto">
                            {contactInquiries.length > 0 ? (
                                contactInquiries.slice(0, 5).map((submission) => {
                                    const data = submission.data as SubmissionData;
                                    return (
                                        <div 
                                            key={submission.id} 
                                            className="flex items-center justify-between p-4 hover:bg-neutral-900/30 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedSubmission({
                                                id: submission.id,
                                                type: submission.type,
                                                data: data,
                                                submitted_at: submission.submitted_at,
                                                status: submission.status
                                            })}
                                        >
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${submission.status === 'pending' ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-600'}`} />
                                                    <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors truncate">
                                                        {data.subject || 'General Inquiry'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 pl-3.5">
                                                    <p className="text-xs text-neutral-600 font-mono truncate">{data.name} • {data.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-neutral-500">
                                                    {new Date(submission.submitted_at).toLocaleDateString()}
                                                </span>
                                                <Eye className="w-4 h-4 text-neutral-700 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-neutral-600 text-sm">
                                    No contact inquiries yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                
                {/* Activity Feed / Recent Projects */}
                <Card className="lg:col-span-2 bg-[#0A0A0A] border-neutral-800 rounded-sm shadow-none">
                    <CardHeader className="border-b border-neutral-900 py-4 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-neutral-500" />
                            <CardTitle className="text-sm font-medium text-white uppercase tracking-wider">Active Operations</CardTitle>
                        </div>
                        <Button variant="link" className="h-auto p-0 text-xs text-neutral-500 hover:text-white" asChild>
                            <Link to="/admin/dashboard/projects">View All Logs</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-neutral-900">
                            {projects.length > 0 ? (
                                projects.slice(0, 5).map(project => {
                                    const clientName = clients.find(c => c.id === project.client_id)?.name || "Unknown";
                                    return (
                                        <div key={project.id} className="flex items-center justify-between p-4 hover:bg-neutral-900/30 transition-colors group">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${project.is_completed ? 'bg-neutral-600' : 'bg-blue-500 animate-pulse'}`} />
                                                    <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{project.title}</p>
                                                </div>
                                                <p className="text-xs text-neutral-600 font-mono pl-3.5">CLIENT: {clientName.toUpperCase()}</p>
                                            </div>
                                            
                                            <div className="flex items-center gap-6">
                                                <div className="hidden md:block w-24 h-1 bg-neutral-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-white transition-all duration-1000" style={{ width: `${project.total_progress}%` }} />
                                                </div>
                                                <div className="text-right min-w-[3rem]">
                                                    <span className="text-xs font-mono text-white block">{project.total_progress}%</span>
                                                </div>
                                                <ArrowUpRight className="w-4 h-4 text-neutral-700 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-neutral-600 text-sm">
                                    No active data streams found.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Control Panel / Quick Actions */}
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm shadow-none h-full">
                    <CardHeader className="border-b border-neutral-900 py-4">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-neutral-500" />
                            <CardTitle className="text-sm font-medium text-white uppercase tracking-wider">Control Panel</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <Link to="/admin/dashboard/clients" className="block">
                            <Button variant="outline" className="w-full justify-between h-12 bg-transparent border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 hover:border-neutral-600 transition-all group">
                                <span className="flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                                    Init New Client
                                </span>
                                <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest group-hover:text-neutral-400">CMD+N</span>
                            </Button>
                        </Link>
                        
                        <Link to="/admin/dashboard/projects" className="block">
                            <Button variant="outline" className="w-full justify-between h-12 bg-transparent border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 hover:border-neutral-600 transition-all group">
                                <span className="flex items-center gap-2">
                                    <FolderGit2 className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                                    New Project
                                </span>
                            </Button>
                        </Link>

                        <div className="h-px bg-neutral-900 my-2" />

                        <Link to="/admin/dashboard/submissions" className="block">
                            <Button variant="ghost" className="w-full justify-between h-10 px-0 text-neutral-500 hover:text-white hover:bg-transparent transition-colors group">
                                <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
                                    Pending Submissions
                                </span>
                                {pendingSubmissions > 0 && (
                                    <span className="text-xs font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded-sm border border-blue-900">
                                        {pendingSubmissions}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        <Link to="/admin/dashboard/tickets" className="block">
                            <Button variant="ghost" className="w-full justify-between h-10 px-0 text-neutral-500 hover:text-white hover:bg-transparent transition-colors group">
                                <span className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 group-hover:text-amber-500 transition-colors" />
                                    Open Tickets
                                </span>
                                {openTicketCount > 0 && (
                                    <span className="text-xs font-mono bg-amber-950 text-amber-400 px-2 py-0.5 rounded-sm border border-amber-900">
                                        {openTicketCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        
                        <div className="mt-8 p-4 bg-black border border-neutral-900 rounded-sm font-mono text-[10px] text-neutral-600 leading-relaxed overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-neutral-800" />
                            <p>{`> SYSTEM CHECK...`}</p>
                            <p>{`> CLIENTS: ${totalClients} REGISTERED`}</p>
                            <p>{`> PROJECTS: ${activeProjects} ACTIVE`}</p>
                            <p>{`> TICKETS: ${openTicketCount} PENDING`}</p>
                            <p>{`> STATUS: `}<span className={systemHealth === "OPTIMAL" ? "text-emerald-500" : "text-amber-500"}>{systemHealth}</span><span className="animate-pulse">_</span></p>
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* Submission Detail Dialog */}
            <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
                <DialogContent className="bg-neutral-950 border-neutral-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            {selectedSubmission?.type === 'project_request' ? (
                                <Rocket className="w-5 h-5 text-blue-500" />
                            ) : (
                                <Mail className="w-5 h-5 text-emerald-500" />
                            )}
                            {selectedSubmission?.type === 'project_request' ? 'Project Request Details' : 'Contact Inquiry Details'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    {selectedSubmission && (
                        <div className="space-y-6 mt-4">
                            {/* Status Badge */}
                            <div className="flex items-center justify-between">
                                <Badge className={
                                    selectedSubmission.status === 'pending' 
                                        ? 'bg-amber-950 text-amber-400 border-amber-900'
                                        : selectedSubmission.status === 'reviewed'
                                        ? 'bg-emerald-950 text-emerald-400 border-emerald-900'
                                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                                }>
                                    {selectedSubmission.status.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-neutral-500">
                                    Submitted: {new Date(selectedSubmission.submitted_at).toLocaleString()}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-sm p-4 space-y-3">
                                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Name</p>
                                        <p className="text-sm text-white">{selectedSubmission.data.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Email</p>
                                        <p className="text-sm text-white">{selectedSubmission.data.email || '-'}</p>
                                    </div>
                                    {selectedSubmission.data.company && (
                                        <div className="col-span-2">
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Company</p>
                                            <p className="text-sm text-white">{selectedSubmission.data.company}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Project Details (for project requests) */}
                            {selectedSubmission.type === 'project_request' && (
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-sm p-4 space-y-3">
                                    <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">Project Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Project Name</p>
                                            <p className="text-sm text-white font-medium">{selectedSubmission.data.projectName || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Type</p>
                                            <p className="text-sm text-white">{getProjectTypeLabel(selectedSubmission.data.projectType || '')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Budget</p>
                                            <p className="text-sm text-white">{selectedSubmission.data.budget || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Timeline</p>
                                            <p className="text-sm text-white">{selectedSubmission.data.timeline || '-'}</p>
                                        </div>
                                    </div>
                                    {selectedSubmission.data.description && (
                                        <div className="pt-3 border-t border-neutral-800">
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Description</p>
                                            <p className="text-sm text-neutral-300 leading-relaxed">{selectedSubmission.data.description}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Message (for contact inquiries) */}
                            {selectedSubmission.type === 'contact' && (
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-sm p-4 space-y-3">
                                    <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">Message</h3>
                                    {selectedSubmission.data.subject && (
                                        <div className="mb-3">
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Subject</p>
                                            <p className="text-sm text-white font-medium">{selectedSubmission.data.subject}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Message Content</p>
                                        <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{selectedSubmission.data.message || '-'}</p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            {selectedSubmission.status === 'pending' && (
                                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                                    <Button 
                                        variant="outline" 
                                        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                                        onClick={() => setSelectedSubmission(null)}
                                    >
                                        Close
                                    </Button>
                                    <Button 
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={() => handleMarkReviewed(selectedSubmission.id)}
                                    >
                                        Mark as Reviewed
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}