
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Code, Terminal, Server } from "lucide-react";

export default function DeveloperLogin() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulating developer auth
        setTimeout(() => {
            if (password === "dev123") { // Simple mock auth
                toast.success("Developer identity verified", { description: "Accessing development environment." });
                navigate("/developer/dashboard");
            } else {
                toast.error("Access denied", { description: "Invalid API key or password." });
                setIsLoading(false);
                setPassword("");
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-light flex flex-col selection:bg-blue-500/30">

            {/* 1. Tag */}
            <div className="bg-purple-600 py-2 px-4 text-center">
                <p className="text-xs font-medium text-white">
                    Developer Environment. Production access is restricted.
                </p>
            </div>

            {/* 2. Navigation */}
            <nav className="flex justify-between items-center px-8 py-8 max-w-7xl mx-auto w-full">
                <Link to="/" className="text-lg font-normal tracking-tight">
                    Redlix <span className="text-purple-500 font-medium">Dev</span>
                </Link>
                <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Exit environment
                </Link>
            </nav>

            {/* 3. Central Login Section */}
            <main className="flex-grow flex flex-col justify-center items-center px-6">
                <div className="w-full max-w-sm">
                    <div className="mb-8 text-center">
                        <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-purple-500 border border-purple-500/20">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-normal mb-3">Developer Access</h1>
                        <p className="text-neutral-500 text-sm">
                            Enter your API Key or Dev Password.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-[#0A0A0A] border border-neutral-800 p-8 rounded-2xl shadow-2xl hover:border-purple-900/50 transition-colors">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm text-neutral-400 ml-1">
                                    Access credentials
                                </label>
                                <Input
                                    type="password"
                                    placeholder="sk_live_..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-14 bg-black border-neutral-800 text-white focus:border-purple-600 focus:ring-0 rounded-xl font-mono text-lg tracking-widest"
                                    autoFocus
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all"
                            >
                                {isLoading ? "Authenticating..." : "Connect to Server"}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-neutral-900 flex items-center justify-between">
                            <span className="text-[10px] text-neutral-600 font-mono tracking-tight">Env: Production</span>
                            <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-tighter">Encrypted</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* 4. Footer */}
            <footer className="bg-purple-900/10 border-t border-purple-900/20 text-white py-8 px-8 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Server className="w-4 h-4" />
                        <span>Server Status: <span className="text-green-500">Operational</span></span>
                    </div>
                    <div className="text-xs text-neutral-600 font-mono">
                        Redlix DevClient v1.0.0
                    </div>
                </div>
            </footer>
        </div>
    );
}
