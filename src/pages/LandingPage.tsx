import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ShieldCheck, LifeBuoy } from "lucide-react";

// 1. Sophisticated Geometric Logo with subtle animation
const GeometricStar = () => (
  <div className="relative flex items-center justify-center w-[28rem] h-[28rem]">
    {/* Glowing Center */}
    <div className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_80px_40px_rgba(255,255,255,0.05)]" />

    {/* Rotating Ring (Slow) */}
    <div className="absolute inset-0 animate-[spin_60s_linear_infinite]">
       <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent opacity-50" />
       <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent opacity-50" />
    </div>

    {/* Main Cross (Static, Sharp) */}
    <div className="absolute w-full h-0.5 bg-white z-10" />
    <div className="absolute h-full w-0.5 bg-white z-10" />
    
    {/* Diagonal Spikes (Scale animation) */}
    <div className="absolute w-[70%] h-0.5 bg-neutral-600 rotate-45 z-0" />
    <div className="absolute w-[70%] h-0.5 bg-neutral-600 -rotate-45 z-0" />
    
    {/* Fine Grid Details */}
    <div className="absolute w-[120%] h-[1px] bg-neutral-900 rotate-[22.5deg]" />
    <div className="absolute w-[120%] h-[1px] bg-neutral-900 -rotate-[22.5deg]" />
    <div className="absolute w-[120%] h-[1px] bg-neutral-900 rotate-[67.5deg]" />
    <div className="absolute w-[120%] h-[1px] bg-neutral-900 -rotate-[67.5deg]" />
  </div>
);

// 2. Background Texture for "Premium" feel
const NoiseTexture = () => (
    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
    />
);

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#030303] text-white flex flex-col md:flex-row overflow-hidden font-sans selection:bg-white selection:text-black">
      
      {/* ================= LEFT PANEL: Visual Identity ================= */}
      <div className="relative w-full md:w-1/2 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-900 bg-black p-10 md:p-16 overflow-hidden">
        
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-16 top-0 bottom-0 w-[1px] bg-neutral-900/50" />
            <div className="absolute right-16 top-0 bottom-0 w-[1px] bg-neutral-900/50" />
            <div className="absolute top-16 left-0 right-0 h-[1px] bg-neutral-900/50" />
            <div className="absolute bottom-16 left-0 right-0 h-[1px] bg-neutral-900/50" />
        </div>

        {/* Brand */}
        <div className="relative z-10 animate-in slide-in-from-top-4 duration-700 fade-in">
          <h2 className="text-xl font-bold tracking-[0.2em] uppercase">
            Redlix<span className="text-neutral-600 font-medium">Tracker</span>
          </h2>
        </div>

        {/* Hero Graphic */}
        <div className="relative z-10 flex-1 flex items-center justify-center animate-in zoom-in-95 duration-1000 delay-150 fade-in">
            <GeometricStar />
        </div>

        {/* Copyright */}
        <div className="relative z-10 animate-in slide-in-from-bottom-4 duration-700 fade-in delay-300">
          <p className="text-neutral-600 text-[10px] font-mono uppercase tracking-widest">
            © 2026 Redlix Systems Inc.
          </p>
        </div>
      </div>

      {/* ================= RIGHT PANEL: Interaction ================= */}
      <div className="relative w-full md:w-1/2 flex flex-col justify-center bg-[#050505] relative">
        <NoiseTexture />
        
        {/* Ambient Gradient Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

        {/* Top Controls */}
        <div className="absolute top-10 right-10 flex items-center gap-6 z-20">
            <span className="text-neutral-600 text-xs font-mono tracking-wider hover:text-white cursor-pointer transition-colors">STATUS: ONLINE</span>
            <span className="text-neutral-600 text-xs font-mono tracking-wider">V 2.5.0</span>
        </div>

        <div className="w-full max-w-xl mx-auto px-8 md:px-16 z-10 flex flex-col justify-center h-full py-20">
            
            {/* Main Content */}
            <div className="space-y-8 mb-16 animate-in slide-in-from-right-4 duration-700 fade-in">
                <div>
                  <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-white mb-6">
                      Tracker
                  </h1>
                  <div className="h-1 w-20 bg-white mb-8" /> {/* Divider Line */}
                </div>
                
                <p className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-md">
                    Client submission and project progress management system. 
                    <span className="block mt-2 text-neutral-600 text-sm"> exclusively for authorized clients.</span>
                </p>
            </div>

            {/* Interactive Area */}
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in">
                
                {/* Primary Action */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-white to-neutral-600 rounded-sm blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                    <Link to="/admin" className="relative block">
                        <Button 
                            className="w-full h-20 bg-white hover:bg-neutral-100 text-black rounded-none flex items-center justify-between px-8 transition-all duration-300 border border-white"
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-lg font-bold tracking-tight">Admin Access</span>
                                <span className="text-[10px] uppercase tracking-widest text-neutral-500">Internal Use Only</span>
                            </div>
                            <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Secondary Action */}
                <div className="group relative">
                    <Link to="/client" className="block">
                        <Button 
                            variant="outline"
                            className="w-full h-20 bg-transparent border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-500 hover:bg-neutral-900/50 rounded-none flex items-center justify-between px-8 transition-all duration-300 backdrop-blur-sm"
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-lg font-medium tracking-tight">Client Portal</span>
                                <span className="text-[10px] uppercase tracking-widest text-neutral-600 group-hover:text-neutral-400">View Progress</span>
                            </div>
                            <ArrowUpRight className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors" />
                        </Button>
                    </Link>
                </div>

                {/* Footer Utility Links */}
                <div className="flex items-center justify-between pt-8 border-t border-neutral-900 mt-8">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors tracking-wide">Secure Connection</span>
                    </div>
                    
                    <Link to="/support" className="flex items-center gap-2 group">
                        <span className="text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors tracking-wide">Support Center</span>
                        <LifeBuoy className="w-4 h-4 text-neutral-700 group-hover:text-white transition-colors" />
                    </Link>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}