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
        <div className="space-y-10 animate-in fade-in duration-700">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800 pb-8">
                <div className="space-y-2">
                    <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Client Dashboard
                    </span>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
                        Hello, {currentClient.name}
                    </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-500 font-mono">
                    <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {projects.length === 0 ? (
                <Card className="bg-neutral-900/20 border-neutral-800 border-dashed">
                    <CardContent className="p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="w-10 h-10 text-neutral-600" />
                        </div>
                        <h3 className="text-lg font-medium text-white">No Active Projects</h3>
                        <p className="text-neutral-500 mt-2">There are no projects currently linked to this ID.</p>
                    </CardContent>
                </Card>
            ) : (
                <Tabs defaultValue={projects[0].id} className="w-full space-y-8">
                    
                    {/* Project Selector (Only visible if >1 project) */}
                    {projects.length > 1 && (
                        <TabsList className="bg-transparent p-0 border-b border-neutral-800 w-full justify-start h-auto rounded-none">
                            {projects.map(p => (
                                <TabsTrigger 
                                    key={p.id} 
                                    value={p.id}
                                    className="rounded-none border-b-2 border-transparent px-6 py-3 font-mono text-sm data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-neutral-500 hover:text-neutral-300 transition-colors"
                                >
                                    {p.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    )}

                    {projects.map((project) => (
                        <TabsContent key={project.id} value={project.id} className="space-y-8 focus-visible:ring-0">
                            
                            {/* Main Progress Hero Card */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <Card className="lg:col-span-2 bg-[#0A0A0A] border-neutral-800 shadow-none rounded-sm">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle className="text-2xl font-light text-white">{project.title}</CardTitle>
                                                <p className="text-neutral-500 text-sm leading-relaxed max-w-md">{project.description}</p>
                                            </div>
                                            <Badge variant="outline" className={`border-neutral-700 uppercase tracking-widest text-[10px] px-3 py-1 ${project.is_completed ? "text-emerald-500 bg-emerald-500/10" : "text-blue-400 bg-blue-400/10"}`}>
                                                {project.is_completed ? "Completed" : "Active Project"}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-10 pb-8">
                                        <div className="space-y-2">
                                            <div className="flex items-end justify-between">
                                                <span className="text-sm font-mono text-neutral-500 uppercase tracking-wider">Overall Completion</span>
                                                <span className="text-6xl font-medium text-white tracking-tighter">
                                                    {project.total_progress}%
                                                </span>
                                            </div>
                                            {/* Custom Thin Progress Bar */}
                                            <div className="h-1 w-full bg-neutral-900 mt-4 relative overflow-hidden">
                                                <div 
                                                    className="absolute top-0 left-0 h-full bg-white transition-all duration-1000 ease-out" 
                                                    style={{ width: `${project.total_progress}%` }} 
                                                />
                                                {/* Animated Glow Effect */}
                                                <div 
                                                    className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" 
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Project Meta Details */}
                                <Card className="bg-[#0A0A0A] border-neutral-800 shadow-none rounded-sm flex flex-col justify-center">
                                    <CardContent className="p-6 space-y-6">
                                        <div className="space-y-1 pb-4 border-b border-neutral-900">
                                            <span className="text-xs uppercase tracking-widest text-neutral-600 block mb-1">Start Date</span>
                                            <div className="flex items-center gap-2 text-white font-mono">
                                                <Calendar className="w-4 h-4 text-neutral-500" />
                                                {new Date(project.start_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="space-y-1 pb-4 border-b border-neutral-900">
                                            <span className="text-xs uppercase tracking-widest text-neutral-600 block mb-1">Target Deadline</span>
                                            <div className="flex items-center gap-2 text-white font-mono">
                                                <Clock className="w-4 h-4 text-neutral-500" />
                                                <span>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs uppercase tracking-widest text-neutral-600 block mb-1">Project Lead</span>
                                            <div className="flex items-center gap-2 text-white">
                                                <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[10px]">AD</div>
                                                <span>{project.project_lead || 'Admin Team'}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* LEFT: Timeline Section */}
                                <Card className="lg:col-span-2 bg-[#0A0A0A] border-neutral-800 shadow-none rounded-sm">
                                    <CardHeader className="border-b border-neutral-900/50">
                                        <CardTitle className="text-lg font-medium text-white">Process Log</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-8 pl-2">
                                        <div className="relative space-y-0">
                                            {/* Vertical Connector Line */}
                                            <div className="absolute left-[19px] top-2 bottom-6 w-[1px] bg-neutral-800" />

                                            {project.stages.map((stage) => {
                                                const isCompleted = stage.status === 'completed';
                                                const isActive = stage.status === 'in-progress';

                                                return (
                                                    <div key={stage.name} className="relative pl-12 pb-8 last:pb-0 group">
                                                        {/* Icon Marker */}
                                                        <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border bg-[#0A0A0A] flex items-center justify-center z-10 transition-colors duration-300
                                                            ${isCompleted ? 'border-emerald-500/50 text-emerald-500' : 
                                                              isActive ? 'border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 
                                                              'border-neutral-800 text-neutral-700'}`}>
                                                            {isCompleted ? <Check className="w-4 h-4" /> : 
                                                             isActive ? <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" /> : 
                                                             <Circle className="w-3 h-3" />}
                                                        </div>

                                                        <div className={`flex flex-col pt-1 transition-opacity duration-300 ${!isCompleted && !isActive ? 'opacity-50' : 'opacity-100'}`}>
                                                            <div className="flex justify-between items-start pr-4">
                                                                <h3 className="text-base font-medium text-white">{stage.name}</h3>
                                                                {stage.completion_percentage > 0 && (
                                                                    <span className="font-mono text-xs text-neutral-500 bg-neutral-900 px-2 py-1 rounded-sm">
                                                                        {stage.completion_percentage}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-neutral-500 mt-1 font-mono uppercase tracking-wider">
                                                                {stage.status.replace('-', ' ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* RIGHT: Actions / Quick Links */}
                                <div className="space-y-6">
                                    <Card className="bg-[#0A0A0A] border-neutral-800 shadow-none rounded-sm">
                                        <CardHeader className="border-b border-neutral-900/50">
                                            <CardTitle className="text-lg font-medium text-white">Actions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="flex flex-col divide-y divide-neutral-900">
                                                <Link to="/client/portal/project-request" className="group flex items-center justify-between w-full p-6 hover:bg-neutral-900/30 transition-colors text-left">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                                                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white">New Project Request</span>
                                                    </div>
                                                    <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                                                </Link>
                                                <Link to="/client/portal/tickets" className="group flex items-center justify-between w-full p-6 hover:bg-neutral-900/30 transition-colors text-left">
                                                    <div className="flex items-center gap-3">
                                                        <AlertCircle className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                                                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Contact Support</span>
                                                    </div>
                                                    <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="bg-neutral-900/20 border border-neutral-800 p-6 rounded-sm">
                                        <p className="text-xs text-neutral-500 leading-relaxed">
                                            <span className="text-white font-medium block mb-2">Notice:</span>
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
