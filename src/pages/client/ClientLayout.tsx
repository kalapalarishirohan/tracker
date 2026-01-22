import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useClientStore } from "@/store/clientStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck, LayoutDashboard, FileText, Ticket, MessageSquare } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";

// Background Texture
const NoiseTexture = () => (
    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay fixed"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

export default function ClientLayout() {
    const currentClient = useClientStore((state) => state.currentClient);
    const logout = useClientStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/client/portal" },
        { icon: FileText, label: "New Project", path: "/client/portal/project-request" },
        { icon: Ticket, label: "Support Ticket", path: "/client/portal/tickets" },
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
        <div className="flex flex-col min-h-screen bg-[#030303] text-white font-sans selection:bg-white selection:text-black">
            <NoiseTexture />

            {/* ================= HEADER ================= */}
            <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-neutral-900 bg-black/90 backdrop-blur-md flex justify-between items-center px-6 md:px-12">
                
                {/* Left: Project Info */}
                <div className="flex items-center gap-6">
                    {/* Simple Text Logo */}
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        Redlix Tracker
                    </h1>

                    {/* Divider */}
                    <div className="h-6 w-[1px] bg-neutral-800 hidden md:block" />

                    {/* Simple ID Display */}
                    <div className="hidden md:flex items-center gap-2 text-sm text-neutral-400">
                        <span>Project ID:</span>
                        <span className="text-white font-mono bg-neutral-900 px-2 py-1 rounded-sm border border-neutral-800">
                            {currentClient.assigned_id}
                        </span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-6">
                    {/* Live Status */}
                    <div className="hidden md:flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-neutral-400">Connected</span>
                    </div>

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleLogout} 
                        className="text-white hover:bg-neutral-800 hover:text-white transition-colors gap-2"
                    >
                        <span>Sign Out</span>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 relative z-10 pt-28 pb-12 px-4 md:px-8 w-full max-w-6xl mx-auto">
                {/* Navigation Tabs */}
                <nav className="mb-8 flex flex-wrap gap-2 border-b border-neutral-800 pb-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "h-10 px-4 gap-2 rounded-sm transition-all",
                                        isActive 
                                            ? "bg-white text-black hover:bg-neutral-200" 
                                            : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="border-t border-neutral-900 bg-black/50 py-6 px-8 flex justify-between items-center text-sm text-neutral-500 z-10 relative">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure connection</span>
                </div>
                <span>© 2026 Redlix Systems</span>
            </footer>
        </div>
    );
}