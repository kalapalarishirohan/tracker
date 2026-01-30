import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useClientStore } from "@/store/clientStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck, LayoutDashboard, FileText, Ticket, MessageSquare, Clock } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";

export default function ClientLayout() {
    const currentClient = useClientStore((state) => state.currentClient);
    const logout = useClientStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: "Overview", path: "/client/portal" },
        { icon: FileText, label: "Requests", path: "/client/portal/project-request" },
        { icon: Ticket, label: "Tickets", path: "/client/portal/tickets" },
        { icon: Clock, label: "History", path: "/client/portal/tickets-history" },
        { icon: MessageSquare, label: "Feedback", path: "/client/portal/feedback" },
    ];

    useEffect(() => {
        if (!currentClient) {
            navigate("/client");
        }
    }, [currentClient, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/client");
    };

    if (!currentClient) return null;

    return (
        <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">

            {/* ================= HEADER ================= */}
            <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-neutral-900 bg-black/80 backdrop-blur-xl flex justify-between items-center px-6 md:px-10">

                {/* Left: Project Info */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-lg font-medium tracking-tight hover:opacity-80 transition-opacity">
                        Redlix <span className="text-blue-500">Tracker</span>
                    </Link>

                    <div className="h-4 w-[1px] bg-neutral-800 hidden md:block" />

                    <div className="hidden md:flex items-center gap-3">
                        <span className="text-sm text-neutral-400">Project ID:</span>
                        <span className="text-sm font-mono text-white bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                            {currentClient.assigned_id}
                        </span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-colors gap-2 text-sm rounded-lg"
                    >
                        <span>Switch Account</span>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 relative z-10 pt-28 pb-20 px-4 md:px-8 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-10">

                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0 flex flex-col space-y-2 sticky top-28 h-fit">
                    <p className="text-xs font-medium text-neutral-500 mb-2 px-4 uppercase tracking-wider">Menu</p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <div className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-500"
                                        : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                                )}>
                                    <item.icon className={cn("w-4 h-4", isActive ? "text-blue-500" : "text-neutral-500")} />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}

                    <div className="mt-8 pt-8 border-t border-neutral-900 px-4">
                        <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                            <h4 className="text-sm font-medium text-white mb-1">Need help?</h4>
                            <p className="text-xs text-neutral-500 mb-3">Contact support or read our documentation.</p>
                            <Link to="/help" className="text-xs text-blue-500 hover:underline">Visit Help Center</Link>
                        </div>
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </div>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="border-t border-neutral-900 bg-[#050505] py-8 px-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600 z-10 relative">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <ShieldCheck className="w-4 h-4 text-blue-900" />
                    <span>Secure Client Environment</span>
                </div>
                <span>© 2026 Redlix Systems Inc.</span>
            </footer>
        </div>
    );
}