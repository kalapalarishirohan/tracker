import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Search,
  ClipboardList,
  Code2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Send,
  Trash2,
  Calendar,
  RefreshCw,
  MoreHorizontal,
  FolderGit2
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAdminDevelopers, useAdminAssignments, AdminAssignment } from "@/hooks/useAdminDevelopers";
import { useProjects } from "@/hooks/useDatabase";

export default function DeveloperManagement() {
  const { developers, loading: devsLoading, fetchDevelopers } = useAdminDevelopers();
  const { assignments, loading: assignmentsLoading, createAssignment, updateAssignmentStatus, deleteAssignment } = useAdminAssignments();
  const { projects } = useProjects();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDev, setFilterDev] = useState<string>("all");

  const [newTask, setNewTask] = useState({
    developer_id: "",
    project_id: "",
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.developer_id || !newTask.title.trim()) {
      toast.error("Required fields missing", { description: "Select a developer and provide a task title." });
      return;
    }

    setIsSubmitting(true);

    const result = await createAssignment({
      developer_id: newTask.developer_id,
      project_id: newTask.project_id && newTask.project_id !== "none" ? newTask.project_id : null,
      title: newTask.title.trim(),
      description: newTask.description.trim() || null,
      priority: newTask.priority,
      due_date: newTask.due_date || null,
    });

    setIsSubmitting(false);

    if (result) {
      toast.success("Task Assigned", { description: `"${newTask.title}" has been assigned successfully.` });
      setIsCreateDialogOpen(false);
      setNewTask({ developer_id: "", project_id: "", title: "", description: "", priority: "medium", due_date: "" });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const success = await updateAssignmentStatus(id, status);
    if (success) {
      toast.success("Status Updated");
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteAssignment(id);
    if (success) {
      toast.success("Assignment Deleted");
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.developer?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDev = filterDev === "all" || a.developer_id === filterDev;
    return matchesSearch && matchesDev;
  });

  // Stats
  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const inProgressCount = assignments.filter(a => a.status === 'in-progress').length;
  const completedCount = assignments.filter(a => a.status === 'completed').length;

  const getPriorityStyle = (priority: string | null) => {
    switch (priority) {
      case 'urgent': return "border-red-900 text-red-500 bg-red-950/20";
      case 'high': return "border-orange-900 text-orange-500 bg-orange-950/20";
      case 'medium': return "border-amber-900 text-amber-500 bg-amber-950/20";
      case 'low': return "border-blue-900 text-blue-500 bg-blue-950/20";
      default: return "border-neutral-800 text-neutral-500";
    }
  };

  const getStatusStyle = (status: string | null) => {
    switch (status) {
      case 'completed': return "border-emerald-900 text-emerald-500 bg-emerald-950/20";
      case 'in-progress': return "border-blue-900 text-blue-400 bg-blue-950/20";
      case 'pending': return "border-neutral-700 text-neutral-300 bg-neutral-800";
      case 'on-hold': return "border-amber-900 text-amber-500 bg-amber-950/20";
      default: return "border-neutral-800 text-neutral-500";
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'in-progress': return <Clock className="w-3.5 h-3.5 text-blue-400" />;
      case 'pending': return <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />;
      default: return <Clock className="w-3.5 h-3.5 text-neutral-500" />;
    }
  };

  if (devsLoading || assignmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-normal tracking-tight text-white">Developer Operations</h1>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
            <Code2 className="w-3 h-3" />
            <span>Task Assignment & Team Management</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => { fetchDevelopers(); }}
            className="h-9 bg-transparent border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 text-xs font-mono uppercase tracking-wider rounded-xl"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Sync
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="h-9 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold uppercase tracking-wider px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Assign Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#0A0A0A] border-neutral-800 rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Developers</span>
              <div className="text-2xl font-medium text-white">{developers.length}</div>
            </div>
            <div className="p-2 rounded-full border border-purple-900/50 bg-purple-950/20 text-purple-500">
              <Users className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0A0A0A] border-neutral-800 rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Pending</span>
              <div className="text-2xl font-medium text-white">{pendingCount}</div>
            </div>
            <div className="p-2 rounded-full border border-neutral-700 bg-neutral-800 text-neutral-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0A0A0A] border-neutral-800 rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">In Progress</span>
              <div className="text-2xl font-medium text-white">{inProgressCount}</div>
            </div>
            <div className="p-2 rounded-full border border-blue-900/50 bg-blue-950/20 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0A0A0A] border-neutral-800 rounded-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Completed</span>
              <div className="text-2xl font-medium text-white">{completedCount}</div>
            </div>
            <div className="p-2 rounded-full border border-emerald-900/50 bg-emerald-950/20 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Developer Team Grid */}
      <div>
        <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-500" />
          Developer Team
        </h2>
        {developers.length === 0 ? (
          <Card className="bg-[#0A0A0A] border-neutral-800 rounded-xl">
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500">No developers registered yet</p>
              <p className="text-xs text-neutral-600 mt-1">Developers can sign up via the Developer Portal</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {developers.map((dev) => {
              const devAssignments = assignments.filter(a => a.developer_id === dev.id);
              const devPending = devAssignments.filter(a => a.status === 'pending').length;
              const devActive = devAssignments.filter(a => a.status === 'in-progress').length;
              return (
                <Card key={dev.id} className="bg-[#0A0A0A] border-neutral-800 rounded-xl hover:border-purple-500/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-medium shrink-0">
                        {dev.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{dev.name}</h3>
                        <p className="text-xs text-neutral-500 truncate">{dev.email}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-purple-400 font-mono uppercase">{dev.specialty || 'Developer'}</span>
                          <div className={`w-2 h-2 rounded-full ${dev.status === 'active' ? 'bg-green-500' : dev.status === 'busy' ? 'bg-yellow-500' : 'bg-neutral-500'}`} />
                        </div>
                        <div className="flex gap-3 mt-3 text-[10px] font-mono text-neutral-600">
                          <span>{devPending} pending</span>
                          <span>{devActive} active</span>
                          <span>{devAssignments.length} total</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Assignments Table */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            All Assignments
          </h2>
          <div className="flex gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
              <Input
                placeholder="SEARCH TASKS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#0A0A0A] border-neutral-800 rounded-xl text-xs font-mono placeholder:text-neutral-700 focus:ring-0 focus:border-white transition-colors h-9 w-56"
              />
            </div>
            <Select value={filterDev} onValueChange={setFilterDev}>
              <SelectTrigger className="h-9 w-44 bg-[#0A0A0A] border-neutral-800 text-xs font-mono rounded-xl">
                <SelectValue placeholder="All Developers" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                <SelectItem value="all">All Developers</SelectItem>
                {developers.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="bg-[#0A0A0A] border-neutral-800 rounded-xl overflow-hidden shadow-none">
          <CardHeader className="border-b border-neutral-900 py-3 px-6 bg-neutral-950/30">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <ClipboardList className="w-3 h-3" />
                Assignment Log
              </CardTitle>
              <span className="text-[10px] font-mono text-neutral-600">
                {filteredAssignments.length} OF {assignments.length} RECORDS
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredAssignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-neutral-900/50 rounded-full flex items-center justify-center border border-neutral-800">
                  <ClipboardList className="w-8 h-8 text-neutral-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-white tracking-wide uppercase">No Assignments</h3>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Use the "Assign Task" button to create new developer assignments.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-neutral-900">
                {filteredAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 hover:bg-neutral-900/30 transition-colors group">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {getStatusIcon(assignment.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-neutral-200 group-hover:text-white transition-colors truncate">
                            {assignment.title}
                          </h3>
                          <Badge variant="outline" className={`text-[10px] font-mono uppercase tracking-widest px-1.5 py-0 border ${getPriorityStyle(assignment.priority)}`}>
                            {assignment.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-purple-400 font-mono">
                            {assignment.developer?.name || 'Unknown'}
                          </span>
                          {assignment.project && (
                            <span className="text-xs text-neutral-600 flex items-center gap-1">
                              <FolderGit2 className="w-3 h-3" />
                              {assignment.project.title}
                            </span>
                          )}
                          {assignment.due_date && (
                            <span className="text-xs text-neutral-600 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(assignment.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {assignment.description && (
                          <p className="text-xs text-neutral-600 mt-1 line-clamp-1">{assignment.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <Select
                        defaultValue={assignment.status || 'pending'}
                        onValueChange={(v) => handleStatusChange(assignment.id, v)}
                      >
                        <SelectTrigger className={`w-[120px] h-7 text-[10px] uppercase font-bold tracking-wider rounded-md border transition-all ${getStatusStyle(assignment.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                          <SelectItem value="pending" className="text-xs">Pending</SelectItem>
                          <SelectItem value="in-progress" className="text-xs">In Progress</SelectItem>
                          <SelectItem value="completed" className="text-xs">Completed</SelectItem>
                          <SelectItem value="on-hold" className="text-xs">On Hold</SelectItem>
                        </SelectContent>
                      </Select>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-neutral-500 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800">
                          <DropdownMenuItem
                            onClick={() => handleDelete(assignment.id)}
                            className="text-red-400 focus:text-red-300 focus:bg-red-950/50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Assignment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-[#050505] border-neutral-800 text-white sm:max-w-[550px] p-0 overflow-hidden rounded-xl">
          <DialogHeader className="p-6 border-b border-neutral-900 bg-neutral-950/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-purple-900/30 rounded border border-purple-800/50">
                <Send className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">CMD: ASSIGN_TASK</span>
            </div>
            <DialogTitle className="text-xl font-medium tracking-tight">Assign Task to Developer</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="p-6 space-y-5">
            {/* Developer Selection */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Assign To *</Label>
              <Select value={newTask.developer_id} onValueChange={(v) => setNewTask({ ...newTask, developer_id: v })}>
                <SelectTrigger className="bg-neutral-900/50 border-neutral-800 focus:border-white transition-colors rounded-xl h-11">
                  <SelectValue placeholder="Select developer" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                  {developers.map(dev => (
                    <SelectItem key={dev.id} value={dev.id} className="focus:bg-neutral-800 focus:text-white cursor-pointer">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 text-[10px] font-bold">
                          {dev.name.charAt(0)}
                        </span>
                        {dev.name} — {dev.specialty || 'Developer'}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Task Title */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Task Title *</Label>
              <Input
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="e.g. Implement user auth flow"
                className="bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-xl h-11"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Description</Label>
              <Textarea
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Detailed requirements and expectations..."
                className="bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-xl resize-none min-h-[80px]"
              />
            </div>

            {/* Priority, Project, Due Date */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Priority</Label>
                <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v })}>
                  <SelectTrigger className="bg-neutral-900/50 border-neutral-800 focus:border-white transition-colors rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Project</Label>
                <Select value={newTask.project_id} onValueChange={(v) => setNewTask({ ...newTask, project_id: v })}>
                  <SelectTrigger className="bg-neutral-900/50 border-neutral-800 focus:border-white transition-colors rounded-xl h-11">
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                    <SelectItem value="none">No project</SelectItem>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-500">Due Date</Label>
                <Input
                  type="date"
                  value={newTask.due_date}
                  onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-xl h-11 text-neutral-300"
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-neutral-200 text-black font-bold tracking-wider rounded-xl h-12 uppercase text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ASSIGNING...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Assign Task
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
