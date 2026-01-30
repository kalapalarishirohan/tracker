import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, Ticket, LogOut, FolderGit2, ShieldAlert, Command, ChevronRight, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";

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
        { icon: Crown, label: "Pro Clients", path: "/admin/dashboard/pro-clients" },
    ];

    if (!isAdminLoggedIn) return null;

    return (
        <div className="flex h-screen bg-[#050505] text-white font-light selection:bg-blue-500/30 overflow-hidden">

            {/* ================= SIDEBAR ================= */}
            <aside className="w-72 bg-[#0A0A0A] border-r border-neutral-800 hidden md:flex flex-col z-20 relative">

                {/* Branding */}
                <div className="h-20 flex items-center px-6 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                            <ShieldAlert className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-medium tracking-tight text-white">Redlix Admin</h2>
                            <p className="text-xs text-neutral-500 font-normal">System Control</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto py-8">
                    <div className="px-4 mb-4">
                        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Modules</span>
                    </div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 h-11 rounded-xl mb-1 transition-all duration-300 font-normal",
                                        isActive
                                            ? "bg-blue-600/10 text-blue-500"
                                            : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                                    )}
                                >
                                    <item.icon size={18} className={cn("transition-colors", isActive ? "text-blue-500" : "text-neutral-500 group-hover:text-neutral-400")} />
                                    <span className="text-sm">{item.label}</span>

                                    {isActive && <ChevronRight className="ml-auto w-4 h-4 text-blue-500/50" />}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Info */}
                <div className="p-4 border-t border-neutral-800 bg-neutral-900/10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-medium text-neutral-300 border border-neutral-700">
                            AD
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">Administrator</p>
                            <p className="text-xs text-neutral-500">Super Admin Access</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-neutral-400 hover:text-red-400 hover:bg-red-950/10 transition-colors h-10 text-xs font-medium rounded-xl"
                        onClick={handleLogout}
                    >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden bg-[#050505]">

                {/* Top Header */}
                <header className="h-20 border-b border-neutral-800 bg-[#050505]/80 backdrop-blur-xl flex items-center justify-between px-8">
                    {/* Breadcrumbs / Page Title */}
                    <div>
                        <h2 className="text-xl font-normal text-white tracking-tight">Dashboard Overview</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-neutral-500">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A0A0A] border border-neutral-800">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>System Online</span>
                            </div>
                        </div>
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