import { useState } from "react";
import { useClients } from "@/hooks/useDatabase";
import { useClientAssets, useDevTracking, useApproachPlans, DbDevTracking, DbApproachPlan } from "@/hooks/useProClient";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Crown, Users, Image, Smartphone, Globe, Map, Plus, Trash2, Edit, Loader2, CheckCircle } from "lucide-react";

interface DbProClient {
    id: string;
    assigned_id: string;
    name: string;
    email: string;
    company: string | null;
    is_pro: boolean;
}

export default function ProClientsManagement() {
    const { clients, loading: clientsLoading, fetchClients } = useClients();
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("clients");

    const proClients = clients.filter(c => (c as unknown as DbProClient).is_pro);

    const toggleProStatus = async (clientId: string, isPro: boolean) => {
        const { error } = await supabase
            .from('clients')
            .update({ is_pro: isPro })
            .eq('id', clientId);

        if (error) {
            toast.error('Failed to update pro status');
            return;
        }

        toast.success(isPro ? 'Client upgraded to Pro!' : 'Pro status removed');
        fetchClients();
    };

    if (clientsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Crown className="w-6 h-6 text-amber-500" />
                        Pro Clients Management
                    </h1>
                    <p className="text-muted-foreground">Manage Pro clients, their assets, development tracking, and approach plans</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="clients" className="gap-2">
                        <Users className="w-4 h-4" />
                        Pro Clients ({proClients.length})
                    </TabsTrigger>
                    {selectedClientId && (
                        <>
                            <TabsTrigger value="assets" className="gap-2">
                                <Image className="w-4 h-4" />
                                Assets
                            </TabsTrigger>
                            <TabsTrigger value="tracking" className="gap-2">
                                <Smartphone className="w-4 h-4" />
                                Dev Tracking
                            </TabsTrigger>
                            <TabsTrigger value="plans" className="gap-2">
                                <Map className="w-4 h-4" />
                                Approach Plans
                            </TabsTrigger>
                        </>
                    )}
                </TabsList>

                <TabsContent value="clients" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Clients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.map((client) => {
                                        const proClient = client as unknown as DbProClient;
                                        return (
                                            <TableRow key={client.id}>
                                                <TableCell className="font-mono">{client.assigned_id}</TableCell>
                                                <TableCell className="font-medium">{client.name}</TableCell>
                                                <TableCell>{client.email}</TableCell>
                                                <TableCell>{client.company || '-'}</TableCell>
                                                <TableCell>
                                                    {proClient.is_pro ? (
                                                        <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                                                            <Crown className="w-3 h-3 mr-1" />
                                                            PRO
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">Standard</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant={proClient.is_pro ? "destructive" : "default"}
                                                            size="sm"
                                                            onClick={() => toggleProStatus(client.id, !proClient.is_pro)}
                                                        >
                                                            {proClient.is_pro ? 'Remove Pro' : 'Make Pro'}
                                                        </Button>
                                                        {proClient.is_pro && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedClientId(client.id);
                                                                    setActiveTab("assets");
                                                                }}
                                                            >
                                                                Manage
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {selectedClientId && (
                    <>
                        <TabsContent value="assets" className="mt-6">
                            <ClientAssetsManager clientId={selectedClientId} />
                        </TabsContent>

                        <TabsContent value="tracking" className="mt-6">
                            <DevTrackingManager clientId={selectedClientId} />
                        </TabsContent>

                        <TabsContent value="plans" className="mt-6">
                            <ApproachPlansManager clientId={selectedClientId} />
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    );
}

// Assets Manager Component
function ClientAssetsManager({ clientId }: { clientId: string }) {
    const { assets, loading, deleteAsset, fetchAssets } = useClientAssets(clientId);

    if (loading) return <Loader2 className="w-6 h-6 animate-spin" />;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Client Assets ({assets.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {assets.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No assets uploaded by this client yet.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.map((asset) => (
                                <TableRow key={asset.id}>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{asset.type}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{asset.name}</TableCell>
                                    <TableCell className="max-w-xs truncate">{asset.description || '-'}</TableCell>
                                    <TableCell>{new Date(asset.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => window.open(asset.url, '_blank')}>
                                                View
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={async () => {
                                                await deleteAsset(asset.id);
                                                fetchAssets();
                                            }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

// Dev Tracking Manager Component
function DevTrackingManager({ clientId }: { clientId: string }) {
    const { tracking, loading, addTracking, updateTracking, deleteTracking, fetchTracking } = useDevTracking(clientId);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DbDevTracking | null>(null);
    const [formData, setFormData] = useState({
        project_type: 'app' as 'app' | 'web',
        phase: '',
        status: 'pending' as 'pending' | 'in-progress' | 'completed',
        progress: 0,
        notes: '',
    });

    const handleSubmit = async () => {
        if (!formData.phase) {
            toast.error('Please enter a phase name');
            return;
        }

        if (editingItem) {
            await updateTracking(editingItem.id, formData);
            toast.success('Phase updated');
        } else {
            await addTracking({
                client_id: clientId,
                ...formData,
                start_date: formData.status === 'in-progress' ? new Date().toISOString() : null,
                end_date: formData.status === 'completed' ? new Date().toISOString() : null,
            });
            toast.success('Phase added');
        }

        setIsDialogOpen(false);
        setEditingItem(null);
        setFormData({ project_type: 'app', phase: '', status: 'pending', progress: 0, notes: '' });
    };

    const openEdit = (item: DbDevTracking) => {
        setEditingItem(item);
        setFormData({
            project_type: item.project_type,
            phase: item.phase,
            status: item.status,
            progress: item.progress,
            notes: item.notes || '',
        });
        setIsDialogOpen(true);
    };

    if (loading) return <Loader2 className="w-6 h-6 animate-spin" />;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Development Tracking
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            setEditingItem(null);
                            setFormData({ project_type: 'app', phase: '', status: 'pending', progress: 0, notes: '' });
                        }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Phase
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Edit Phase' : 'Add New Phase'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <Label>Project Type</Label>
                                <Select value={formData.project_type} onValueChange={(v: 'app' | 'web') => setFormData({ ...formData, project_type: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="app">App Development</SelectItem>
                                        <SelectItem value="web">Web Development</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Phase Name</Label>
                                <Input value={formData.phase} onChange={(e) => setFormData({ ...formData, phase: e.target.value })} placeholder="e.g., UI Design, Backend API" />
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(v: typeof formData.status) => setFormData({ ...formData, status: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Progress ({formData.progress}%)</Label>
                                <Input type="range" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <Label>Notes</Label>
                                <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Optional notes..." />
                            </div>
                            <Button onClick={handleSubmit} className="w-full">
                                {editingItem ? 'Update Phase' : 'Add Phase'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {tracking.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No development phases added yet.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Phase</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tracking.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {item.project_type === 'app' ? <Smartphone className="w-3 h-3 mr-1" /> : <Globe className="w-3 h-3 mr-1" />}
                                            {item.project_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.phase}</TableCell>
                                    <TableCell>
                                        <Badge className={
                                            item.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                                            item.status === 'in-progress' ? 'bg-amber-500/20 text-amber-600' :
                                            'bg-neutral-500/20 text-neutral-600'
                                        }>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.progress}%</TableCell>
                                    <TableCell className="max-w-xs truncate">{item.notes || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => deleteTracking(item.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

// Approach Plans Manager Component
function ApproachPlansManager({ clientId }: { clientId: string }) {
    const { plans, loading, addPlan, updatePlan, deletePlan } = useApproachPlans(clientId);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        is_protected: true,
    });

    const handleSubmit = async () => {
        if (!formData.title) {
            toast.error('Please enter a title');
            return;
        }

        await addPlan({
            client_id: clientId,
            title: formData.title,
            description: formData.description || null,
            plan_data: {},
            image_url: formData.image_url || null,
            is_protected: formData.is_protected,
        });

        toast.success('Plan added');
        setIsDialogOpen(false);
        setFormData({ title: '', description: '', image_url: '', is_protected: true });
    };

    if (loading) return <Loader2 className="w-6 h-6 animate-spin" />;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Approach Plans
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Approach Plan</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Plan title" />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Plan description..." />
                            </div>
                            <div>
                                <Label>Image URL (e.g., Excalidraw export)</Label>
                                <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_protected"
                                    checked={formData.is_protected}
                                    onChange={(e) => setFormData({ ...formData, is_protected: e.target.checked })}
                                />
                                <Label htmlFor="is_protected">Protected (confidential)</Label>
                            </div>
                            <Button onClick={handleSubmit} className="w-full">Add Plan</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {plans.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No approach plans added yet.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Protected</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plans.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">{plan.title}</TableCell>
                                    <TableCell className="max-w-xs truncate">{plan.description || '-'}</TableCell>
                                    <TableCell>
                                        {plan.is_protected ? (
                                            <Badge className="bg-amber-500/20 text-amber-600">Protected</Badge>
                                        ) : (
                                            <Badge variant="outline">Public</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{new Date(plan.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {plan.image_url && (
                                                <Button size="sm" variant="outline" onClick={() => window.open(plan.image_url!, '_blank')}>
                                                    View
                                                </Button>
                                            )}
                                            <Button size="sm" variant="destructive" onClick={() => deletePlan(plan.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
