import { useState } from "react";
import { useStore } from "@/store";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminLogin() {
    // --- Functional Logic (Preserved) ---
    const [password, setPassword] = useState("");
    const loginAdmin = useStore((state) => state.loginAdmin);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (loginAdmin(password)) {
                toast.success("Identity verified", { description: "Welcome back to the dashboard." });
                navigate("/admin/dashboard");
            } else {
                toast.error("Access denied", { description: "Invalid security credentials." });
                setIsLoading(false);
                setPassword("");
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-light flex flex-col selection:bg-[#059669]/30">

            {/* 1. Simple Green Tag */}
            <div className="bg-[#059669] py-2 px-4 text-center">
                <p className="text-xs font-medium text-white">
                    Authorized access only. All administrative actions are logged.
                </p>
            </div>

            {/* 2. Navigation */}
            <nav className="flex justify-between items-center px-8 py-8 max-w-7xl mx-auto w-full">
                <Link to="/" className="flex items-center">
                    <img
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png"
                        alt="CSAPP Logo"
                        className="h-10 w-auto"
                    />
                </Link>
                <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Exit console
                </Link>
            </nav>

            {/* 3. Central Login Section */}
            <main className="flex-grow flex flex-col justify-center items-center px-6">
                <div className="w-full max-w-sm">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-normal mb-3">Admin console</h1>
                        <p className="text-neutral-500 text-sm">
                            Please enter your password to manage the system.
                        </p>
                    </div>

                    {/* Login Container Box */}
                    <div className="bg-[#0A0A0A] border border-neutral-800 p-8 rounded-2xl shadow-2xl">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm text-neutral-400 ml-1">
                                    Security password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-14 bg-black border-neutral-800 text-white focus:border-[#059669] focus:ring-0 rounded-xl font-mono text-lg tracking-widest"
                                    autoFocus
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-[#059669] hover:bg-[#059669]/90 text-white font-medium rounded-xl transition-all"
                            >
                                {isLoading ? "Checking password..." : "Login to console"}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-neutral-900 flex items-center justify-between">
                            <span className="text-[10px] text-neutral-600 font-mono tracking-tight">Access: Root</span>
                            <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-tighter">Secure connection</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* 4. Solid Green Footer */}
            <footer className="bg-[#059669] text-white py-10 px-8 mt-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/20 pb-8">
                        <div className="col-span-1">
                            <p className="font-medium mb-4">CSAPP</p>
                            <p className="text-sm opacity-80 leading-relaxed max-w-xs">
                                Management console for project tracking and system coordination.
                            </p>
                        </div>

                        <div className="col-span-1 space-y-3 text-sm">
                            <p className="font-medium">Admin links</p>
                            <Link to="/docs" className="block opacity-70 hover:opacity-100">System documentation</Link>
                            <Link to="/logs" className="block opacity-70 hover:opacity-100">Security logs</Link>
                            <Link to="/" className="block opacity-70 hover:opacity-100 pt-2">Back to site</Link>
                        </div>

                        <div className="col-span-1 space-y-3 text-sm">
                            <p className="font-medium">Utilities</p>
                            <Link to="/users" className="block opacity-70 hover:opacity-100">User management</Link>
                            <Link to="/database" className="block opacity-70 hover:opacity-100">Database status</Link>
                        </div>

                        <div className="col-span-1 md:text-right text-sm space-y-1 opacity-70">
                            <p className="font-medium">System status</p>
                            <p>Admin node live</p>
                            <p className="font-mono text-[10px] pt-2">v2.6.4</p>
                            <p className="pt-2 text-[10px] opacity-50">© 2026 CSAPP Inc.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}