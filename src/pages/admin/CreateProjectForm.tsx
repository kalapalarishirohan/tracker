import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, FolderGit2, Terminal, Loader2 } from "lucide-react";
import { useClients, useProjects } from "@/hooks/useDatabase";

const DEFAULT_STAGES = [
    { name: 'Requirements Analysis', status: 'pending' as const, completion_percentage: 0, sort_order: 0 },
    { name: 'Design & Prototyping', status: 'pending' as const, completion_percentage: 0, sort_order: 1 },
    { name: 'Development', status: 'pending' as const, completion_percentage: 0, sort_order: 2 },
    { name: 'Testing & QA', status: 'pending' as const, completion_percentage: 0, sort_order: 3 },
    { name: 'Deployment', status: 'pending' as const, completion_percentage: 0, sort_order: 4 },
    { name: 'Handover & Training', status: 'pending' as const, completion_percentage: 0, sort_order: 5 },
];

interface CreateProjectFormProps {
    trigger?: React.ReactNode;
    onProjectCreated?: () => void;
}

export default function CreateProjectForm({ trigger, onProjectCreated }: CreateProjectFormProps) {
    const { clients } = useClients();
    const { addProject } = useProjects();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        clientId: "",
        title: "",
        description: "",
        startDate: new Date().toISOString().split('T')[0],
        projectLead: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.clientId || !formData.title.trim()) {
            toast.error("Required Fields Missing", { description: "Client and Project Title are mandatory." });
            return;
        }

        setIsSubmitting(true);

        const result = await addProject(
            {
                client_id: formData.clientId,
                title: formData.title.trim(),
                description: formData.description.trim() || null,
                start_date: formData.startDate || new Date().toISOString(),
                end_date: null,
                total_progress: 0,
                is_completed: false,
                project_lead: formData.projectLead || null,
            },
            DEFAULT_STAGES
        );

        setIsSubmitting(false);

        if (result) {
            toast.success("Project Created", { description: `${formData.title} has been initialized.` });
            setIsDialogOpen(false);
            setFormData({
                clientId: "",
                title: "",
                description: "",
                startDate: new Date().toISOString().split('T')[0],
                projectLead: ""
            });
            onProjectCreated?.();
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="h-10 bg-white hover:bg-neutral-200 text-black rounded-sm text-xs font-bold uppercase tracking-wider px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                )}
            </DialogTrigger>
            
            <DialogContent className="bg-[#050505] border-neutral-800 text-white sm:max-w-[500px] p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-neutral-900 bg-neutral-950/50">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-neutral-900 rounded border border-neutral-800">
                            <Terminal className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase">CMD: CREATE_PROJECT</span>
                    </div>
                    <DialogTitle className="text-xl font-medium tracking-tight">Initialize New Project</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Assign to Client *</Label>
                        <Select
                            value={formData.clientId}
                            onValueChange={(v) => setFormData({ ...formData, clientId: v })}
                        >
                            <SelectTrigger className="bg-neutral-900/50 border-neutral-800 focus:border-white transition-colors rounded-sm h-11">
                                <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id} className="focus:bg-neutral-800 focus:text-white cursor-pointer">
                                        <span className="flex items-center gap-2">
                                            <span className="font-mono text-emerald-500">{client.assigned_id}</span>
                                            <span>-</span>
                                            <span>{client.name}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Project Title *</Label>
                        <div className="relative">
                            <FolderGit2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                            <Input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. E-commerce Platform Redesign"
                                className="pl-10 bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Description</Label>
                        <Textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the project scope..."
                            className="min-h-[80px] bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Start Date</Label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                className="bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Project Lead</Label>
                            <Input
                                value={formData.projectLead}
                                onChange={e => setFormData({ ...formData, projectLead: e.target.value })}
                                placeholder="e.g. John Doe"
                                className="bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-neutral-800 rounded-sm">
                        <p className="text-xs text-neutral-500">
                            <span className="text-neutral-400 font-medium">Note:</span> Project will be initialized with 6 standard stages. You can update progress for each stage after creation.
                        </p>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-white hover:bg-neutral-200 text-black font-bold tracking-wider rounded-sm h-12"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    PROCESSING...
                                </>
                            ) : (
                                'INITIALIZE PROJECT'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
