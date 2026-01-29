import { useClientStore } from "@/store/clientStore";
import { useClientAssets, useDevTracking, useApproachPlans } from "@/hooks/useProClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ProDashboard() {
    const currentClient = useClientStore((state) => state.currentClient);
    const { assets } = useClientAssets(currentClient?.id);
    const { tracking } = useDevTracking(currentClient?.id);
    const { plans } = useApproachPlans(currentClient?.id);

    if (!currentClient) return null;

    const assetStats = [
        { label: "Images", count: assets.filter(a => a.type === 'image').length },
        { label: "Videos", count: assets.filter(a => a.type === 'video').length },
        { label: "Documents", count: assets.filter(a => a.type === 'document').length },
        { label: "Links", count: assets.filter(a => a.type === 'link').length },
    ];

    const appTracking = tracking.filter(t => t.project_type === 'app');
    const webTracking = tracking.filter(t => t.project_type === 'web');

    const calculateProgress = (items: typeof tracking) => {
        if (items.length === 0) return 0;
        return Math.round(items.reduce((acc, t) => acc + t.progress, 0) / items.length);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-10 px-4">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-zinc-800 pb-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-medium tracking-tight text-zinc-100">
                            {currentClient.name}
                        </h1>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded border border-amber-500/40 text-amber-500">
                            Pro Member
                        </span>
                    </div>
                    <p className="text-zinc-500 text-sm tracking-wide">
                        Project control center and asset overview.
                    </p>
                </div>
                <div className="font-mono text-[11px] text-zinc-600 uppercase tracking-widest">
                    Ref: {currentClient.assigned_id}
                </div>
            </header>

            {/* Metrics Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden">
                {assetStats.map((stat) => (
                    <div key={stat.label} className="bg-black p-8 group hover:bg-zinc-950 transition-colors">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] mb-2">{stat.label}</p>
                        <p className="text-4xl font-light text-white tracking-tighter">{stat.count}</p>
                    </div>
                ))}
            </section>

            {/* Development Section */}
            <div className="grid lg:grid-cols-2 gap-12">
                {/* App Dev */}
                <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Application Development</h2>
                        <Link to="/pro/portal/app-tracking" className="text-[11px] text-amber-500 hover:underline">VIEW TRACKING</Link>
                    </div>
                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm text-zinc-400">Completion Status</span>
                            <span className="text-xl font-light text-white">{calculateProgress(appTracking)}%</span>
                        </div>
                        <Progress value={calculateProgress(appTracking)} className="h-[2px] bg-zinc-800" />
                        <p className="text-[11px] text-zinc-600 italic">
                            {appTracking.length > 0
                                ? `${appTracking.filter(t => t.status === 'completed').length} of ${appTracking.length} milestones reached`
                                : "No active milestones"}
                        </p>
                    </div>
                </div>

                {/* Web Dev */}
                <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Platform Development</h2>
                        <Link to="/pro/portal/web-tracking" className="text-[11px] text-amber-500 hover:underline">VIEW TRACKING</Link>
                    </div>
                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm text-zinc-400">Completion Status</span>
                            <span className="text-xl font-light text-white">{calculateProgress(webTracking)}%</span>
                        </div>
                        <Progress value={calculateProgress(webTracking)} className="h-[2px] bg-zinc-800" />
                        <p className="text-[11px] text-zinc-600 italic">
                            {webTracking.length > 0
                                ? `${webTracking.filter(t => t.status === 'completed').length} of ${webTracking.length} milestones reached`
                                : "No active milestones"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Project Links Section */}
            {assets.filter(a => a.type === 'link').length > 0 && (
                <section className="space-y-6">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Quick Access Links</h2>
                        <Link to="/pro/portal/assets?tab=link" className="text-[11px] text-amber-500 hover:underline">MANAGE LINKS</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assets.filter(a => a.type === 'link').map(link => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-4 bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50 transition-all rounded flex items-center justify-between"
                            >
                                <span className="text-sm font-medium text-zinc-300 group-hover:text-white truncate">{link.name}</span>
                                <span className="text-[10px] text-zinc-600 group-hover:text-amber-500 uppercase tracking-widest">Open &rarr;</span>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* Approach Plans List */}
            <section className="space-y-8 pt-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Strategic Approach Plans</h2>
                </div>

                {plans.length === 0 ? (
                    <div className="py-12 border border-zinc-900 rounded text-center">
                        <p className="text-sm text-zinc-600">Pending plan publication.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {plans.slice(0, 3).map(plan => (
                            <div key={plan.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded border border-zinc-800 bg-zinc-950/50 hover:border-zinc-600 transition-all">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-sm font-medium text-zinc-200">{plan.title}</h4>
                                        {plan.is_protected && (
                                            <span className="text-[9px] border border-zinc-700 text-zinc-500 px-1.5 py-0.5 rounded uppercase">Private</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-500 max-w-xl line-clamp-1">{plan.description}</p>
                                </div>
                                <Link to={`/pro/portal/approach-plans`}>
                                    <Button variant="link" className="px-0 text-xs text-zinc-400 group-hover:text-amber-500 transition-colors">
                                        Open Document
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}