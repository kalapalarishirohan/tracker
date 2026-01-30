import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useClients } from "@/hooks/useDatabase";
import { useClientStore } from "@/store/clientStore";

export default function ClientLogin() {
    // --- Functional Logic (Preserved) ---
    const [assignedId, setAssignedId] = useState("RED-");
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
                toast.success("Access granted");
                if (client.is_pro) {
                    navigate("/pro/portal");
                } else {
                    navigate("/client/portal");
                }
            } else {
                toast.error("Access denied", { description: "Invalid client ID" });
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error("Login failed", { description: "Please try again later." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();
        if (val.startsWith("RED-")) {
            setAssignedId(val);
        } else if (val.length < 4) {
            setAssignedId("RED-");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-light flex flex-col selection:bg-blue-500/30">

            {/* 1. Simple Blue Tag */}
            <div className="bg-blue-600 py-2 px-4 text-center">
                <p className="text-xs font-medium text-white">
                    Secure connection established. All project data is encrypted.
                </p>
            </div>

            {/* 2. Navigation */}
            <nav className="flex justify-between items-center px-8 py-8 max-w-7xl mx-auto w-full">
                <Link to="/" className="text-lg font-normal tracking-tight">
                    Redlix <span className="text-blue-500 font-medium">Tracker</span>
                </Link>
                <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Back to home
                </Link>
            </nav>

            {/* 3. Main Content Area */}
            <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-8 py-12 gap-16 items-center">

                {/* Left: Login Container Shape */}
                <div className="w-full md:w-1/2">
                    <div className="bg-[#0A0A0A] border border-neutral-800 p-8 md:p-12 rounded-2xl">
                        <div className="mb-8">
                            <h1 className="text-3xl font-normal mb-3">Client login</h1>
                            <p className="text-neutral-500 text-sm">
                                Enter your project access key to view your dashboard.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-3">
                                <label htmlFor="clientId" className="text-sm text-neutral-400 ml-1">
                                    Project access key
                                </label>
                                <Input
                                    id="clientId"
                                    value={assignedId}
                                    onChange={handleInputChange}
                                    className="h-14 bg-black border-neutral-800 text-white focus:border-blue-600 focus:ring-0 rounded-xl font-mono text-xl tracking-widest"
                                    autoComplete="off"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all"
                            >
                                {isLoading ? "Checking key..." : "Open dashboard"}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Right: Simple Info */}
                <div className="w-full md:w-1/2 space-y-10">
                    <div>
                        <h2 className="text-blue-500 font-medium mb-2">How it works</h2>
                        <div className="w-10 h-0.5 bg-blue-900"></div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-base font-medium mb-1">Use your ID</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">
                                Use the unique Redlix ID assigned to your project during onboarding.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-base font-medium mb-1">Track progress</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">
                                See real-time updates on milestones and creative asset reviews.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-base font-medium mb-1">Pro features</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">
                                Pro clients can now access domain tracking and advanced analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* 4. Solid Blue Footer */}
            <footer className="bg-blue-600 text-white py-16 px-8 mt-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/20 pb-12">
                        <div className="space-y-4">
                            <p className="font-medium">Redlix Tracker</p>
                            <p className="text-sm opacity-80 leading-relaxed max-w-xs">
                                A simple system for professional project management and secure collaboration.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="font-medium">Quick links</p>
                            <ul className="text-sm space-y-2 opacity-80">
                                <li><Link to="/docs" className="hover:underline">Documentation</Link></li>
                                <li><Link to="/support" className="hover:underline">Support center</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <p className="font-medium">Privacy</p>
                            <ul className="text-sm space-y-2 opacity-80">
                                <li><Link to="/terms" className="hover:underline">Terms of use</Link></li>
                                <li><Link to="/privacy" className="hover:underline">Privacy policy</Link></li>
                            </ul>
                        </div>

                        <div className="md:text-right space-y-1">
                            <p className="text-sm font-medium">System status</p>
                            <p className="text-sm opacity-80">All systems operational</p>
                            <p className="text-xs opacity-60 pt-2 font-mono">v2.6.4</p>
                        </div>
                    </div>

                    <div className="pt-8 text-xs opacity-60">
                        <p>© 2026 Redlix Systems Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}