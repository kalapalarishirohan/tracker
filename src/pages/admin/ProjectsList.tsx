import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Activity, BarChart3, CheckCircle2, Circle, Settings2, Sliders, Flag, Loader2, Trash2, MoreHorizontal } from "lucide-react";
import CreateProjectForm from "./CreateProjectForm";
import { useClients, useProjects, DbProject, DbProjectStage } from "@/hooks/useDatabase";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

const STAGES = [
    'Requirements Analysis',
    'Design & Prototyping',
    'Development',
    'Testing & QA',
    'Deployment',
    'Handover & Training'
];

export default function ProjectsList() {
    const { clients } = useClients();
    const { projects, loading, updateProjectProgress, markProjectComplete, fetchProjects } = useProjects();
    const [selectedProject, setSelectedProject] = useState<(DbProject & { stages: DbProjectStage[] }) | null>(null);

    // For Update Dialog
    const [editStage, setEditStage] = useState<string>(STAGES[0]);
    const [editProgress, setEditProgress] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        if (selectedProject) {
            setIsUpdating(true);
            const success = await updateProjectProgress(selectedProject.id, editStage, editProgress);
            setIsUpdating(false);
            if (success) {
                toast.success("System Updated", { description: "Project parameters synchronized." });
                setIsDialogOpen(false);
            }
        }
    };

    const handleMarkComplete = async (projectId: string) => {
        const success = await markProjectComplete(projectId);
        if (success) {
            toast.success("Project Completed", { description: "All stages marked as complete." });
        }
    };

    const handleDeleteProject = async () => {
        if (!selectedProject) return;

        setIsUpdating(true);

        // First delete all project stages
        const { error: stagesError } = await supabase
            .from('project_stages')
            .delete()
            .eq('project_id', selectedProject.id);

        if (stagesError) {
            toast.error("Delete Failed", { description: stagesError.message });
            setIsUpdating(false);
            return;
        }

        // Then delete the project
        const { error: projectError } = await supabase
            .from('projects')
            .delete()
            .eq('id', selectedProject.id);

        setIsUpdating(false);

        if (projectError) {
            toast.error("Delete Failed", { description: projectError.message });
        } else {
            toast.success("Project Deleted", { description: `${selectedProject.title} removed from database.` });
            setIsDeleteDialogOpen(false);
            fetchProjects();
        }
    };

    // Helper to open dialog and pre-fill data
    const openUpdateDialog = (project: DbProject & { stages: DbProjectStage[] }) => {
        setSelectedProject(project);
        setEditStage(STAGES[0]);
        const stage = project.stages.find(s => s.name === STAGES[0]);
        setEditProgress(stage?.completion_percentage || 0); 
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (project: DbProject & { stages: DbProjectStage[] }) => {
        setSelectedProject(project);
        setIsDeleteDialogOpen(true);
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white mb-2">
                        Project Operations
                    </h1>
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
                        <Activity className="w-3 h-3" />
                        <span>Active Workflows: {projects.length}</span>
                    </div>
                </div>
                <CreateProjectForm onProjectCreated={fetchProjects} />
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-[#050505] border-neutral-800 text-white sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-medium tracking-tight text-red-500">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-neutral-400">
                            Are you sure you want to delete <span className="text-white font-medium">{selectedProject?.title}</span>? This will also delete all project stages. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="border-neutral-800 text-neutral-300 hover:bg-neutral-900"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleDeleteProject}
                            disabled={isUpdating}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Project'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid gap-6">
                {projects.map((project) => {
                    const client = clients.find(c => c.id === project.client_id);
                    const clientName = client?.name || "Unknown Entity";

                    return (
                        <Card key={project.id} className="bg-[#0A0A0A] border-neutral-800 rounded-sm shadow-none overflow-hidden group hover:border-neutral-700 transition-colors">
                            <CardHeader className="flex flex-row items-start justify-between pb-4 border-b border-neutral-900/50 bg-neutral-950/30">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-lg font-medium text-white tracking-tight">
                                            {project.title}
                                        </CardTitle>
                                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border uppercase tracking-widest ${
                                            project.is_completed 
                                                ? 'bg-emerald-950/30 border-emerald-900 text-emerald-500' 
                                                : 'bg-blue-950/30 border-blue-900 text-blue-400'
                                        }`}>
                                            {project.is_completed ? 'Finished' : 'In Progress'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                                        <span>CLIENT_ID:</span>
                                        <span className="text-neutral-300 uppercase">{clientName}</span>
                                        {client && (
                                            <span className="text-emerald-500">({client.assigned_id})</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {!project.is_completed && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleMarkComplete(project.id)}
                                            className="bg-emerald-950/20 border-emerald-900/50 text-emerald-500 hover:text-white hover:bg-emerald-900/30 text-xs font-mono tracking-wider h-8"
                                        >
                                            <Flag className="w-3 h-3 mr-2" />
                                            MARK COMPLETE
                                        </Button>
                                    )}
                                    <Dialog open={isDialogOpen && selectedProject?.id === project.id} onOpenChange={(open) => {
                                        if(!open) setIsDialogOpen(false);
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => openUpdateDialog(project)}
                                                className="bg-transparent border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 text-xs font-mono tracking-wider h-8"
                                            >
                                                <Settings2 className="w-3 h-3 mr-2" />
                                                MODIFY_STATE
                                            </Button>
                                        </DialogTrigger>
                                                
                                    {/* --- UPDATE MODAL --- */}
                                    <DialogContent className="bg-[#050505] border-neutral-800 text-white sm:max-w-[450px] p-0">
                                        <DialogHeader className="p-6 border-b border-neutral-900 bg-neutral-950">
                                            <DialogTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
                                                <Sliders className="w-4 h-4 text-white" />
                                                Update Sequence
                                            </DialogTitle>
                                        </DialogHeader>
                                        
                                        <div className="p-6 space-y-8">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Target Stage</Label>
                                                <Select onValueChange={(v) => {
                                                    setEditStage(v);
                                                    const s = project.stages.find(s => s.name === v);
                                                    if (s) setEditProgress(s.completion_percentage);
                                                }} defaultValue={STAGES[0]}>
                                                    <SelectTrigger className="bg-neutral-900 border-neutral-800 rounded-sm text-sm h-11 text-white focus:ring-0 focus:border-white transition-colors">
                                                        <SelectValue placeholder="Select Stage" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                        {STAGES.map(s => <SelectItem key={s} value={s} className="focus:bg-neutral-800 focus:text-white cursor-pointer">{s}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Stage Completion</Label>
                                                    <span className="text-xl font-mono font-bold text-white">{editProgress}%</span>
                                                </div>
                                                
                                                {/* Custom Range Slider Look */}
                                                <div className="relative w-full h-6 flex items-center">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        step="5"
                                                        value={editProgress}
                                                        onChange={(e) => setEditProgress(Number(e.target.value))}
                                                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-neutral-200"
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[10px] text-neutral-600 font-mono uppercase">
                                                    <span>Start</span>
                                                    <span>In Progress</span>
                                                    <span>Complete</span>
                                                </div>
                                            </div>

                                            <Button 
                                                onClick={handleUpdate} 
                                                disabled={isUpdating}
                                                className="w-full bg-white hover:bg-neutral-200 text-black font-bold h-12 rounded-sm tracking-widest uppercase text-xs"
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        UPDATING...
                                                    </>
                                                ) : (
                                                    'Commit Changes'
                                                )}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                    {/* Actions Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-500 hover:text-white">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800">
                                            <DropdownMenuItem 
                                                onClick={() => openDeleteDialog(project)}
                                                className="text-red-400 focus:text-red-300 focus:bg-red-950/50 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Project
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6">
                                {/* Main Progress Bar */}
                                <div className="space-y-2 mb-8">
                                    <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-neutral-500">
                                        <span>Total Compilation</span>
                                        <span className="text-white">{project.total_progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-neutral-900 rounded-none relative overflow-hidden">
                                        <div 
                                            className="absolute top-0 left-0 h-full bg-white transition-all duration-700 ease-out" 
                                            style={{ width: `${project.total_progress}%` }} 
                                        />
                                        {/* Scanline Effect */}
                                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoNHYxSDB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4yIi8+PC9zdmc+')] opacity-50" />
                                    </div>
                                </div>

                                {/* Stages Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                    {project.stages.map((stage) => {
                                        const isDone = stage.status === 'completed';
                                        const isActive = stage.status === 'in-progress';
                                        
                                        return (
                                            <div key={stage.name} className={`
                                                relative p-3 rounded-sm border transition-all duration-300
                                                ${isDone ? 'bg-emerald-950/10 border-emerald-900/50' : isActive ? 'bg-neutral-900 border-white/40' : 'bg-transparent border-neutral-900'}
                                            `}>
                                                {/* Status Dot */}
                                                <div className="flex justify-between items-start mb-2">
                                                    {isDone ? (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                    ) : isActive ? (
                                                        <div className="w-3 h-3 rounded-full border-2 border-white animate-pulse" />
                                                    ) : (
                                                        <Circle className="w-3 h-3 text-neutral-800" />
                                                    )}
                                                    
                                                    <span className={`text-[10px] font-mono ${isDone ? 'text-emerald-500' : isActive ? 'text-white' : 'text-neutral-700'}`}>
                                                        {stage.completion_percentage}%
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    <p className={`text-[10px] font-medium leading-tight line-clamp-2 ${isActive ? 'text-white' : 'text-neutral-500'}`} title={stage.name}>
                                                        {stage.name}
                                                    </p>
                                                    <p className="text-[9px] uppercase tracking-wider text-neutral-700">
                                                        {stage.status === 'in-progress' ? 'Running' : stage.status}
                                                    </p>
                                                </div>
                                                
                                                {/* Active Indicator Line */}
                                                {isActive && (
                                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white animate-pulse" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {projects.length === 0 && (
                    <div className="h-64 border border-dashed border-neutral-800 rounded-sm flex flex-col items-center justify-center text-neutral-600 space-y-4">
                        <BarChart3 className="w-10 h-10 opacity-20" />
                        <span className="text-sm font-mono uppercase tracking-widest">No active sequences initialized.</span>
                    </div>
                )}
            </div>
        </div>
    );
}