import { useState, useRef } from "react";
import { useClientStore } from "@/store/clientStore";
import { useClientAssets, DbClientAsset } from "@/hooks/useProClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AssetsPage() {
    const currentClient = useClientStore((state) => state.currentClient);
    const { assets, loading, addAsset, deleteAsset, uploadFile } = useClientAssets(currentClient?.id);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newAsset, setNewAsset] = useState({
        type: 'link' as DbClientAsset['type'],
        name: '',
        url: '',
        description: '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!currentClient) return null;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const url = await uploadFile(file, currentClient.id);
        
        if (url) {
            let type: DbClientAsset['type'] = 'document';
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('video/')) type = 'video';

            await addAsset({
                client_id: currentClient.id,
                type,
                name: file.name,
                url,
                description: null,
                file_size: file.size,
                mime_type: file.type,
            });
            toast.success('File uploaded');
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAddLink = async () => {
        if (!newAsset.name || !newAsset.url) {
            toast.error('Fields required');
            return;
        }
        await addAsset({
            client_id: currentClient.id,
            type: newAsset.type,
            name: newAsset.name,
            url: newAsset.url,
            description: newAsset.description || null,
            file_size: null,
            mime_type: null,
        });
        setNewAsset({ type: 'link', name: '', url: '', description: '' });
        setIsDialogOpen(false);
        toast.success('Asset added');
    };

    const handleDelete = async (assetId: string) => {
        if (confirm('Delete asset?')) {
            await deleteAsset(assetId);
            toast.success('Removed');
        }
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '';
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase">Syncing Library</span>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-12 px-6">
            {/* Action Header */}
            <div className="flex flex-col md:flex-row justify-between items-baseline gap-6 border-b border-zinc-800 pb-12">
                <div className="space-y-1">
                    <h1 className="text-3xl font-light tracking-tight text-white">Library</h1>
                    <p className="text-zinc-500 text-sm">Media and strategic documentation.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Upload File - Enhanced Visibility CSS */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="h-10 px-6 rounded border border-zinc-700 bg-zinc-900/50 text-zinc-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 hover:border-zinc-500 hover:text-white transition-all disabled:opacity-50"
                    >
                        {uploading ? "Processing..." : "Upload File"}
                    </button>

                    {/* New Link Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="h-10 px-6 rounded bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all">
                                New Link
                            </button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-medium text-white tracking-tight">Add Asset</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-5 pt-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500">Category</Label>
                                    <Select value={newAsset.type} onValueChange={(v: any) => setNewAsset({ ...newAsset, type: v })}>
                                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 focus:ring-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            <SelectItem value="link">Link</SelectItem>
                                            <SelectItem value="image">Image URL</SelectItem>
                                            <SelectItem value="video">Video URL</SelectItem>
                                            <SelectItem value="document">Document URL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500">Name</Label>
                                    <Input value={newAsset.name} onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })} className="bg-zinc-900 border-zinc-800 text-zinc-200 focus:ring-0" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500">Source</Label>
                                    <Input value={newAsset.url} onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })} className="bg-zinc-900 border-zinc-800 text-zinc-200 focus:ring-0" />
                                </div>
                                <Button onClick={handleAddLink} className="w-full bg-white text-black hover:bg-zinc-200 text-[10px] font-bold uppercase tracking-widest py-6">
                                    Finalize
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content Filter */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-transparent h-auto p-0 flex gap-8 mb-12 border-none rounded-none overflow-x-auto">
                    {['all', 'image', 'video', 'document', 'link'].map((t) => (
                        <TabsTrigger 
                            key={t}
                            value={t} 
                            className="bg-transparent p-0 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 data-[state=active]:text-white transition-all pb-2"
                        >
                            {t}s
                        </TabsTrigger>
                    ))}
                </TabsList>

                {['all', 'image', 'video', 'document', 'link'].map((tab) => (
                    <TabsContent key={tab} value={tab} className="m-0 focus-visible:outline-none">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {(tab === 'all' ? assets : assets.filter(a => a.type === tab)).map((asset) => (
                                <div key={asset.id} className="group space-y-4">
                                    <div className="aspect-[4/3] bg-zinc-900/50 border border-zinc-800 flex items-center justify-center relative overflow-hidden">
                                        {asset.type === 'image' ? (
                                            <img src={asset.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                                        ) : (
                                            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-700 font-bold">{asset.type}</span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                                                {asset.type} {asset.file_size && `• ${formatFileSize(asset.file_size)}`}
                                            </p>
                                        </div>
                                        <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">{asset.name}</h4>
                                    </div>
                                    <div className="flex gap-4 border-t border-zinc-900 pt-4">
                                        <button onClick={() => window.open(asset.url, '_blank')} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-500">Open</button>
                                        <button onClick={() => handleDelete(asset.id)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 hover:text-red-500">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(tab === 'all' ? assets : assets.filter(a => a.type === tab)).length === 0 && (
                            <div className="py-20 border border-zinc-900 rounded-lg text-center">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Category Empty</p>
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}