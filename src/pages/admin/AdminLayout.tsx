import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, Ticket, LogOut, FolderGit2, ShieldAlert, Command, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";

// Shared visual asset
const NoiseTexture = () => (
    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay fixed"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

export default function AdminLayout() {
    const { logoutAdmin, isAdminLoggedIn } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAdminLoggedIn) {
            navigate("/admin");
        }
    }, [isAdminLoggedIn, navigate]);

    const handleLogout = () => {
        logoutAdmin();
        navigate("/admin");
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard" },
        { icon: Users, label: "Client Database", path: "/admin/dashboard/clients" },
        { icon: FolderGit2, label: "Active Projects", path: "/admin/dashboard/projects" },
        { icon: FileText, label: "Submission Logs", path: "/admin/dashboard/submissions" },
        { icon: Ticket, label: "Support Tickets", path: "/admin/dashboard/tickets" },
    ];

    // Helper to get current page title for breadcrumb
    const currentPage = navItems.find(item => item.path === location.pathname)?.label || "Dashboard";

    if (!isAdminLoggedIn) return null;

    return (
        <div className="flex h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black overflow-hidden">
            <NoiseTexture />

            {/* ================= SIDEBAR ================= */}
            <aside className="w-72 bg-black border-r border-neutral-900 hidden md:flex flex-col z-20 relative">
                
                {/* Branding */}
                <div className="h-20 flex items-center px-6 border-b border-neutral-900 bg-black">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-900 border border-neutral-800 flex items-center justify-center rounded-sm">
                            <ShieldAlert className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold tracking-widest uppercase text-white">Redlix</h2>
                            <p className="text-[10px] text-neutral-500 font-mono tracking-wider">ADMIN CONSOLE</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto py-8">
                    <div className="px-4 mb-4">
                        <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Main Modules</span>
                    </div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-4 h-12 rounded-sm mb-1 transition-all duration-300 relative overflow-hidden group",
                                        isActive 
                                            ? "bg-neutral-900 text-white" 
                                            : "text-neutral-500 hover:text-white hover:bg-neutral-900/50"
                                    )}
                                >
                                    {/* Active Indicator Line */}
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />}
                                    
                                    <item.icon size={18} className={cn("transition-colors", isActive ? "text-white" : "text-neutral-600 group-hover:text-neutral-400")} />
                                    <span className="text-sm font-medium tracking-wide">{item.label}</span>
                                    
                                    {isActive && <ChevronRight className="ml-auto w-4 h-4 text-neutral-600" />}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Info */}
                <div className="p-4 border-t border-neutral-900 bg-neutral-950/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400 border border-neutral-700">
                            AD
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-medium text-white truncate">Administrator</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-[10px] text-neutral-500 font-mono">Session Active</p>
                            </div>
                        </div>
                    </div>
                    <Button 
                        variant="outline" 
                        className="w-full justify-between bg-transparent border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-900/50 hover:bg-red-950/10 transition-colors h-10 text-xs uppercase tracking-widest" 
                        onClick={handleLogout}
                    >
                        <span>Terminate Session</span>
                        <LogOut size={14} />
                    </Button>
                </div>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
                
                {/* Top Header / Breadcrumbs */}
                <header className="h-20 border-b border-neutral-900 bg-black/50 backdrop-blur-sm flex items-center justify-between px-8">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Command className="w-4 h-4" />
                        <span className="font-mono">/</span>
                        <span className="font-medium text-white tracking-wide">{currentPage}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-neutral-600">
                            <span>CPU: 12%</span>
                            <span>MEM: 40%</span>
                            <span>NET: 12ms</span>
                        </div>
                        {/* Mobile Menu Trigger could go here */}
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                    <PageTransition>
                        <div className="max-w-7xl mx-auto pb-20">
                            <Outlet />
                        </div>
                    </PageTransition>
                </div>

            </main>
        </div>
    );
}