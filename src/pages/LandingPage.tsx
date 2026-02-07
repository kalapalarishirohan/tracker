import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    // font-light makes the overall text look cleaner and less "heavy"
    <div className="h-screen bg-[#050505] text-white font-light flex flex-col overflow-hidden">

      {/* 1. Simple Green Tag */}
      <div className="bg-[#059669] py-2 px-4 text-center">
        <p className="text-xs text-white">
          System update: Domain tracking features are now active in the Pro client dashboards.
        </p>
      </div>

      {/* 2. Navigation */}
      <nav className="flex justify-between items-center px-8 py-10 max-w-6xl mx-auto w-full">
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" // Add your external logo link here
            alt="CSAPP Logo"
            className="h-10 w-auto"
          />
        </div>
        <div className="flex gap-8 items-center text-sm text-neutral-400">
          <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
          <Link to="/help" className="hover:text-white transition-colors">Help Center</Link>
          <Link to="/contact" className="bg-white text-black px-5 py-2 rounded-md hover:bg-[#059669] hover:text-white transition-all">
            Contact us
          </Link>
        </div>
      </nav>

      {/* 3. Header Section */}
      <main className="max-w-6xl mx-auto px-8 flex-grow w-full pt-10 pb-20 overflow-hidden">
        <div className="max-w-xl mb-16">
          <h1 className="text-4xl font-normal mb-4 tracking-tight">
            Welcome to <span className="text-[#059669]">CSAPP.</span>
          </h1>
          <p className="text-neutral-400 text-base">
            A simple tool to track your projects and manage your work in one place.
          </p>
        </div>

        {/* 4. Portal Containers (Login boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PortalCard
            title="Client portal"
            desc="Check your project status and files."
            link="/client"
            button="View projects"
          />
          <PortalCard
            title="Developer portal"
            desc="Access technical resources and deployments."
            link="/developer"
            button="Developer access"
            badge="New"
          />
          <PortalCard
            title="New request"
            desc="Start a project or ask for help."
            link="/request-project"
            button="Get started"
          />
        </div>
      </main>

      {/* 5. Solid Green Footer */}
      <footer className="bg-[#059669] text-white py-10 px-8 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/20 pb-8">
            <div className="col-span-1">
              <p className="font-medium mb-4">CSAPP</p>
              <p className="text-sm opacity-80 leading-relaxed">
                Making project management easy for teams and clients.
              </p>
            </div>

            <div className="col-span-1 space-y-3 text-sm">
              <p className="font-medium">Links</p>
              <Link to="/pricing" className="block opacity-70 hover:opacity-100">Pricing</Link>
              <Link to="/client" className="block opacity-70 hover:opacity-100">Client portal</Link>
              <Link to="/request-project" className="block opacity-70 hover:opacity-100">Request project</Link>
              <Link to="/contact" className="block opacity-70 hover:opacity-100">Contact us</Link>
            </div>

            <div className="col-span-1 space-y-3 text-sm">
              <p className="font-medium">Support & Legal</p>
              <Link to="/docs" className="block opacity-70 hover:opacity-100">Documentation</Link>
              <Link to="/help" className="block opacity-70 hover:opacity-100">Help center</Link>
              <Link to="/privacy" className="block opacity-70 hover:opacity-100 pt-2">Privacy policy</Link>
              <Link to="/terms" className="block opacity-70 hover:opacity-100">Terms of use</Link>
            </div>

            <div className="col-span-1 md:text-right text-sm space-y-1 opacity-70">
              <p>System status: Online</p>
              <p>Version 2.6.4</p>
            </div>
          </div>

          <div className="pt-6 text-xs opacity-60">
            <p>© 2026 CSAPP Systems Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple login-style container
interface PortalCardProps {
  title: string;
  desc: string;
  link: string;
  button: string;
  badge?: string;
}

function PortalCard({ title, desc, link, button, badge }: PortalCardProps) {
  return (
    <div className="relative border border-neutral-800 bg-[#0A0A0A] p-8 rounded-xl hover:border-[#059669] transition-colors group">
      {badge && (
        <span className="absolute top-4 right-4 bg-[#059669]/10 backdrop-blur-md border border-[#059669]/20 text-[#059669] text-[9px] font-bold uppercase px-2 py-0.5 rounded-full tracking-widest">
          {badge}
        </span>
      )}
      <h3 className="text-lg font-normal mb-3 text-white">
        {title}
      </h3>
      <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
        {desc}
      </p>
      <Link to={link} className="text-[#059669] text-sm font-medium hover:text-[#059669]/80 group-hover:translate-x-1 transition-transform inline-block">
        {button} →
      </Link>
    </div>
  );
}