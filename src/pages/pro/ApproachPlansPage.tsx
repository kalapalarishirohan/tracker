import { useClientStore } from "@/store/clientStore";
import { useApproachPlans } from "@/hooks/useProClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Map, Lock, Eye, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { DbApproachPlan } from "@/hooks/useProClient";

export default function ApproachPlansPage() {
    const currentClient = useClientStore((state) => state.currentClient);
    const { plans, loading } = useApproachPlans(currentClient?.id);
    const [selectedPlan, setSelectedPlan] = useState<DbApproachPlan | null>(null);

    if (!currentClient) return null;

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
                    <Map className="w-8 h-8 text-amber-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Approach Plans</h1>
                        <p className="text-amber-200/70">Protected strategic plans and flow diagrams for your projects</p>
                    </div>
                </div>
            </div>

            {plans.length === 0 ? (
                <Card className="bg-neutral-950 border-amber-900/30">
                    <CardContent className="p-12 text-center">
                        <Map className="w-16 h-16 text-amber-400/30 mx-auto mb-4" />
                        <p className="text-neutral-400 text-lg">No approach plans available yet</p>
                        <p className="text-sm text-neutral-500 mt-2">
                            Your project manager will upload strategic plans and flow diagrams here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Card key={plan.id} className="bg-neutral-950 border-amber-900/30 overflow-hidden hover:border-amber-700/50 transition-colors">
                            {/* Preview Image */}
                            {plan.image_url ? (
                                <div className="h-48 bg-neutral-900 overflow-hidden">
                                    <img 
                                        src={plan.image_url} 
                                        alt={plan.title} 
                                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            ) : (
                                <div className="h-48 bg-gradient-to-br from-amber-950/30 to-neutral-900 flex items-center justify-center">
                                    <Map className="w-16 h-16 text-amber-400/30" />
                                </div>
                            )}

                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-white text-lg">{plan.title}</h3>
                                    {plan.is_protected && (
                                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                            <Lock className="w-3 h-3 mr-1" />
                                            Protected
                                        </Badge>
                                    )}
                                </div>

                                {plan.description && (
                                    <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{plan.description}</p>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-neutral-500">
                                        {new Date(plan.created_at).toLocaleDateString()}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-amber-900/30 text-amber-300 hover:bg-amber-900/20"
                                        onClick={() => setSelectedPlan(plan)}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Plan Detail Dialog */}
            <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
                <DialogContent className="bg-neutral-950 border-amber-900/30 max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedPlan && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-white flex items-center gap-2">
                                    {selectedPlan.title}
                                    {selectedPlan.is_protected && (
                                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                            <Lock className="w-3 h-3 mr-1" />
                                            Protected
                                        </Badge>
                                    )}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                {selectedPlan.image_url && (
                                    <div className="rounded-lg overflow-hidden border border-amber-900/30">
                                        <img 
                                            src={selectedPlan.image_url} 
                                            alt={selectedPlan.title}
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                {selectedPlan.description && (
                                    <div>
                                        <h4 className="text-sm font-medium text-amber-200/70 mb-2">Description</h4>
                                        <p className="text-neutral-300">{selectedPlan.description}</p>
                                    </div>
                                )}

                                {Object.keys(selectedPlan.plan_data).length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-amber-200/70 mb-2">Plan Details</h4>
                                        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                                            <pre className="text-sm text-neutral-300 whitespace-pre-wrap">
                                                {JSON.stringify(selectedPlan.plan_data, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                <div className="text-xs text-neutral-500 pt-4 border-t border-neutral-800">
                                    Created: {new Date(selectedPlan.created_at).toLocaleString()}
                                    {selectedPlan.updated_at !== selectedPlan.created_at && (
                                        <span className="ml-4">
                                            Updated: {new Date(selectedPlan.updated_at).toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {selectedPlan.image_url && (
                                    <Button
                                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black"
                                        onClick={() => window.open(selectedPlan.image_url!, '_blank')}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open Full Image
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
