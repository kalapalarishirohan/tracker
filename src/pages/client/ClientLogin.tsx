import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, KeyRound, ShieldCheck, Mail, Info, Smartphone } from "lucide-react";
import { useClients } from "@/hooks/useDatabase";
import { useClientStore } from "@/store/clientStore";

// --- Visual Assets ---
const NoiseTexture = () => (
    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

export default function ClientLogin() {
    const [assignedId, setAssignedId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { loginClient } = useClients();
    const setCurrentClient = useClientStore((state) => state.setCurrentClient);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const client = await loginClient(assignedId.toUpperCase());
            
            if (client) {
                setCurrentClient(client);
                toast.success("Access Granted");
                navigate("/client/portal");
            } else {
                toast.error("Access Denied", { description: "Invalid Client ID" });
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error("Login Failed", { description: "Please try again later." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030303] text-white flex overflow-hidden font-sans selection:bg-white selection:text-black">
            <NoiseTexture />

            {/* ================= LEFT PANEL: Login Form ================= */}
            <div className="w-full md:w-1/2 flex flex-col relative bg-black border-r border-neutral-900 z-10">
                
                {/* Back Link */}
                <div className="absolute top-8 left-8">
                    <Link to="/" className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs uppercase tracking-wider font-medium">Home</span>
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center px-8 md:px-20 lg:px-28">
                    <div className="w-full max-w-md space-y-12 animate-in slide-in-from-left-4 duration-700 fade-in">
                        
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 rounded-full border border-neutral-800">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-mono text-emerald-500 tracking-wider uppercase">Portal Active</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
                                Client Login
                            </h1>
                            <p className="text-neutral-400 font-light text-lg">
                                Secure access to your project timeline.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-3 group">
                                <label htmlFor="clientId" className="text-xs uppercase tracking-widest text-neutral-500 ml-1 group-focus-within:text-white transition-colors">
                                    Project ID / Access Key
                                </label>
                                <div className="relative">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" />
                                    <Input
                                        id="clientId"
                                        placeholder="RED-XXXX"
                                        value={assignedId}
                                        onChange={(e) => setAssignedId(e.target.value.toUpperCase())}
                                        className="h-16 pl-12 bg-neutral-900/30 border-neutral-800 text-xl font-mono tracking-widest placeholder:text-neutral-800 text-white focus:border-white focus:ring-0 rounded-none border-x-0 border-t-0 border-b-2 transition-all duration-300"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full h-16 bg-white hover:bg-neutral-200 text-black text-lg font-medium rounded-sm flex items-center justify-between px-6 transition-all duration-300 group"
                            >
                                <span>{isLoading ? "Authenticating..." : "Enter Portal"}</span>
                                <ArrowRight className={`w-5 h-5 transition-transform ${isLoading ? "opacity-0" : "group-hover:translate-x-1"}`} />
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Footer Legal */}
                <div className="p-8 text-neutral-700 text-xs flex justify-between">
                    <span>© 2026 Redlix Systems</span>
                    <span className="font-mono">SECURE SSL</span>
                </div>
            </div>

            {/* ================= RIGHT PANEL: Instructions & Visuals ================= */}
            <div className="hidden md:flex w-1/2 bg-[#080808] relative flex-col justify-center p-16 lg:p-24 overflow-hidden">
                
                {/* Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-20" 
                     style={{backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
                </div>
                
                <div className="relative z-10 max-w-lg space-y-12 animate-in slide-in-from-right-4 duration-1000 delay-100 fade-in">
                    
                    {/* Header */}
                    <div>
                        <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-white mb-2">Access Protocols</h2>
                        <div className="w-12 h-1 bg-neutral-800" />
                    </div>

                    {/* Instruction List */}
                    <div className="space-y-8">
                        {/* Step 01 */}
                        <div className="flex gap-6 group">
                            <div className="flex-shrink-0 w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-neutral-600 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-wider group-hover:text-emerald-500 transition-colors">01 // Identification</h3>
                                <p className="text-neutral-400 leading-relaxed text-sm">
                                    Check your onboarding email for your unique <span className="text-white font-mono">RED-ID</span>. This key is case-sensitive.
                                </p>
                            </div>
                        </div>

                        {/* Step 02 */}
                        <div className="flex gap-6 group">
                            <div className="flex-shrink-0 w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-neutral-600 transition-colors">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-wider group-hover:text-emerald-500 transition-colors">02 // Visualization</h3>
                                <p className="text-neutral-400 leading-relaxed text-sm">
                                    Track project milestones, review assets, and approve deliverables directly from the dashboard.
                                </p>
                            </div>
                        </div>

                        {/* Step 03 */}
                        <div className="flex gap-6 group">
                            <div className="flex-shrink-0 w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-neutral-600 transition-colors">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-wider group-hover:text-emerald-500 transition-colors">03 // Security</h3>
                                <p className="text-neutral-400 leading-relaxed text-sm">
                                    This connection is end-to-end encrypted. Do not share your Project ID with unauthorized personnel.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Support Box */}
                    <div className="mt-12 p-6 bg-neutral-900/50 border border-neutral-800 rounded-sm flex items-start gap-4">
                        <Info className="w-5 h-5 text-neutral-500 mt-1" />
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-white">Having trouble connecting?</h4>
                            <p className="text-xs text-neutral-500">
                                Contact your project manager or email <a href="#" className="text-neutral-300 hover:text-white underline">support@redlix.com</a> for immediate assistance.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
