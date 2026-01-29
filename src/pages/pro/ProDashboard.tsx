import { useClientStore } from "@/store/clientStore";
import { useClientAssets, useDevTracking, useApproachPlans } from "@/hooks/useProClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, Image, FileText, Video, Link as LinkIcon, Smartphone, Globe, Map, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ProDashboard() {
    const currentClient = useClientStore((state) => state.currentClient);
    const { assets } = useClientAssets(currentClient?.id);
    const { tracking } = useDevTracking(currentClient?.id);
    const { plans } = useApproachPlans(currentClient?.id);

    if (!currentClient) return null;

    const assetStats = {
        images: assets.filter(a => a.type === 'image').length,
        videos: assets.filter(a => a.type === 'video').length,
        documents: assets.filter(a => a.type === 'document').length,
        links: assets.filter(a => a.type === 'link').length,
    };

    const appTracking = tracking.filter(t => t.project_type === 'app');
    const webTracking = tracking.filter(t => t.project_type === 'web');

    const calculateProgress = (items: typeof tracking) => {
        if (items.length === 0) return 0;
        return Math.round(items.reduce((acc, t) => acc + t.progress, 0) / items.length);
    };

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome back, {currentClient.name}
                        </h1>
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold">
                            <Crown className="w-3 h-3 mr-1" />
                            PRO
                        </Badge>
                    </div>
                    <p className="text-amber-200/70">
                        Your premium dashboard for tracking assets, development progress, and strategic plans.
                    </p>
                </div>
                <span className="text-sm text-amber-200/50 font-mono">
                    ID: {currentClient.assigned_id}
                </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-950/50 to-blue-900/20 border-blue-800/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <Image className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{assetStats.images}</p>
                                <p className="text-xs text-blue-300/70">Images</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-950/50 to-purple-900/20 border-purple-800/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <Video className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{assetStats.videos}</p>
                                <p className="text-xs text-purple-300/70">Videos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-950/50 to-green-900/20 border-green-800/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/20">
                                <FileText className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{assetStats.documents}</p>
                                <p className="text-xs text-green-300/70">Documents</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-950/50 to-orange-900/20 border-orange-800/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500/20">
                                <LinkIcon className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{assetStats.links}</p>
                                <p className="text-xs text-orange-300/70">Links</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Development Progress */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* App Development */}
                <Card className="bg-neutral-950 border-amber-900/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Smartphone className="w-5 h-5 text-amber-400" />
                            App Development
                        </CardTitle>
                        <Link to="/pro/portal/app-tracking">
                            <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-amber-200/70">Overall Progress</span>
                                <span className="text-amber-400 font-mono">{calculateProgress(appTracking)}%</span>
                            </div>
                            <Progress value={calculateProgress(appTracking)} className="h-2 bg-amber-950" />
                            <div className="text-sm text-neutral-400">
                                {appTracking.length === 0 ? (
                                    <p>No phases tracked yet</p>
                                ) : (
                                    <p>{appTracking.filter(t => t.status === 'completed').length} of {appTracking.length} phases completed</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Web Development */}
                <Card className="bg-neutral-950 border-amber-900/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Globe className="w-5 h-5 text-amber-400" />
                            Web Development
                        </CardTitle>
                        <Link to="/pro/portal/web-tracking">
                            <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-amber-200/70">Overall Progress</span>
                                <span className="text-amber-400 font-mono">{calculateProgress(webTracking)}%</span>
                            </div>
                            <Progress value={calculateProgress(webTracking)} className="h-2 bg-amber-950" />
                            <div className="text-sm text-neutral-400">
                                {webTracking.length === 0 ? (
                                    <p>No phases tracked yet</p>
                                ) : (
                                    <p>{webTracking.filter(t => t.status === 'completed').length} of {webTracking.length} phases completed</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Approach Plans */}
            <Card className="bg-neutral-950 border-amber-900/30">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Map className="w-5 h-5 text-amber-400" />
                        Approach Plans
                    </CardTitle>
                    <Link to="/pro/portal/approach-plans">
                        <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {plans.length === 0 ? (
                        <p className="text-neutral-400">No approach plans available yet. Check back soon!</p>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plans.slice(0, 3).map(plan => (
                                <div key={plan.id} className="p-4 rounded-lg border border-amber-900/20 bg-amber-950/10">
                                    <h4 className="font-medium text-white mb-1">{plan.title}</h4>
                                    <p className="text-sm text-amber-200/50 line-clamp-2">{plan.description}</p>
                                    {plan.is_protected && (
                                        <Badge variant="outline" className="mt-2 text-amber-400 border-amber-400/30">
                                            Protected
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
