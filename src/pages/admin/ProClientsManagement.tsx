import { useState, useRef } from "react";
import { useClients } from "@/hooks/useDatabase";
import { useClientAssets, useDevTracking, useApproachPlans, DbDevTracking, DbApproachPlan } from "@/hooks/useProClient";
import { useClientDomains, DbClientDomain } from "@/hooks/useClientDomains";
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
import { Crown, Users, Image, Smartphone, Globe, Map, Plus, Trash2, Edit, Loader2, CheckCircle, Upload, Link2, ExternalLink, ChevronRight } from "lucide-react";

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
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">Initializing Portfolio...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-light selection:bg-amber-500/30">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                            <Crown className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-normal tracking-tight">Pro Portfolio</h1>
                    </div>
                    <p className="text-neutral-500 text-sm ml-1">
                        High-value client management and secure asset control.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Badge variant="outline" className="border-neutral-800 px-4 py-2 rounded-xl bg-neutral-900/50">
                        <span className="text-amber-500 font-bold mr-2">{proClients.length}</span>
                        <span className="text-neutral-400 text-[10px] uppercase tracking-widest">Active Pro Tiers</span>
                    </Badge>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-[#0A0A0A] border border-neutral-800 p-1 h-auto rounded-2xl flex-wrap justify-start">
                    <TabsTrigger value="clients" className="rounded-xl px-6 py-2.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-black transition-all">
                        <Users className="w-4 h-4 mr-2" />
                        Directory
                    </TabsTrigger>
                    {selectedClientId && (
                        <>
                            <div className="w-px h-6 bg-neutral-800 mx-2 self-center hidden md:block" />
                            <TabsTrigger value="assets" className="rounded-xl px-6 py-2.5 text-xs font-medium data-[state=active]:bg-amber-500 data-[state=active]:text-black transition-all">
                                <Image className="w-4 h-4 mr-2" />
                                Assets
                            </TabsTrigger>
                            <TabsTrigger value="tracking" className="rounded-xl px-6 py-2.5 text-xs font-medium data-[state=active]:bg-amber-500 data-[state=active]:text-black transition-all">
                                <Smartphone className="w-4 h-4 mr-2" />
                                Dev Pulse
                            </TabsTrigger>
                            <TabsTrigger value="plans" className="rounded-xl px-6 py-2.5 text-xs font-medium data-[state=active]:bg-amber-500 data-[state=active]:text-black transition-all">
                                <Map className="w-4 h-4 mr-2" />
                                Strategy
                            </TabsTrigger>
                            <TabsTrigger value="domains" className="rounded-xl px-6 py-2.5 text-xs font-medium data-[state=active]:bg-amber-500 data-[state=active]:text-black transition-all">
                                <Link2 className="w-4 h-4 mr-2" />
                                Endpoints
                            </TabsTrigger>
                        </>
                    )}
                </TabsList>

                <TabsContent value="clients">
                    <Card className="bg-[#0A0A0A] border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
                        <Table>
                            <TableHeader className="bg-black/40">
                                <TableRow className="border-neutral-800 hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-5">Assigned ID</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500">Client Details</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500">Company</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 text-right">Portfolio Status</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 text-right pr-8">Command</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map((client) => {
                                    const proClient = client as unknown as DbProClient;
                                    const isSelected = selectedClientId === client.id;
                                    return (
                                        <TableRow key={client.id} className={`border-neutral-800 transition-colors ${isSelected ? 'bg-amber-500/[0.03]' : 'hover:bg-white/[0.01]'}`}>
                                            <TableCell className="font-mono text-xs text-neutral-400">{client.assigned_id}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-normal text-white">{client.name}</span>
                                                    <span className="text-xs text-neutral-500">{client.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-neutral-400">{client.company || '—'}</TableCell>
                                            <TableCell className="text-right">
                                                {proClient.is_pro ? (
                                                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-bold tracking-[0.2em] px-3 py-1 rounded-lg border">PRO_TIER</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-neutral-600 border-neutral-800 text-[9px] tracking-widest px-3 py-1 rounded-lg">STANDARD</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleProStatus(client.id, !proClient.is_pro)}
                                                        className={`h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${proClient.is_pro ? 'text-red-500 hover:bg-red-500/10' : 'text-blue-500 hover:bg-blue-500/10'}`}
                                                    >
                                                        {proClient.is_pro ? 'Downgrade' : 'Upgrade'}
                                                    </Button>
                                                    {proClient.is_pro && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedClientId(client.id);
                                                                setActiveTab("assets");
                                                            }}
                                                            className={`h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'bg-amber-500 text-black' : 'bg-white text-black hover:bg-neutral-200'}`}
                                                        >
                                                            Manage <ChevronRight className="w-3 h-3 ml-1" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {selectedClientId && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TabsContent value="assets"><ClientAssetsManager clientId={selectedClientId} /></TabsContent>
                        <TabsContent value="tracking"><DevTrackingManager clientId={selectedClientId} /></TabsContent>
                        <TabsContent value="plans"><ApproachPlansManager clientId={selectedClientId} /></TabsContent>
                        <TabsContent value="domains"><DomainsManager clientId={selectedClientId} /></TabsContent>
                    </div>
                )}
            </Tabs>
        </div>
    );
}

/** 
 * Sub-Component: Assets Manager
 * Logic preserved. UI upgraded to Card + Grid/Table mix.
 */
function ClientAssetsManager({ clientId }: { clientId: string }) {
    const { assets, loading, deleteAsset, fetchAssets } = useClientAssets(clientId);
    if (loading) return <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mt-20" />;

    return (
        <Card className="bg-[#0A0A0A] border-neutral-800 rounded-2xl overflow-hidden shadow-none">
            <CardHeader className="border-b border-neutral-900 bg-neutral-950/40 p-6">
                <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                    <Image className="w-4 h-4" />
                    Encrypted Assets Repository ({assets.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {assets.length === 0 ? (
                    <EmptyState icon={Image} label="No Assets Linked" />
                ) : (
                    <Table>
                        <TableBody>
                            {assets.map((asset) => (
                                <TableRow key={asset.id} className="hover:bg-white/[0.01] border-neutral-900">
                                    <TableCell className="w-20 pl-8">
                                        <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-neutral-800">
                                            <Image className="w-4 h-4 text-neutral-500" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{asset.name}</span>
                                            <span className="text-xs text-neutral-500">{asset.description || 'No description provided'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[9px] rounded-lg border-neutral-800 text-neutral-400">{asset.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="outline" onClick={() => window.open(asset.url, '_blank')} className="h-9 px-4 rounded-xl text-xs border-neutral-800 hover:bg-neutral-900">
                                                <ExternalLink className="w-3.5 h-3.5 mr-2" /> Open
                                            </Button>
                                            <Button size="sm" onClick={async () => { await deleteAsset(asset.id); fetchAssets(); }} className="h-9 w-9 p-0 rounded-xl bg-red-950/20 text-red-500 border border-red-900/50 hover:bg-red-500 hover:text-white">
                                                <Trash2 className="w-3.5 h-3.5" />
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

/** 
 * Sub-Component: Dev Tracking Manager
 * Logic preserved. UI uses modern dialog and status indicators.
 */
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
        if (!formData.phase) { toast.error('Please enter a phase name'); return; }
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

    if (loading) return <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mt-20" />;

    return (
        <Card className="bg-[#0A0A0A] border-neutral-800 rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-900 bg-neutral-950/40 p-6">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Production Pulse
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingItem(null)} className="h-9 px-5 bg-white text-black hover:bg-neutral-200 text-[10px] font-bold uppercase tracking-widest rounded-xl">
                            <Plus className="w-4 h-4 mr-2" /> New Phase
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0A0A0A] border-neutral-800 text-white rounded-3xl sm:max-w-[500px]">
                        <DialogHeader><DialogTitle className="text-lg font-normal tracking-tight">{editingItem ? 'Modify Phase' : 'Initialize Phase'}</DialogTitle></DialogHeader>
                        <div className="space-y-5 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase text-neutral-500 ml-1">Stack Type</Label>
                                    <Select value={formData.project_type} onValueChange={(v: 'app' | 'web') => setFormData({ ...formData, project_type: v })}>
                                        <SelectTrigger className="bg-black border-neutral-800 h-12 rounded-xl focus:ring-amber-500">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-900 border-neutral-800">
                                            <SelectItem value="app">Native App</SelectItem>
                                            <SelectItem value="web">Web Platform</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase text-neutral-500 ml-1">Status</Label>
                                    <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                                        <SelectTrigger className="bg-black border-neutral-800 h-12 rounded-xl focus:ring-amber-500">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-900 border-neutral-800">
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase text-neutral-500 ml-1">Phase Title</Label>
                                <Input value={formData.phase} onChange={(e) => setFormData({ ...formData, phase: e.target.value })} placeholder="e.g., Auth Implementation" className="bg-black border-neutral-800 h-12 rounded-xl focus:border-amber-500" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <Label className="text-[10px] uppercase text-neutral-500">Completion</Label>
                                    <span className="text-xs font-mono text-amber-500">{formData.progress}%</span>
                                </div>
                                <Input type="range" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })} className="accent-amber-500 h-2" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase text-neutral-500 ml-1">Development Notes</Label>
                                <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Brief technical summary..." className="bg-black border-neutral-800 rounded-xl min-h-[100px] resize-none focus:border-amber-500" />
                            </div>
                            <Button onClick={handleSubmit} className="w-full bg-amber-500 hover:bg-amber-600 text-black h-14 rounded-2xl font-bold uppercase tracking-widest text-xs mt-4">
                                {editingItem ? 'Confirm Updates' : 'Sync Phase'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-0">
                {tracking.length === 0 ? (
                    <EmptyState icon={Smartphone} label="No Development Data" />
                ) : (
                    <Table>
                        <TableBody>
                            {tracking.map((item) => (
                                <TableRow key={item.id} className="hover:bg-white/[0.01] border-neutral-900 group">
                                    <TableCell className="w-16 pl-8">
                                        {item.project_type === 'app' ? <Smartphone className="w-4 h-4 text-neutral-600" /> : <Globe className="w-4 h-4 text-neutral-600" />}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{item.phase}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-24 h-1 bg-neutral-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-500" style={{ width: `${item.progress}%` }} />
                                                </div>
                                                <span className="text-[10px] font-mono text-neutral-500">{item.progress}%</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-lg border ${item.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                item.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    'bg-neutral-800 text-neutral-500 border-neutral-700'
                                            }`}>
                                            {item.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] text-xs text-neutral-500 truncate">{item.notes || '—'}</TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(item)} className="h-9 w-9 p-0 rounded-xl hover:bg-neutral-900">
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => deleteTracking(item.id)} className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-500/10">
                                                <Trash2 className="w-3.5 h-3.5" />
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

/** 
 * Sub-Component: Strategy/Approach Plans Manager
 * Logic preserved.
 */
function ApproachPlansManager({ clientId }: { clientId: string }) {
    const { plans, loading, addPlan, deletePlan } = useApproachPlans(clientId);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({ title: '', description: '', image_url: '', is_protected: true });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `plans/${clientId}/${Date.now()}.${fileExt}`;
            const { data, error } = await supabase.storage.from('client-assets').upload(fileName, file);
            if (error) throw error;
            const { data: publicUrl } = supabase.storage.from('client-assets').getPublicUrl(data.path);
            setFormData(prev => ({ ...prev, image_url: publicUrl.publicUrl }));
            toast.success('Strategy visual uploaded');
        } catch (error) { toast.error('Upload failed'); } finally { setUploading(false); }
    };

    const handleSubmit = async () => {
        if (!formData.title) { toast.error('Enter title'); return; }
        await addPlan({
            client_id: clientId,
            title: formData.title,
            description: formData.description || null,
            plan_data: {},
            image_url: formData.image_url || null,
            is_protected: formData.is_protected,
        });
        toast.success('Strategy synced');
        setIsDialogOpen(false);
        setFormData({ title: '', description: '', image_url: '', is_protected: true });
    };

    if (loading) return <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mt-20" />;

    return (
        <Card className="bg-[#0A0A0A] border-neutral-800 rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-900 bg-neutral-950/40 p-6">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <Map className="w-4 h-4" /> Strategic Blueprints
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-9 px-5 bg-white text-black hover:bg-neutral-200 text-[10px] font-bold uppercase tracking-widest rounded-xl">
                            <Plus className="w-4 h-4 mr-2" /> New Strategy
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0A0A0A] border-neutral-800 text-white rounded-3xl sm:max-w-[500px]">
                        <DialogHeader><DialogTitle className="text-lg font-normal tracking-tight">Strategy Initialization</DialogTitle></DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase text-neutral-500 ml-1">Blueprint Title</Label>
                                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Project Roadmap v1.0" className="bg-black border-neutral-800 h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase text-neutral-500 ml-1">Executive Summary</Label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="High-level overview..." className="bg-black border-neutral-800 rounded-xl resize-none min-h-[80px]" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase text-neutral-500 ml-1">Visual Architecture</Label>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full h-12 rounded-xl border-neutral-800 border-dashed hover:border-amber-500 transition-colors">
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                    Upload Architecture PNG/JPG
                                </Button>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-black rounded-xl border border-neutral-800">
                                <input type="checkbox" checked={formData.is_protected} onChange={(e) => setFormData({ ...formData, is_protected: e.target.checked })} className="accent-amber-500 w-4 h-4" />
                                <Label className="text-xs text-neutral-400">Mark as strictly confidential</Label>
                            </div>
                            <Button onClick={handleSubmit} disabled={uploading} className="w-full bg-amber-500 hover:bg-amber-600 text-black h-14 rounded-2xl font-bold uppercase tracking-widest text-xs mt-2">
                                Save Strategy
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-0">
                {plans.length === 0 ? (
                    <EmptyState icon={Map} label="No Strategies Drafted" />
                ) : (
                    <Table>
                        <TableBody>
                            {plans.map((plan) => (
                                <TableRow key={plan.id} className="hover:bg-white/[0.01] border-neutral-900 group">
                                    <TableCell className="w-16 pl-8"><Map className="w-4 h-4 text-neutral-600" /></TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{plan.title}</span>
                                            <span className="text-[10px] font-mono text-neutral-600 uppercase mt-0.5">{new Date(plan.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {plan.is_protected ? <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] rounded-lg">CONFIDENTIAL</Badge> : <Badge variant="outline" className="text-[9px] rounded-lg border-neutral-800 text-neutral-500">PUBLIC</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            {plan.image_url && <Button size="sm" variant="outline" onClick={() => window.open(plan.image_url!, '_blank')} className="h-9 rounded-xl text-xs border-neutral-800">View Map</Button>}
                                            <Button size="sm" variant="ghost" onClick={() => deletePlan(plan.id)} className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></Button>
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

/** 
 * Sub-Component: Domains Manager
 * Logic preserved.
 */
function DomainsManager({ clientId }: { clientId: string }) {
    const { domains, loading, addDomain, deleteDomain } = useClientDomains(clientId);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ domain_type: 'core' as 'core' | 'subdomain', name: '', url: '', description: '' });

    const handleSubmit = async () => {
        if (!formData.name || !formData.url) { toast.error('Missing fields'); return; }
        await addDomain({ client_id: clientId, ...formData });
        toast.success('Domain mapped');
        setIsDialogOpen(false);
        setFormData({ domain_type: 'core', name: '', url: '', description: '' });
    };

    if (loading) return <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mt-20" />;

    return (
        <Card className="bg-[#0A0A0A] border-neutral-800 rounded-2xl overflow-hidden shadow-none">
            <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-900 bg-neutral-950/40 p-6">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <Link2 className="w-4 h-4" /> Domain Endpoints
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-9 px-5 bg-white text-black hover:bg-neutral-200 text-[10px] font-bold uppercase tracking-widest rounded-xl">
                            <Plus className="w-4 h-4 mr-2" /> Map Domain
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0A0A0A] border-neutral-800 text-white rounded-3xl sm:max-w-[500px]">
                        <DialogHeader><DialogTitle className="text-lg font-normal tracking-tight">Endpoint Registry</DialogTitle></DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase text-neutral-500 ml-1">Traffic Type</Label>
                                <Select value={formData.domain_type} onValueChange={(v: any) => setFormData({ ...formData, domain_type: v })}>
                                    <SelectTrigger className="bg-black border-neutral-800 h-12 rounded-xl focus:ring-amber-500">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-900 border-neutral-800">
                                        <SelectItem value="core">Primary Root</SelectItem>
                                        <SelectItem value="subdomain">Sub-application</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase text-neutral-500 ml-1">Friendly Name</Label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Staging Server" className="bg-black border-neutral-800 h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase text-neutral-500 ml-1">Destination URL</Label>
                                <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." className="bg-black border-neutral-800 h-12 rounded-xl" />
                            </div>
                            <Button onClick={handleSubmit} className="w-full bg-amber-500 hover:bg-amber-600 text-black h-14 rounded-2xl font-bold uppercase tracking-widest text-xs mt-2">
                                Register Endpoint
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-0">
                {domains.length === 0 ? (
                    <EmptyState icon={Link2} label="No Endpoints Mapped" />
                ) : (
                    <Table>
                        <TableBody>
                            {domains.map((domain) => (
                                <TableRow key={domain.id} className="hover:bg-white/[0.01] border-neutral-900 group">
                                    <TableCell className="w-16 pl-8"><Globe className="w-4 h-4 text-neutral-600" /></TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{domain.name}</span>
                                            <span className="text-[10px] font-mono text-amber-500/60 truncate">{domain.url}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`text-[9px] rounded-lg ${domain.domain_type === 'core' ? 'border-amber-500/30 text-amber-500' : 'border-neutral-800 text-neutral-500'}`}>
                                            {domain.domain_type.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="sm" variant="ghost" onClick={() => window.open(domain.url, '_blank')} className="h-9 w-9 p-0 rounded-xl hover:bg-neutral-900 text-neutral-400 hover:text-white"><ExternalLink className="w-3.5 h-3.5" /></Button>
                                            <Button size="sm" variant="ghost" onClick={() => deleteDomain(domain.id)} className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></Button>
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

/** 
 * Helper: Empty State UI 
 */
function EmptyState({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="h-60 flex flex-col items-center justify-center text-neutral-700 space-y-3">
            <Icon className="w-8 h-8 opacity-10" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{label}</span>
        </div>
    );
}