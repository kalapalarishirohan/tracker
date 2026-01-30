import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Circle, Clock, FileText, ArrowUpRight, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useDatabase";
import { useClientStore } from "@/store/clientStore";
import { Link } from "react-router-dom";

export default function ClientDashboard() {
    const currentClient = useClientStore((state) => state.currentClient);
    const { projects, loading } = useProjects(currentClient?.id);

    if (!currentClient) return <div className="text-white font-mono p-8">Initializing System...</div>;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 font-sans">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800/50 pb-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-blue-900/30 text-blue-500 mb-2 font-normal">
                        Client Dashboard
                    </Badge>
                    <h1 className="text-4xl font-normal tracking-tight text-white">
                        Welcome back, {currentClient.name}
                    </h1>
                    <p className="text-neutral-400">
                        Here's what's happening with your projects today.
                    </p>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="border border-neutral-800 bg-[#0A0A0A] p-12 text-center rounded-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-neutral-500" />
                        </div>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No Active Projects</h3>
                    <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                        There are no active projects linked to your account at this time.
                    </p>
                </div>
            ) : (
                <Tabs defaultValue={projects[0].id} className="w-full space-y-8">

                    {/* Project Selector */}
                    {projects.length > 1 && (
                        <div className="flex items-center gap-4 overflow-x-auto pb-2">
                            {projects.map(p => (
                                <TabsTrigger
                                    key={p.id}
                                    value={p.id}
                                    className="rounded-full border border-neutral-800 px-6 py-2.5 text-sm data-[state=active]:border-blue-500 data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-500 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
                                >
                                    {p.title}
                                </TabsTrigger>
                            ))}
                        </div>
                    )}

                    {projects.map((project) => (
                        <TabsContent key={project.id} value={project.id} className="space-y-8 focus-visible:ring-0">

                            {/* Main Progress Card */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                                        <div className="w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-12">
                                            <div className="space-y-2">
                                                <Badge className={project.is_completed ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"}>
                                                    {project.is_completed ? "Completed" : "In Progress"}
                                                </Badge>
                                                <h2 className="text-3xl font-normal text-white tracking-tight">{project.title}</h2>
                                                <p className="text-neutral-400 text-sm max-w-lg leading-relaxed">{project.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-6xl font-medium text-white tracking-tighter block">
                                                    {project.total_progress}%
                                                </span>
                                                <span className="text-sm text-neutral-500">Completion</span>
                                            </div>
                                        </div>

                                        {/* Smooth Progress Bar */}
                                        <div className="space-y-4">
                                            <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                                    style={{ width: `${project.total_progress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-neutral-500 font-medium uppercase tracking-wide">
                                                <span>Kickoff</span>
                                                <span>Launch</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Meta Details */}
                                <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-8 flex flex-col justify-center space-y-8">
                                    <div className="space-y-1">
                                        <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Start Date</span>
                                        <div className="flex items-center gap-2 text-white text-lg">
                                            <Calendar className="w-5 h-5 text-blue-500" />
                                            <span>{new Date(project.start_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Deadline</span>
                                        <div className="flex items-center gap-2 text-white text-lg">
                                            <Clock className="w-5 h-5 text-blue-500" />
                                            <span>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Lead</span>
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-medium text-neutral-300">
                                                {project.project_lead ? project.project_lead.charAt(0) : 'A'}
                                            </div>
                                            <span>{project.project_lead || 'Admin Team'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* LEFT: Timeline Section */}
                                <div className="lg:col-span-2 bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-8">
                                    <h3 className="text-lg font-medium text-white mb-8">Project Timeline</h3>

                                    <div className="relative space-y-0 pl-4">
                                        {/* Connector Line */}
                                        <div className="absolute left-[27px] top-4 bottom-8 w-[2px] bg-neutral-900" />

                                        {project.stages.map((stage) => {
                                            const isCompleted = stage.status === 'completed';
                                            const isActive = stage.status === 'in-progress';

                                            return (
                                                <div key={stage.name} className="relative pl-12 pb-10 last:pb-0 group">
                                                    {/* Dot */}
                                                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 z-10 transition-all duration-300
                                                        ${isCompleted ? 'border-emerald-500 bg-[#0A0A0A]' :
                                                            isActive ? 'border-blue-500 bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.2)]' :
                                                                'border-neutral-800 bg-[#0A0A0A]'}`}>
                                                    </div>

                                                    <div className={`flex flex-col transition-opacity duration-300 ${!isCompleted && !isActive ? 'opacity-40' : 'opacity-100'}`}>
                                                        <div className="flex justify-between items-center pr-4">
                                                            <h4 className="text-base font-medium text-white">{stage.name}</h4>
                                                            {stage.completion_percentage > 0 && (
                                                                <Badge variant="secondary" className="text-xs font-normal bg-neutral-900 text-neutral-300 hover:bg-neutral-800">
                                                                    {stage.completion_percentage}%
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-neutral-500 mt-1 capitalize">
                                                            {stage.status.replace('-', ' ')}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* RIGHT: Actions / Quick Links */}
                                <div className="space-y-6">
                                    <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-6">
                                        <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
                                        <div className="space-y-3">
                                            <Link to="/client/portal/project-request" className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-neutral-900 transition-colors group border border-transparent hover:border-neutral-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-neutral-900 text-neutral-400 group-hover:text-blue-500 transition-colors">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-sm font-medium text-neutral-300 group-hover:text-white">New Request</span>
                                                </div>
                                            </Link>
                                            <Link to="/client/portal/tickets" className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-neutral-900 transition-colors group border border-transparent hover:border-neutral-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-neutral-900 text-neutral-400 group-hover:text-blue-500 transition-colors">
                                                        <AlertCircle className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Report Issue</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-900/30 p-6 rounded-2xl">
                                        <h4 className="text-blue-400 font-medium mb-2 text-sm">System Notice</h4>
                                        <p className="text-sm text-blue-300/70 leading-relaxed">
                                            Timelines are estimates. Please allow 24-48 hours for new submissions to reflect in the dashboard.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    );
}
