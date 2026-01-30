import { useClientStore } from "@/store/clientStore";
import { useApproachPlans } from "@/hooks/useProClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DbApproachPlan } from "@/hooks/useProClient";

export default function ApproachPlansPage() {
    const currentClient = useClientStore((state) => state.currentClient);
    const { plans, loading } = useApproachPlans(currentClient?.id);
    const [selectedPlan, setSelectedPlan] = useState<DbApproachPlan | null>(null);

    if (!currentClient) return null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-700" />
                <span className="text-[10px] tracking-[0.3em] text-zinc-600 uppercase font-bold">Accessing Secure Plans</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-16 py-4">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-900 pb-12">
                <div className="space-y-2">
                    <p className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase">
                        Strategic Assets
                    </p>
                    <h1 className="text-4xl font-light tracking-tight text-white">
                        Approach Plans
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase mb-1">Architecture</p>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-white uppercase italic">
                        {plans.length} Documents Indexed
                    </p>
                </div>
            </header>

            {plans.length === 0 ? (
                <div className="py-32 border border-dashed border-zinc-900 rounded-sm text-center">
                    <p className="text-[11px] uppercase tracking-widest text-zinc-600 font-bold">
                        No strategic documentation available for this terminal
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id} 
                            className="group cursor-pointer space-y-5"
                            onClick={() => setSelectedPlan(plan)}
                        >
                            {/* Technical Image Container */}
                            <div className="aspect-[16/10] bg-zinc-900 border border-zinc-800 overflow-hidden relative">
                                {plan.image_url ? (
                                    <img 
                                        src={plan.image_url} 
                                        alt={plan.title} 
                                        className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-[9px] font-black tracking-[0.4em] text-zinc-800 uppercase">No Visual Data</span>
                                    </div>
                                )}
                                
                                {plan.is_protected && (
                                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-medium text-zinc-200 group-hover:text-amber-500 transition-colors tracking-tight">
                                        {plan.title}
                                    </h3>
                                    <span className="text-[9px] font-mono text-zinc-700 uppercase">
                                        {new Date(plan.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                {plan.description && (
                                    <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 italic font-serif opacity-80">
                                        {plan.description}
                                    </p>
                                )}

                                <div className="pt-4 flex items-center gap-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                                        View Full Protocol
                                    </span>
                                    <div className="h-px flex-1 bg-zinc-900 group-hover:bg-amber-500/30 transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Plan Detail Dialog - Minimalist Transformation */}
            <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
                <DialogContent className="bg-[#050505] border-zinc-800 max-w-4xl max-h-[90vh] overflow-y-auto selection:bg-amber-500 selection:text-black">
                    {selectedPlan && (
                        <div className="space-y-10 pt-6">
                            <DialogHeader>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black tracking-[0.3em] text-amber-500 uppercase">Protocol Details</p>
                                    <DialogTitle className="text-2xl font-light text-white tracking-tight">
                                        {selectedPlan.title}
                                    </DialogTitle>
                                </div>
                            </DialogHeader>

                            <div className="space-y-8">
                                {selectedPlan.image_url && (
                                    <div className="border border-zinc-800 bg-zinc-950 p-1">
                                        <img 
                                            src={selectedPlan.image_url} 
                                            alt={selectedPlan.title}
                                            className="w-full h-auto opacity-90"
                                        />
                                    </div>
                                )}

                                <div className="grid md:grid-cols-3 gap-10">
                                    <div className="md:col-span-1 space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase mb-3">Classification</p>
                                            <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">
                                                {selectedPlan.is_protected ? 'L4 - Restricted' : 'L1 - Standard'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase mb-3">Timestamp</p>
                                            <p className="text-[11px] font-mono text-zinc-400">
                                                {new Date(selectedPlan.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-8">
                                        {selectedPlan.description && (
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase">Executive Summary</p>
                                                <p className="text-sm text-zinc-400 leading-relaxed font-serif italic">
                                                    {selectedPlan.description}
                                                </p>
                                            </div>
                                        )}

                                        {Object.keys(selectedPlan.plan_data).length > 0 && (
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase">Plan Metadata</p>
                                                <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-sm">
                                                    <pre className="text-[11px] text-amber-500/80 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                                                        {JSON.stringify(selectedPlan.plan_data, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-zinc-900 flex justify-between items-center">
                                    {selectedPlan.image_url && (
                                        <button
                                            className="text-[10px] font-bold uppercase tracking-widest text-white bg-zinc-800 hover:bg-white hover:text-black px-8 py-3 transition-all"
                                            onClick={() => window.open(selectedPlan.image_url!, '_blank')}
                                        >
                                            Open External Source
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setSelectedPlan(null)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
                                    >
                                        Close Terminal
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}