import { useClientStore } from "@/store/clientStore";
import { useDevTracking } from "@/hooks/useProClient";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface DevTrackingPageProps {
    projectType: 'app' | 'web';
}

export default function DevTrackingPage({ projectType }: DevTrackingPageProps) {
    const currentClient = useClientStore((state) => state.currentClient);
    const { tracking, loading } = useDevTracking(currentClient?.id);

    if (!currentClient) return null;

    const filteredTracking = tracking.filter(t => t.project_type === projectType);

    const calculateOverallProgress = () => {
        if (filteredTracking.length === 0) return 0;
        return Math.round(filteredTracking.reduce((acc, t) => acc + t.progress, 0) / filteredTracking.length);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-700" />
                <span className="text-[10px] tracking-[0.3em] text-zinc-600 uppercase font-bold">Synchronizing Pipeline</span>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-4">
            {/* Minimalist Header */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-900 pb-12">
                <div className="space-y-2">
                    <p className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase">
                        {projectType === 'app' ? 'Mobile Environment' : 'Platform Environment'}
                    </p>
                    <h1 className="text-4xl font-light tracking-tight text-white">
                        {projectType === 'app' ? 'App' : 'Web'} Development
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase mb-1">Status</p>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-white uppercase italic">
                        Real-time Monitoring Active
                    </p>
                </div>
            </header>

            {/* Overall Progress Section */}
            <section className="grid md:grid-cols-3 gap-12 items-center">
                <div className="md:col-span-1">
                    <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase mb-2">Total Completion</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-light text-white tracking-tighter">
                            {calculateOverallProgress()}
                        </span>
                        <span className="text-xl text-amber-500 font-light">%</span>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <span>Project Velocity</span>
                        <span className="text-zinc-300">
                            {filteredTracking.filter(t => t.status === 'completed').length} / {filteredTracking.length} Milestones
                        </span>
                    </div>
                    <Progress value={calculateOverallProgress()} className="h-[2px] bg-zinc-900" />
                </div>
            </section>

            {/* Timeline / Phases */}
            <div className="space-y-0">
                <div className="px-1 mb-8">
                    <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase">Development Roadmap</h2>
                </div>

                {filteredTracking.length === 0 ? (
                    <div className="py-20 border border-dashed border-zinc-900 rounded-sm text-center">
                        <p className="text-[11px] uppercase tracking-widest text-zinc-600">Awaiting roadmap initialization</p>
                    </div>
                ) : (
                    <div className="grid gap-px bg-zinc-900 border border-zinc-900 overflow-hidden">
                        {filteredTracking.map((phase, index) => (
                            <div key={phase.id} className="bg-[#050505] p-8 group hover:bg-zinc-950 transition-colors">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Numbering */}
                                    <div className="hidden md:block">
                                        <span className="text-xs font-mono text-zinc-800 group-hover:text-amber-500 transition-colors">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-medium text-white tracking-tight">{phase.phase}</h3>
                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-[0.2em]",
                                                        phase.status === 'completed' ? "text-amber-500" : 
                                                        phase.status === 'in-progress' ? "text-white" : "text-zinc-700"
                                                    )}>
                                                        {phase.status.replace('-', ' ')}
                                                    </span>
                                                    {phase.start_date && (
                                                        <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
                                                            Est. {new Date(phase.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-light text-zinc-400 group-hover:text-white transition-colors">
                                                    {phase.progress}%
                                                </span>
                                            </div>
                                        </div>

                                        <Progress value={phase.progress} className="h-[1px] bg-zinc-900" />

                                        {phase.notes && (
                                            <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl italic font-serif opacity-80">
                                                {phase.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}