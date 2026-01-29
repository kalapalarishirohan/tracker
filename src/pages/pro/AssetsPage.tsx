import { useState, useRef } from "react";
import { useClientStore } from "@/store/clientStore";
import { useClientAssets, DbClientAsset } from "@/hooks/useProClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Image, Video, FileText, Link as LinkIcon, Plus, Trash2, Upload, ExternalLink, Loader2 } from "lucide-react";

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
            toast.success('File uploaded successfully!');
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAddLink = async () => {
        if (!newAsset.name || !newAsset.url) {
            toast.error('Please fill in all required fields');
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
        toast.success('Asset added successfully!');
    };

    const handleDelete = async (assetId: string) => {
        if (confirm('Are you sure you want to delete this asset?')) {
            await deleteAsset(assetId);
            toast.success('Asset deleted');
        }
    };

    const getAssetIcon = (type: string) => {
        switch (type) {
            case 'image': return <Image className="w-5 h-5 text-blue-400" />;
            case 'video': return <Video className="w-5 h-5 text-purple-400" />;
            case 'document': return <FileText className="w-5 h-5 text-green-400" />;
            case 'link': return <LinkIcon className="w-5 h-5 text-orange-400" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
        );
    }

    const filterAssets = (type: string) => assets.filter(a => a.type === type);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Assets Library</h1>
                    <p className="text-amber-200/70">Manage your images, videos, documents, and links</p>
                </div>
                <div className="flex gap-3">
                    {/* File Upload */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-amber-900/50 hover:bg-amber-800/50 text-amber-200"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        Upload File
                    </Button>

                    {/* Add Link Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Link
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-neutral-950 border-amber-900/30">
                            <DialogHeader>
                                <DialogTitle className="text-white">Add New Asset</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <Label className="text-amber-200/70">Type</Label>
                                    <Select
                                        value={newAsset.type}
                                        onValueChange={(v: DbClientAsset['type']) => setNewAsset({ ...newAsset, type: v })}
                                    >
                                        <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="link">Link</SelectItem>
                                            <SelectItem value="image">Image URL</SelectItem>
                                            <SelectItem value="video">Video URL</SelectItem>
                                            <SelectItem value="document">Document URL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-amber-200/70">Name *</Label>
                                    <Input
                                        value={newAsset.name}
                                        onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                                        placeholder="Asset name"
                                        className="bg-neutral-900 border-neutral-800 text-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-amber-200/70">URL *</Label>
                                    <Input
                                        value={newAsset.url}
                                        onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })}
                                        placeholder="https://..."
                                        className="bg-neutral-900 border-neutral-800 text-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-amber-200/70">Description</Label>
                                    <Textarea
                                        value={newAsset.description}
                                        onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                                        placeholder="Optional description..."
                                        className="bg-neutral-900 border-neutral-800 text-white"
                                    />
                                </div>
                                <Button
                                    onClick={handleAddLink}
                                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black"
                                >
                                    Add Asset
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Assets Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-neutral-900 border border-neutral-800">
                    <TabsTrigger value="all" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                        All ({assets.length})
                    </TabsTrigger>
                    <TabsTrigger value="images" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                        Images ({filterAssets('image').length})
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                        Videos ({filterAssets('video').length})
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                        Documents ({filterAssets('document').length})
                    </TabsTrigger>
                    <TabsTrigger value="links" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                        Links ({filterAssets('link').length})
                    </TabsTrigger>
                </TabsList>

                {['all', 'images', 'videos', 'documents', 'links'].map((tab) => (
                    <TabsContent key={tab} value={tab} className="mt-6">
                        {(tab === 'all' ? assets : filterAssets(tab === 'images' ? 'image' : tab === 'videos' ? 'video' : tab === 'documents' ? 'document' : 'link')).length === 0 ? (
                            <Card className="bg-neutral-950 border-amber-900/30">
                                <CardContent className="p-12 text-center">
                                    <p className="text-neutral-400">No {tab === 'all' ? 'assets' : tab} yet. Upload or add some!</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(tab === 'all' ? assets : filterAssets(tab === 'images' ? 'image' : tab === 'videos' ? 'video' : tab === 'documents' ? 'document' : 'link')).map((asset) => (
                                    <Card key={asset.id} className="bg-neutral-950 border-amber-900/30 overflow-hidden">
                                        {/* Preview */}
                                        {asset.type === 'image' && (
                                            <div className="h-40 bg-neutral-900 flex items-center justify-center overflow-hidden">
                                                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        {asset.type === 'video' && (
                                            <div className="h-40 bg-neutral-900 flex items-center justify-center">
                                                <Video className="w-12 h-12 text-purple-400/50" />
                                            </div>
                                        )}
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    {getAssetIcon(asset.type)}
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-medium text-white truncate">{asset.name}</h4>
                                                        {asset.description && (
                                                            <p className="text-sm text-neutral-400 line-clamp-2 mt-1">{asset.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge variant="outline" className="text-xs capitalize border-amber-900/30 text-amber-300">
                                                                {asset.type}
                                                            </Badge>
                                                            {asset.file_size && (
                                                                <span className="text-xs text-neutral-500">{formatFileSize(asset.file_size)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 border-amber-900/30 text-amber-300 hover:bg-amber-900/20"
                                                    onClick={() => window.open(asset.url, '_blank')}
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-1" />
                                                    Open
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-red-900/30 text-red-400 hover:bg-red-900/20"
                                                    onClick={() => handleDelete(asset.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
