import { useClientStore } from "@/store/clientStore";
import { useDevTracking } from "@/hooks/useProClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Globe, CheckCircle, Clock, Circle, Loader2 } from "lucide-react";

interface DevTrackingPageProps {
    projectType: 'app' | 'web';
}

export default function DevTrackingPage({ projectType }: DevTrackingPageProps) {
    const currentClient = useClientStore((state) => state.currentClient);
    const { tracking, loading } = useDevTracking(currentClient?.id);

    if (!currentClient) return null;

    const filteredTracking = tracking.filter(t => t.project_type === projectType);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'in-progress': return <Clock className="w-5 h-5 text-amber-400" />;
            default: return <Circle className="w-5 h-5 text-neutral-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
            case 'in-progress':
                return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">In Progress</Badge>;
            default:
                return <Badge className="bg-neutral-500/20 text-neutral-400 border-neutral-500/30">Pending</Badge>;
        }
    };

    const calculateOverallProgress = () => {
        if (filteredTracking.length === 0) return 0;
        return Math.round(filteredTracking.reduce((acc, t) => acc + t.progress, 0) / filteredTracking.length);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    {projectType === 'app' ? (
                        <Smartphone className="w-8 h-8 text-amber-400" />
                    ) : (
                        <Globe className="w-8 h-8 text-amber-400" />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {projectType === 'app' ? 'App Development' : 'Web Development'} Tracking
                        </h1>
                        <p className="text-amber-200/70">Track the progress of your {projectType} development phases</p>
                    </div>
                </div>
            </div>

            {/* Overall Progress Card */}
            <Card className="bg-gradient-to-br from-amber-950/30 to-amber-900/10 border-amber-900/30">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                            <p className="text-amber-200/70">
                                {filteredTracking.filter(t => t.status === 'completed').length} of {filteredTracking.length} phases completed
                            </p>
                        </div>
                        <div className="text-4xl font-bold text-amber-400 font-mono">
                            {calculateOverallProgress()}%
                        </div>
                    </div>
                    <Progress value={calculateOverallProgress()} className="h-3 mt-4 bg-amber-950" />
                </CardContent>
            </Card>

            {/* Phases List */}
            {filteredTracking.length === 0 ? (
                <Card className="bg-neutral-950 border-amber-900/30">
                    <CardContent className="p-12 text-center">
                        <p className="text-neutral-400">No development phases have been added yet.</p>
                        <p className="text-sm text-neutral-500 mt-2">The admin will update this section with your project's progress.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredTracking.map((phase, index) => (
                        <Card key={phase.id} className="bg-neutral-950 border-amber-900/30">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Status Icon */}
                                    <div className="flex flex-col items-center">
                                        {getStatusIcon(phase.status)}
                                        {index < filteredTracking.length - 1 && (
                                            <div className="w-0.5 h-full bg-neutral-800 mt-2" style={{ minHeight: '40px' }} />
                                        )}
                                    </div>

                                    {/* Phase Details */}
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold text-white">{phase.phase}</h3>
                                                {getStatusBadge(phase.status)}
                                            </div>
                                            <span className="text-amber-400 font-mono text-lg">{phase.progress}%</span>
                                        </div>

                                        <Progress value={phase.progress} className="h-2 mt-3 bg-neutral-800" />

                                        {phase.notes && (
                                            <p className="text-neutral-400 mt-3 text-sm">{phase.notes}</p>
                                        )}

                                        <div className="flex gap-4 mt-3 text-xs text-neutral-500">
                                            {phase.start_date && (
                                                <span>Started: {new Date(phase.start_date).toLocaleDateString()}</span>
                                            )}
                                            {phase.end_date && (
                                                <span>Completed: {new Date(phase.end_date).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
