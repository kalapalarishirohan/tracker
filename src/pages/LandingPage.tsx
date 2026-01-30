import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    // font-light makes the overall text look cleaner and less "heavy"
    <div className="min-h-screen bg-[#050505] text-white font-light flex flex-col">

      {/* 1. Simple Blue Tag */}
      <div className="bg-blue-600 py-2 px-4 text-center">
        <p className="text-xs text-white">
          System update: Domain tracking features are now active in the Pro client dashboards.
        </p>
      </div>

      {/* 2. Navigation */}
      <nav className="flex justify-between items-center px-8 py-10 max-w-6xl mx-auto w-full">
        <h2 className="text-lg font-medium tracking-tight">
          Redlix <span className="text-blue-500">Tracker</span>
        </h2>
        <div className="flex gap-8 items-center text-sm text-neutral-400">
          <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
          <Link to="/help" className="hover:text-white transition-colors">Help Center</Link>
          <Link to="/contact" className="bg-white text-black px-5 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-all">
            Contact us
          </Link>
        </div>
      </nav>

      {/* 3. Header Section */}
      <main className="max-w-6xl mx-auto px-8 flex-grow w-full pt-10 pb-20">
        <div className="max-w-xl mb-16">
          <h1 className="text-4xl font-normal mb-4 tracking-tight">
            Welcome to <span className="text-blue-500">Redlix Tracker.</span>
          </h1>
          <p className="text-neutral-400 text-base">
            A simple tool to track your projects and manage your work in one place.
          </p>
        </div>

        {/* 4. Portal Containers (Login boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <PortalCard
            title="Admin portal"
            desc="Manage projects and view system reports."
            link="/admin"
            button="Open admin"
          />
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

      {/* 5. Solid Blue Footer */}
      <footer className="bg-blue-600 text-white py-16 px-8 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/20 pb-12">
            <div>
              <p className="font-medium mb-4">Redlix Tracker</p>
              <p className="text-sm opacity-80 leading-relaxed">
                Making project management easy for teams and clients.
              </p>
            </div>

            <div className="flex gap-16">
              <div className="space-y-3 text-sm">
                <p className="font-medium">Links</p>
                <Link to="/pricing" className="block opacity-70 hover:opacity-100">Pricing</Link>
                <Link to="/admin" className="block opacity-70 hover:opacity-100">Admin portal</Link>
                <Link to="/client" className="block opacity-70 hover:opacity-100">Client portal</Link>
                <Link to="/request-project" className="block opacity-70 hover:opacity-100">Request project</Link>
                <Link to="/contact" className="block opacity-70 hover:opacity-100">Contact us</Link>
              </div>
              <div className="space-y-3 text-sm">
                <p className="font-medium">Support</p>
                <Link to="/docs" className="block opacity-70 hover:opacity-100">Documentation</Link>
                <Link to="/help" className="block opacity-70 hover:opacity-100">Help center</Link>
              </div>
            </div>

            <div className="md:text-right text-sm space-y-1 opacity-70">
              <p>System status: Online</p>
              <p>Version 2.6.4</p>
            </div>
          </div>

          <div className="pt-8 text-xs opacity-60">
            <p>© 2026 Redlix Systems Inc.</p>
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
    <div className="relative border border-neutral-800 bg-[#0A0A0A] p-8 rounded-xl hover:border-blue-500 transition-colors group">
      {badge && (
        <span className="absolute top-4 right-4 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 text-blue-400 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full tracking-widest">
          {badge}
        </span>
      )}
      <h3 className="text-lg font-normal mb-3 text-white">
        {title}
      </h3>
      <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
        {desc}
      </p>
      <Link to={link} className="text-blue-500 text-sm font-medium hover:text-blue-400 group-hover:translate-x-1 transition-transform inline-block">
        {button} →
      </Link>
    </div>
  );
}