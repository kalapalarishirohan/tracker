import { useState } from "react";
import { useStore } from "@/store";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, ArrowRight, ShieldAlert, Fingerprint, ChevronLeft } from "lucide-react";

// --- Visual Assets ---
const NoiseTexture = () => (
    <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const loginAdmin = useStore((state) => state.loginAdmin);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate security check delay
        setTimeout(() => {
            if (loginAdmin(password)) {
                toast.success("Identity Verified", { description: "Welcome back, Administrator." });
                navigate("/admin/dashboard");
            } else {
                toast.error("Access Denied", { description: "Invalid security credentials." });
                setIsLoading(false);
                setPassword(""); // Clear password on failure
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-white selection:text-black">
            <NoiseTexture />
            
            {/* Background Grid - Central Focus */}
            <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute left-1/2 top-0 h-full w-[1px] bg-neutral-900/50" />
                 <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neutral-900/50" />
                 {/* Radial Gradient to highlight center */}
                 <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Back Navigation */}
            <div className="absolute top-8 left-8 z-20">
                <Link to="/" className="flex items-center gap-2 text-neutral-600 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">Exit</span>
                </Link>
            </div>

            {/* Main Security Card */}
            <div className="relative z-10 w-full max-w-[440px] px-6">
                
                {/* Security Badge */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-neutral-900/50 border border-neutral-800 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                        <Lock className="w-6 h-6 text-neutral-400" />
                    </div>
                </div>

                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                    
                    {/* Header Text */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold tracking-[0.2em] uppercase text-white">
                            Admin<span className="text-neutral-600">Console</span>
                        </h1>
                        <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2">
                            <ShieldAlert className="w-3 h-3" />
                            Restricted Area
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        
                        <div className="space-y-2 group">
                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 ml-1 group-focus-within:text-white transition-colors">
                                Authenticator Code
                            </label>
                            <div className="relative">
                                {/* Decorator Bar */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-800 group-focus-within:bg-white transition-colors" />
                                
                                <Input
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-14 pl-6 bg-neutral-900/30 border-neutral-800 border-l-0 rounded-none text-lg tracking-widest placeholder:text-neutral-700 text-white focus:ring-0 focus:bg-neutral-900/60 transition-all duration-300 font-mono"
                                    autoFocus
                                />
                                <Fingerprint className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-700 group-focus-within:text-neutral-400" />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-14 bg-white hover:bg-neutral-200 text-black rounded-sm flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin border-2 border-black border-t-transparent rounded-full w-4 h-4" />
                                    <span className="font-medium tracking-wide text-sm">Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-bold tracking-wide text-sm uppercase">Authenticate</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                            
                            {/* Loading Progress Bar (Top) */}
                            {isLoading && (
                                <div className="absolute top-0 left-0 h-[2px] bg-black animate-[loading_1s_ease-in-out_infinite] w-full origin-left" />
                            )}
                        </Button>

                    </form>

                    {/* Footer / Disclaimer */}
                    <div className="pt-8 border-t border-neutral-900/50 text-center space-y-4">
                        <p className="text-[10px] text-neutral-600 leading-relaxed max-w-xs mx-auto">
                            Unauthorized access to this system is monitored and logged. IP Address recorded.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                             <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                             <span className="text-[10px] font-mono text-neutral-500">SYSTEM SECURE</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Decorative Corner Text */}
            <div className="absolute bottom-8 right-8 hidden md:block">
                 <span className="text-[10px] font-mono text-neutral-800">RLX-SYS-ADMIN-V4</span>
            </div>
            <div className="absolute top-8 right-8 hidden md:block">
                 <span className="text-[10px] font-mono text-neutral-800">/ROOT/USER/AUTH</span>
            </div>

        </div>
    );
}