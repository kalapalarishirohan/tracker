import { useState, useEffect } from "react";
import { useClientStore } from "@/store/clientStore";
import { useDevTracking } from "@/hooks/useProClient";
import { useClientDomains } from "@/hooks/useClientDomains";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Loader2, ExternalLink, Globe, Layers } from "lucide-react";
import { toast } from "sonner";
import EmbeddedViewer from "@/components/EmbeddedViewer";

export default function ProDashboard() {
    const currentClient = useClientStore((state) => state.currentClient);
    const { tracking, loading: trackingLoading } = useDevTracking(currentClient?.id);
    const { domains, loading: domainsLoading, fetchDomains } = useClientDomains(currentClient?.id);
    
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    // Real-time subscription for domain updates
    useEffect(() => {
        if (!currentClient?.id) return;

        const channel = supabase
            .channel(`domains-${currentClient.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'client_domains',
                    filter: `client_id=eq.${currentClient.id}`,
                },
                (payload) => {
                    console.log('Domain update:', payload);
                    fetchDomains();
                    
                    if (payload.eventType === 'INSERT') {
                        toast.success('New domain added!', {
                            description: 'Your domains have been updated.',
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        toast.info('Domain updated', {
                            description: 'Domain information has been refreshed.',
                        });
                    } else if (payload.eventType === 'DELETE') {
                        toast.info('Domain removed', {
                            description: 'A domain has been removed from your list.',
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentClient?.id, fetchDomains]);

    if (!currentClient) return null;

    const coreDomains = domains.filter(d => d.domain_type === 'core');
    const subdomains = domains.filter(d => d.domain_type === 'subdomain');

    const appTracking = tracking.filter(t => t.project_type === 'app');
    const webTracking = tracking.filter(t => t.project_type === 'web');

    const calculateProgress = (items: typeof tracking) => {
        if (items.length === 0) return 0;
        return Math.round(items.reduce((acc, t) => acc + t.progress, 0) / items.length);
    };

    const loading = trackingLoading || domainsLoading;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-700" />
                <span className="text-[10px] tracking-[0.3em] text-zinc-600 uppercase font-bold">
                    Initializing Dashboard
                </span>
            </div>
        );
    }

    // If a URL is selected, show the embedded viewer
    if (selectedUrl) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setSelectedUrl(null)}
                    className="text-[10px] font-bold tracking-[0.2em] text-amber-500 uppercase hover:text-amber-400 transition-colors"
                >
                    ← Back to Dashboard
                </button>
                <EmbeddedViewer url={selectedUrl} title="Project View" onClose={() => setSelectedUrl(null)} />
            </div>
        );
    }

    return (
        <div className="space-y-16">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-900 pb-12">
                <div className="space-y-2">
                    <p className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase">
                        Command Center
                    </p>
                    <h1 className="text-4xl font-light tracking-tight text-white">
                        Overview
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase mb-1">
                        Welcome back
                    </p>
                    <p className="text-sm font-medium text-white">
                        {currentClient.name}
                    </p>
                </div>
            </header>

            {/* Progress Cards */}
            <section className="grid md:grid-cols-2 gap-8">
                {/* App Development */}
                <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase mb-2">
                                App Development
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-light text-white">
                                    {calculateProgress(appTracking)}
                                </span>
                                <span className="text-lg text-amber-500">%</span>
                            </div>
                        </div>
                        <span className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase">
                            {appTracking.filter(t => t.status === 'completed').length} / {appTracking.length} phases
                        </span>
                    </div>
                    <Progress value={calculateProgress(appTracking)} className="h-[2px] bg-zinc-900" />
                </div>

                {/* Web Development */}
                <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase mb-2">
                                Web Development
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-light text-white">
                                    {calculateProgress(webTracking)}
                                </span>
                                <span className="text-lg text-amber-500">%</span>
                            </div>
                        </div>
                        <span className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase">
                            {webTracking.filter(t => t.status === 'completed').length} / {webTracking.length} phases
                        </span>
                    </div>
                    <Progress value={calculateProgress(webTracking)} className="h-[2px] bg-zinc-900" />
                </div>
            </section>

            {/* Project Domains */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <Globe className="w-5 h-5 text-amber-500" />
                    <h2 className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase">
                        Project Domains
                    </h2>
                </div>

                {domains.length === 0 ? (
                    <div className="py-16 border border-dashed border-zinc-900 rounded-sm text-center">
                        <p className="text-[11px] uppercase tracking-widest text-zinc-600">
                            No domains configured yet
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Core Domains */}
                        {coreDomains.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-[9px] font-bold tracking-[0.2em] text-amber-500 uppercase">
                                    Core Domains
                                </p>
                                <div className="space-y-2">
                                    {coreDomains.map((domain) => (
                                        <button
                                            key={domain.id}
                                            onClick={() => setSelectedUrl(domain.url)}
                                            className="w-full text-left bg-zinc-950 border border-zinc-900 p-4 hover:border-amber-500/30 transition-colors group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-white group-hover:text-amber-500 transition-colors">
                                                        {domain.name}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-600 font-mono">
                                                        {domain.url}
                                                    </p>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-zinc-700 group-hover:text-amber-500 transition-colors" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Subdomains */}
                        {subdomains.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                                    <Layers className="w-3 h-3" />
                                    Subdomains
                                </p>
                                <div className="space-y-2">
                                    {subdomains.map((domain) => (
                                        <button
                                            key={domain.id}
                                            onClick={() => setSelectedUrl(domain.url)}
                                            className="w-full text-left bg-zinc-950 border border-zinc-900 p-4 hover:border-zinc-700 transition-colors group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                                        {domain.name}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-700 font-mono">
                                                        {domain.url}
                                                    </p>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-zinc-800 group-hover:text-zinc-500 transition-colors" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900">
                <div className="bg-[#050505] p-6 text-center">
                    <p className="text-2xl font-light text-white">{tracking.length}</p>
                    <p className="text-[9px] font-bold tracking-[0.2em] text-zinc-600 uppercase mt-1">
                        Active Phases
                    </p>
                </div>
                <div className="bg-[#050505] p-6 text-center">
                    <p className="text-2xl font-light text-white">
                        {tracking.filter(t => t.status === 'completed').length}
                    </p>
                    <p className="text-[9px] font-bold tracking-[0.2em] text-zinc-600 uppercase mt-1">
                        Completed
                    </p>
                </div>
                <div className="bg-[#050505] p-6 text-center">
                    <p className="text-2xl font-light text-white">{domains.length}</p>
                    <p className="text-[9px] font-bold tracking-[0.2em] text-zinc-600 uppercase mt-1">
                        Domains
                    </p>
                </div>
                <div className="bg-[#050505] p-6 text-center">
                    <p className="text-2xl font-light text-amber-500">PRO</p>
                    <p className="text-[9px] font-bold tracking-[0.2em] text-zinc-600 uppercase mt-1">
                        Account Tier
                    </p>
                </div>
            </section>
        </div>
    );
}
