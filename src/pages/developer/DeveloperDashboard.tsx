
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Database, Activity, Lock, Terminal } from "lucide-react";

export default function DeveloperDashboard() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-light selection:bg-purple-500/30">

            {/* Header */}
            <header className="border-b border-neutral-800 bg-[#0A0A0A]/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center text-purple-500 border border-purple-500/20">
                            <Terminal className="w-4 h-4" />
                        </div>
                        <span className="font-medium tracking-tight">Developer Console</span>
                    </div>
                    <Link to="/">
                        <Button variant="ghost" className="text-neutral-400 hover:text-white">
                            Log out
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-3xl font-normal mb-2">System Overview</h1>
                    <p className="text-neutral-500">Real-time metrics and deployment status.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatusCard
                        icon={GitBranch}
                        title="Active Branch"
                        value="main"
                        sub="Last commit: 2m ago"
                    />
                    <StatusCard
                        icon={Database}
                        title="Database"
                        value="Connected"
                        sub="Latency: 24ms"
                        active
                    />
                    <StatusCard
                        icon={Activity}
                        title="API Status"
                        value="99.9% Uptime"
                        sub="0 errors in last 24h"
                        active
                    />
                </div>

                <h2 className="text-xl font-normal mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ActionCard title="View API Logs" icon={Terminal} />
                    <ActionCard title="Manage Keys" icon={Lock} />
                    <ActionCard title="Database Query" icon={Database} />
                    <ActionCard title="Deployments" icon={GitBranch} />
                </div>
            </main>
        </div>
    );
}

interface StatusCardProps {
    icon: any;
    title: string;
    value: string;
    sub: string;
    active?: boolean;
}

function StatusCard({ icon: Icon, title, value, sub, active }: StatusCardProps) {
    return (
        <Card className="bg-[#0A0A0A] border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-neutral-400">
                    {title}
                </CardTitle>
                <Icon className={`w-4 h-4 ${active ? 'text-green-500' : 'text-neutral-500'}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white mb-1">{value}</div>
                <p className="text-xs text-neutral-500">{sub}</p>
            </CardContent>
        </Card>
    );
}

function ActionCard({ title, icon: Icon }) {
    return (
        <Button variant="outline" className="h-24 bg-[#0A0A0A] border-neutral-800 hover:border-purple-500 hover:bg-neutral-900 flex flex-col items-center justify-center gap-2 group transition-all">
            <Icon className="w-6 h-6 text-neutral-400 group-hover:text-purple-500 transition-colors" />
            <span className="text-sm font-normal text-neutral-300 group-hover:text-white">{title}</span>
        </Button>
    )
}
