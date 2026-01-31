import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    GitBranch, 
    Database, 
    Activity, 
    Terminal,
    Users,
    ClipboardList,
    FolderKanban,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    LogOut
} from "lucide-react";
import { 
    useDeveloperAuth, 
    useDeveloperAssignments, 
    useDevelopers,
    useActiveProjects 
} from "@/hooks/useDeveloperAuth";

export default function DeveloperDashboard() {
    const navigate = useNavigate();
    const { developer, loading: authLoading, signOut, isAuthenticated } = useDeveloperAuth();
    const { assignments, loading: assignmentsLoading } = useDeveloperAssignments(developer?.id);
    const { developers, loading: developersLoading } = useDevelopers();
    const { projects, loading: projectsLoading } = useActiveProjects();

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/developer");
        }
    }, [authLoading, isAuthenticated, navigate]);

    const handleLogout = async () => {
        await signOut();
        navigate("/developer");
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!developer) {
        return null;
    }

    // Calculate stats
    const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
    const inProgressAssignments = assignments.filter(a => a.status === 'in-progress').length;
    const completedAssignments = assignments.filter(a => a.status === 'completed').length;
    const activeDevelopers = developers.filter(d => d.status === 'active').length;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'in-progress': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'pending': return <AlertCircle className="w-4 h-4 text-neutral-500" />;
            default: return <Clock className="w-4 h-4 text-neutral-500" />;
        }
    };

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
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{developer.name}</p>
                            <p className="text-xs text-neutral-500">{developer.specialty || 'Developer'}</p>
                        </div>
                        <Button 
                            variant="ghost" 
                            onClick={handleLogout}
                            className="text-neutral-400 hover:text-white"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Log out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-3xl font-normal mb-2">
                        Welcome back, <span className="text-purple-400">{developer.name.split(' ')[0]}</span>
                    </h1>
                    <p className="text-neutral-500">Here's your development overview and assigned tasks.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={ClipboardList}
                        title="Pending Tasks"
                        value={pendingAssignments}
                        color="purple"
                    />
                    <StatCard
                        icon={Activity}
                        title="In Progress"
                        value={inProgressAssignments}
                        color="yellow"
                    />
                    <StatCard
                        icon={CheckCircle2}
                        title="Completed"
                        value={completedAssignments}
                        color="green"
                    />
                    <StatCard
                        icon={Users}
                        title="Team Members"
                        value={activeDevelopers}
                        color="blue"
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* My Assignments */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-normal flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-purple-500" />
                                My Assignments
                            </h2>
                            <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                                {assignments.length} total
                            </Badge>
                        </div>

                        {assignmentsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                            </div>
                        ) : assignments.length === 0 ? (
                            <Card className="bg-[#0A0A0A] border-neutral-800">
                                <CardContent className="py-12 text-center">
                                    <ClipboardList className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                                    <p className="text-neutral-500">No assignments yet</p>
                                    <p className="text-xs text-neutral-600 mt-1">Tasks assigned by admin will appear here</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {assignments.slice(0, 5).map((assignment) => (
                                    <Card key={assignment.id} className="bg-[#0A0A0A] border-neutral-800 hover:border-neutral-700 transition-colors">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    {getStatusIcon(assignment.status)}
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-white">{assignment.title}</h3>
                                                        {assignment.description && (
                                                            <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                                                                {assignment.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-3 mt-2">
                                                            {assignment.project && (
                                                                <span className="text-xs text-purple-400">
                                                                    {assignment.project.title}
                                                                </span>
                                                            )}
                                                            {assignment.due_date && (
                                                                <span className="text-xs text-neutral-600">
                                                                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`text-[10px] uppercase ${getPriorityColor(assignment.priority)}`}
                                                >
                                                    {assignment.priority}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Active Projects */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-normal flex items-center gap-2">
                                <FolderKanban className="w-5 h-5 text-purple-500" />
                                Active Projects
                            </h2>

                            {projectsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
                                </div>
                            ) : projects.length === 0 ? (
                                <Card className="bg-[#0A0A0A] border-neutral-800">
                                    <CardContent className="py-8 text-center">
                                        <p className="text-neutral-500 text-sm">No active projects</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-2">
                                    {projects.slice(0, 4).map((project) => (
                                        <Card key={project.id} className="bg-[#0A0A0A] border-neutral-800">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-medium text-sm text-white truncate">
                                                        {project.title}
                                                    </h3>
                                                    <span className="text-xs text-purple-400">
                                                        {project.total_progress}%
                                                    </span>
                                                </div>
                                                <Progress value={project.total_progress} className="h-1" />
                                                <p className="text-xs text-neutral-600 mt-2">
                                                    {project.client?.name || 'No client'}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Team Members */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-normal flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-500" />
                                Team
                            </h2>

                            {developersLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
                                </div>
                            ) : developers.length === 0 ? (
                                <Card className="bg-[#0A0A0A] border-neutral-800">
                                    <CardContent className="py-8 text-center">
                                        <p className="text-neutral-500 text-sm">No team members</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-2">
                                    {developers.slice(0, 5).map((dev) => (
                                        <div 
                                            key={dev.id} 
                                            className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-neutral-800 rounded-lg"
                                        >
                                            <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-medium">
                                                {dev.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {dev.name}
                                                    {dev.id === developer.id && (
                                                        <span className="text-purple-400 ml-1">(You)</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-neutral-500 truncate">
                                                    {dev.specialty || 'Developer'}
                                                </p>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full ${
                                                dev.status === 'active' ? 'bg-green-500' :
                                                dev.status === 'busy' ? 'bg-yellow-500' : 'bg-neutral-500'
                                            }`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

interface StatCardProps {
    icon: any;
    title: string;
    value: number;
    color: 'purple' | 'yellow' | 'green' | 'blue';
}

function StatCard({ icon: Icon, title, value, color }: StatCardProps) {
    const colorClasses = {
        purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        green: 'text-green-500 bg-green-500/10 border-green-500/20',
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    };

    return (
        <Card className="bg-[#0A0A0A] border-neutral-800">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <p className="text-xs text-neutral-500 mt-1">{title}</p>
            </CardContent>
        </Card>
    );
}
