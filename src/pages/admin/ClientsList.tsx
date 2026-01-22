import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, Plus, Search, Terminal, Hash, Building2, Mail, CreditCard, RefreshCw, Loader2, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { useClients, useProjects, DbClient } from "@/hooks/useDatabase";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

export default function ClientsList() {
    const { clients, loading, addClient, fetchClients } = useClients();
    const { projects } = useProjects();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClient, setSelectedClient] = useState<DbClient | null>(null);
    const [newClient, setNewClient] = useState({
        name: "",
        email: "",
        company: "",
        assigned_id: "RED-" + Math.floor(1000 + Math.random() * 9000),
    });
    const [editClient, setEditClient] = useState({
        name: "",
        email: "",
        company: "",
        assigned_id: "",
    });

    // Helper to regen ID
    const generateId = () => {
        setNewClient(prev => ({ ...prev, assigned_id: "RED-" + Math.floor(1000 + Math.random() * 9000) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClient.name || !newClient.assigned_id) {
            toast.error("Required Fields Missing", { description: "Client Name and ID are mandatory." });
            return;
        }

        setIsSubmitting(true);

        const result = await addClient({
            name: newClient.name,
            email: newClient.email,
            company: newClient.company || null,
            assigned_id: newClient.assigned_id,
        });

        setIsSubmitting(false);

        if (result) {
            toast.success("Database Updated", { description: `Client ${newClient.name} added successfully.` });
            setIsDialogOpen(false);
            setNewClient({
                name: "",
                email: "",
                company: "",
                assigned_id: "RED-" + Math.floor(1000 + Math.random() * 9000),
            });
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient || !editClient.name || !editClient.assigned_id) {
            toast.error("Required Fields Missing");
            return;
        }

        setIsSubmitting(true);

        const { error } = await supabase
            .from('clients')
            .update({
                name: editClient.name,
                email: editClient.email,
                company: editClient.company || null,
                assigned_id: editClient.assigned_id,
            })
            .eq('id', selectedClient.id);

        setIsSubmitting(false);

        if (error) {
            toast.error("Update Failed", { description: error.message });
        } else {
            toast.success("Client Updated", { description: `${editClient.name} updated successfully.` });
            setIsEditDialogOpen(false);
            fetchClients();
        }
    };

    const handleDelete = async () => {
        if (!selectedClient) return;

        setIsSubmitting(true);

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', selectedClient.id);

        setIsSubmitting(false);

        if (error) {
            toast.error("Delete Failed", { description: error.message });
        } else {
            toast.success("Client Deleted", { description: `${selectedClient.name} removed from database.` });
            setIsDeleteDialogOpen(false);
            fetchClients();
        }
    };

    const openEditDialog = (client: DbClient) => {
        setSelectedClient(client);
        setEditClient({
            name: client.name,
            email: client.email,
            company: client.company || "",
            assigned_id: client.assigned_id,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (client: DbClient) => {
        setSelectedClient(client);
        setIsDeleteDialogOpen(true);
    };

    // Get project count for each client
    const getProjectCount = (clientId: string) => {
        return projects.filter(p => p.client_id === clientId).length;
    };

    // Filter logic
    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.assigned_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white mb-2">
                        Client Registry
                    </h1>
                    <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
                        Database // Access Control List
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
                        <Input 
                            placeholder="SEARCH DATABASE..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 bg-[#0A0A0A] border-neutral-800 rounded-sm text-xs font-mono text-white placeholder:text-neutral-700 focus:ring-0 focus:border-white transition-colors"
                        />
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-white hover:bg-neutral-200 text-black rounded-sm text-xs font-bold uppercase tracking-wider px-6">
                                <Plus className="w-4 h-4 mr-2" />
                                New Record
                            </Button>
                        </DialogTrigger>
                        
                        {/* --- CREATE MODAL --- */}
                        <DialogContent className="bg-[#050505] border-neutral-800 text-white sm:max-w-[500px] p-0 overflow-hidden">
                            <DialogHeader className="p-6 border-b border-neutral-900 bg-neutral-950/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1 bg-neutral-900 rounded border border-neutral-800">
                                        <Terminal className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-[10px] font-mono text-neutral-500 uppercase">CMD: CREATE_ENTRY</span>
                                </div>
                                <DialogTitle className="text-xl font-medium tracking-tight">Initialize Client</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Legal Entity Name</Label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                            <Input
                                                value={newClient.name}
                                                onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                                                placeholder="e.g. Acme Industries Ltd."
                                                className="pl-10 bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Corporate Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                            <Input
                                                value={newClient.email}
                                                onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                                                placeholder="contact@company.com"
                                                className="pl-10 bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Company</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                            <Input
                                                value={newClient.company}
                                                onChange={e => setNewClient({ ...newClient, company: e.target.value })}
                                                placeholder="Optional"
                                                className="pl-10 bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest text-neutral-500">System ID</Label>
                                        <div className="relative flex gap-2">
                                            <div className="relative flex-1">
                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                                <Input
                                                    value={newClient.assigned_id}
                                                    onChange={e => setNewClient({ ...newClient, assigned_id: e.target.value })}
                                                    className="pl-10 bg-neutral-900/50 border-neutral-800 font-mono text-emerald-500 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                                />
                                            </div>
                                            <Button type="button" variant="outline" onClick={generateId} className="h-11 px-3 border-neutral-800 hover:bg-neutral-800 hover:text-white">
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full bg-white hover:bg-neutral-200 text-black font-bold tracking-wider rounded-sm h-12"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                PROCESSING...
                                            </>
                                        ) : (
                                            'EXECUTE SEQUENCE'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-[#050505] border-neutral-800 text-white sm:max-w-[500px] p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b border-neutral-900 bg-neutral-950/50">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1 bg-neutral-900 rounded border border-neutral-800">
                                <Pencil className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">CMD: UPDATE_ENTRY</span>
                        </div>
                        <DialogTitle className="text-xl font-medium tracking-tight">Modify Client</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Legal Entity Name</Label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <Input
                                        value={editClient.name}
                                        onChange={e => setEditClient({ ...editClient, name: e.target.value })}
                                        placeholder="e.g. Acme Industries Ltd."
                                        className="pl-10 bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Corporate Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <Input
                                        value={editClient.email}
                                        onChange={e => setEditClient({ ...editClient, email: e.target.value })}
                                        placeholder="contact@company.com"
                                        className="pl-10 bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Company</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <Input
                                        value={editClient.company}
                                        onChange={e => setEditClient({ ...editClient, company: e.target.value })}
                                        placeholder="Optional"
                                        className="pl-10 bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-neutral-500">System ID</Label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <Input
                                        value={editClient.assigned_id}
                                        onChange={e => setEditClient({ ...editClient, assigned_id: e.target.value })}
                                        className="pl-10 bg-neutral-900/50 border-neutral-800 font-mono text-emerald-500 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-white hover:bg-neutral-200 text-black font-bold tracking-wider rounded-sm h-12"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        UPDATING...
                                    </>
                                ) : (
                                    'SAVE CHANGES'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-[#050505] border-neutral-800 text-white sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-medium tracking-tight text-red-500">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-neutral-400">
                            Are you sure you want to delete <span className="text-white font-medium">{selectedClient?.name}</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="border-neutral-800 text-neutral-300 hover:bg-neutral-900"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Client'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Data Grid */}
            <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm overflow-hidden">
                <CardHeader className="border-b border-neutral-900 py-4 px-6 flex flex-row items-center justify-between bg-neutral-950/30">
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-neutral-500" />
                        <CardTitle className="text-sm font-medium text-white uppercase tracking-wider">Registered Entities</CardTitle>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-600">TOTAL: {filteredClients.length}</span>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-neutral-900/50">
                            <TableRow className="border-neutral-900 hover:bg-transparent">
                                <TableHead className="w-[150px] font-mono text-[10px] uppercase text-neutral-500 tracking-wider h-10">Access ID</TableHead>
                                <TableHead className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider h-10">Client Name</TableHead>
                                <TableHead className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider h-10">Organization</TableHead>
                                <TableHead className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider h-10">Contact</TableHead>
                                <TableHead className="text-center font-mono text-[10px] uppercase text-neutral-500 tracking-wider h-10">Projects</TableHead>
                                <TableHead className="text-right font-mono text-[10px] uppercase text-neutral-500 tracking-wider h-10">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client) => (
                                    <TableRow key={client.id} className="border-neutral-900 hover:bg-neutral-900/30 transition-colors group">
                                        <TableCell className="font-mono text-xs font-medium text-white group-hover:text-emerald-400 transition-colors">
                                            {client.assigned_id}
                                        </TableCell>
                                        <TableCell className="text-sm text-neutral-300">
                                            {client.name}
                                        </TableCell>
                                        <TableCell className="text-sm text-neutral-400">
                                            {client.company ? (
                                                <span className="flex items-center gap-2">
                                                    <Building2 className="w-3 h-3 text-neutral-600" />
                                                    {client.company}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-700 italic text-xs">--</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-neutral-400 font-mono text-xs">
                                            {client.email}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-sm text-xs font-mono ${
                                                getProjectCount(client.id) > 0 
                                                    ? "bg-neutral-800 text-white border border-neutral-700" 
                                                    : "text-neutral-600"
                                            }`}>
                                                {getProjectCount(client.id)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-500 hover:text-white">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800">
                                                    <DropdownMenuItem 
                                                        onClick={() => openEditDialog(client)}
                                                        className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
                                                    >
                                                        <Pencil className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => openDeleteDialog(client)}
                                                        className="text-red-400 focus:text-red-300 focus:bg-red-950/50 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-neutral-500 border-none">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="w-6 h-6 opacity-20" />
                                            <span className="text-xs font-mono uppercase tracking-widest">No matching records found in database.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}