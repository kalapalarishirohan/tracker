import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useClientStore } from "@/store/clientStore";
import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";

// Substrate Texture for a premium feel
const BackgroundEffects = () => (
    <>
        <div className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none fixed"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-amber-500/5 blur-[120px] pointer-events-none" />
    </>
);

export default function ProClientLayout() {
    const currentClient = useClientStore((state) => state.currentClient);
    const logout = useClientStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: "Overview", path: "/pro/portal" },
        { label: "Asset Library", path: "/pro/portal/assets" },
        { label: "App Tracking", path: "/pro/portal/app-tracking" },
        { label: "Web Tracking", path: "/pro/portal/web-tracking" },
        { label: "Strategic Plans", path: "/pro/portal/approach-plans" },
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
        <div className="flex flex-col min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-amber-500 selection:text-black">
            <BackgroundEffects />

            {/* ================= HEADER ================= */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/[0.03] bg-black/60 backdrop-blur-xl flex justify-between items-center px-8 md:px-12">

                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-4">
                        <div className="w-6 h-6 bg-amber-500 rounded-sm flex items-center justify-center">
                            <div className="w-2 h-2 bg-black rotate-45" />
                        </div>
                        <span className="text-xs font-black tracking-[0.4em] uppercase text-white">
                            REDLIX<span className="text-amber-500">PRO</span>
                        </span>
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                        <span className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">Client</span>
                        <span className="text-[10px] font-bold tracking-widest text-amber-500/80 uppercase">
                            {currentClient.name}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Status</span>
                        <span className="text-[9px] font-bold tracking-[0.2em] text-amber-500 uppercase flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                            Live Terminal
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="h-8 px-4 rounded border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:bg-amber-500 hover:text-black transition-all duration-300"
                    >
                        Exit
                    </button>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 relative z-10 pt-24 pb-20 w-full max-w-6xl mx-auto px-6 md:px-10">

                {/* Horizontal Navigation Grid */}
                <nav className="mb-16 grid grid-cols-2 md:grid-cols-5 gap-px bg-white/[0.05] border border-white/[0.05] rounded-sm overflow-hidden">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "relative py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500",
                                    isActive
                                        ? "bg-amber-500 text-black shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"
                                        : "bg-black text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                                )}
                            >
                                {item.label}
                                {isActive && (
                                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black/20" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="relative">
                    {/* Decorative side line */}
                    <div className="absolute -left-10 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-transparent to-transparent hidden xl:block" />

                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </div>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="border-t border-white/[0.03] bg-[#030303] py-10 px-12 flex flex-col md:flex-row justify-between items-center gap-6 z-10 relative">
                <div className="flex flex-col gap-1 items-center md:items-start">
                    <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase">Redlix Intelligence</span>
                    <span className="text-[9px] font-bold tracking-widest text-zinc-700 uppercase italic">Authorized Access Only</span>
                </div>

                <div className="flex items-center gap-10">
                    <div className="flex flex-col items-center md:items-end">
                        <span className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase">System ID</span>
                        <span className="text-[9px] font-mono text-amber-500/50 uppercase tracking-widest">{currentClient.assigned_id}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}