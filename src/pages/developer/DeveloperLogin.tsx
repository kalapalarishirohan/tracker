import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Terminal, Server, Eye, EyeOff } from "lucide-react";
import { useDeveloperAuth } from "@/hooks/useDeveloperAuth";

export default function DeveloperLogin() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();
    const { signIn, signUp, loading, isAuthenticated, developer } = useDeveloperAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && developer) {
            navigate("/developer/dashboard");
        }
    }, [isAuthenticated, developer, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSignUp) {
            const { error } = await signUp(email, password, name, specialty);
            if (!error) {
                // Show verification message - user needs to check email
                setIsSignUp(false);
                setEmail("");
                setPassword("");
                setName("");
                setSpecialty("");
            }
        } else {
            const { error } = await signIn(email, password);
            if (!error) {
                navigate("/developer/dashboard");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-light flex flex-col selection:bg-purple-500/30">

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
                        <h1 className="text-3xl font-normal mb-3">
                            {isSignUp ? "Join the Team" : "Developer Access"}
                        </h1>
                        <p className="text-neutral-500 text-sm">
                            {isSignUp 
                                ? "Create your developer account to get started."
                                : "Sign in to access the development environment."}
                        </p>
                    </div>

                    {/* Login/Signup Card */}
                    <div className="bg-[#0A0A0A] border border-neutral-800 p-8 rounded-2xl shadow-2xl hover:border-purple-900/50 transition-colors">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {isSignUp && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm text-neutral-400 ml-1">
                                            Full Name
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-12 bg-black border-neutral-800 text-white focus:border-purple-600 focus:ring-0 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-neutral-400 ml-1">
                                            Specialty (Optional)
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Frontend, Backend, Full Stack..."
                                            value={specialty}
                                            onChange={(e) => setSpecialty(e.target.value)}
                                            className="h-12 bg-black border-neutral-800 text-white focus:border-purple-600 focus:ring-0 rounded-xl"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400 ml-1">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="developer@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 bg-black border-neutral-800 text-white focus:border-purple-600 focus:ring-0 rounded-xl"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 bg-black border-neutral-800 text-white focus:border-purple-600 focus:ring-0 rounded-xl pr-12"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all"
                            >
                                {loading 
                                    ? "Processing..." 
                                    : isSignUp 
                                        ? "Create Account" 
                                        : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-neutral-900 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setEmail("");
                                    setPassword("");
                                    setName("");
                                    setSpecialty("");
                                }}
                                className="text-sm text-neutral-400 hover:text-purple-400 transition-colors"
                            >
                                {isSignUp 
                                    ? "Already have an account? Sign in" 
                                    : "Need an account? Sign up"}
                            </button>
                        </div>

                        <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between">
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
                        Redlix DevClient v2.0.0
                    </div>
                </div>
            </footer>
        </div>
    );
}
