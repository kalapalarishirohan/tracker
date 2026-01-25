import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useClientStore } from "@/store/clientStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck, LayoutDashboard, Image, Smartphone, Globe, Map, Crown } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Background Texture
const NoiseTexture = () => (
    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay fixed"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

export default function ProClientLayout() {
    const currentClient = useClientStore((state) => state.currentClient);
    const logout = useClientStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/pro/portal" },
        { icon: Image, label: "Assets", path: "/pro/portal/assets" },
        { icon: Smartphone, label: "App Development", path: "/pro/portal/app-tracking" },
        { icon: Globe, label: "Web Development", path: "/pro/portal/web-tracking" },
        { icon: Map, label: "Approach Plans", path: "/pro/portal/approach-plans" },
    ];

    useEffect(() => {
        if (!currentClient) {
            navigate("/client");
        } else if (!currentClient.is_pro) {
            navigate("/client/portal");
        }
    }, [currentClient, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/client");
    };

    if (!currentClient || !currentClient.is_pro) return null;

    return (
        <div className="flex flex-col min-h-screen bg-[#030303] text-white font-sans selection:bg-amber-500 selection:text-black">
            <NoiseTexture />

            {/* ================= HEADER ================= */}
            <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-amber-900/50 bg-black/90 backdrop-blur-md flex justify-between items-center px-6 md:px-12">
                
                {/* Left: Project Info */}
                <div className="flex items-center gap-6">
                    {/* Logo with Pro Badge */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Redlix Tracker
                        </h1>
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold px-2 py-0.5">
                            <Crown className="w-3 h-3 mr-1" />
                            PRO
                        </Badge>
                    </div>

                    {/* Divider */}
                    <div className="h-6 w-[1px] bg-amber-900/50 hidden md:block" />

                    {/* Client Name */}
                    <div className="hidden md:flex items-center gap-2 text-sm text-amber-200/70">
                        <span>Welcome,</span>
                        <span className="text-amber-400 font-medium">
                            {currentClient.name}
                        </span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-6">
                    {/* Live Status */}
                    <div className="hidden md:flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-sm text-amber-200/70">Pro Connected</span>
                    </div>

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleLogout} 
                        className="text-amber-200 hover:bg-amber-900/30 hover:text-white transition-colors gap-2"
                    >
                        <span>Sign Out</span>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 relative z-10 pt-28 pb-12 px-4 md:px-8 w-full max-w-7xl mx-auto">
                {/* Navigation Tabs */}
                <nav className="mb-8 flex flex-wrap gap-2 border-b border-amber-900/30 pb-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "h-10 px-4 gap-2 rounded-sm transition-all",
                                        isActive 
                                            ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500" 
                                            : "text-amber-200/70 hover:text-white hover:bg-amber-900/30"
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
            <footer className="border-t border-amber-900/30 bg-black/50 py-6 px-8 flex justify-between items-center text-sm text-amber-200/50 z-10 relative">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Premium secure connection</span>
                </div>
                <span>© 2026 Redlix Systems - Pro Edition</span>
            </footer>
        </div>
    );
}
