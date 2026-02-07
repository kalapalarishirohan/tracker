import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-light flex flex-col">
      {/* 1. Navigation */}
      <nav className="flex justify-between items-center px-8 py-10 max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center">
          <img
            src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" // Add your external logo link here
            alt="CSAPP Logo"
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex gap-8 items-center text-sm text-neutral-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/help" className="hover:text-white transition-colors">Help Center</Link>
          <Link to="/contact" className="bg-white text-black px-5 py-2 rounded-md hover:bg-[#059669] hover:text-white transition-all">
            Contact us
          </Link>
        </div>
      </nav>

      {/* 2. Main Content */}
      <main className="max-w-6xl mx-auto px-8 flex-grow w-full pt-10 pb-20">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl font-normal mb-6 tracking-tight">
            <span className="text-[#059669]">Documentation</span>
          </h1>
          <p className="text-neutral-400 text-base leading-relaxed">
            Complete guide to the CSAPP ecosystem. Learn how to manage projects, track development, and collaborate with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="space-y-8 hidden md:block col-span-1 sticky top-10 h-fit">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white uppercase tracking-wider">General</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="text-[#059669] cursor-pointer">Introduction</li>
                <li className="hover:text-white cursor-pointer transition-colors"><a href="#getting-started">Getting Started</a></li>
                <li className="hover:text-white cursor-pointer transition-colors"><a href="#public-features">Public Features</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white uppercase tracking-wider">Client Portal</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="hover:text-white cursor-pointer transition-colors"><a href="#client-dashboard">Dashboard</a></li>
                <li className="hover:text-white cursor-pointer transition-colors"><a href="#project-requests">Project Requests</a></li>
                <li className="hover:text-white cursor-pointer transition-colors"><a href="#support-tickets">Support Tickets</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white uppercase tracking-wider">Pro Features</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="hover:text-white cursor-pointer transition-colors"><a href="#dev-tracking">Development Tracking</a></li>
                <li className="hover:text-white cursor-pointer transition-colors"><a href="#asset-management">Asset Management</a></li>
              </ul>
            </div>
          </aside>

          {/* Doc Content */}
          <div className="md:col-span-3 space-y-16">

            {/* Introduction */}
            <section id="introduction" className="scroll-mt-24">
              <h2 className="text-2xl font-normal text-white mb-4">Introduction</h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                CSAPP is a centralized project management platform designed to bridge the gap between clients and our development team.
                It offers tailored portals for standard clients, pro enterprise clients, and administrators to ensure real-time transparency and efficient workflow management.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-[#0A0A0A] border border-neutral-800 rounded-xl">
                  <h3 className="text-white font-medium mb-2">For Clients</h3>
                  <p className="text-sm text-neutral-400">
                    Track project status, submit support tickets, view history, and request new projects directly from your dashboard.
                  </p>
                </div>
                <div className="p-6 bg-[#0A0A0A] border border-neutral-800 rounded-xl">
                  <h3 className="text-white font-medium mb-2">For Pro Clients</h3>
                  <p className="text-sm text-neutral-400">
                    Access advanced features like real-time App & Web development tracking, asset management, and strategic approach plans.
                  </p>
                </div>
              </div>
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="scroll-mt-24 pt-8 border-t border-neutral-800">
              <h2 className="text-2xl font-normal text-white mb-4">Getting Started</h2>
              <p className="text-neutral-400 leading-relaxed mb-4">
                CSAPP is an invitation-only platform. Your account credentials will be provided by your project manager.
              </p>
              <ul className="list-disc list-inside text-neutral-400 space-y-2 ml-2">
                <li><strong>Login URL:</strong> <Link to="/client" className="text-[#059669] hover:underline">/client</Link> for standard access.</li>
                <li><strong>Admin Access:</strong> <Link to="/admin" className="text-[#059669] hover:underline">/admin</Link> for internal team members.</li>
              </ul>
            </section>

            {/* Public Features */}
            <section id="public-features" className="scroll-mt-24 pt-8 border-t border-neutral-800">
              <h2 className="text-2xl font-normal text-white mb-4">Public Features</h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Even without an account, prospective clients can utilize our public tools to initiate engagement.
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg text-white mb-2">Request Project</h3>
                  <p className="text-neutral-400 text-sm mb-2">
                    Submit a detailed project brief to get a quote and timeline estimate. This is the first step for new engagements.
                  </p>
                  <Link to="/request-project" className="text-[#059669] text-sm hover:underline">Go to Request Form &rarr;</Link>
                </div>
                <div>
                  <h3 className="text-lg text-white mb-2">Contact Support</h3>
                  <p className="text-neutral-400 text-sm mb-2">
                    General inquiries or pre-sales questions can be sent via our contact form. Our remote team typically responds within 12 hours.
                  </p>
                  <Link to="/contact" className="text-[#059669] text-sm hover:underline">Go to Contact Page &rarr;</Link>
                </div>
              </div>
            </section>

            {/* Client Portal */}
            <section id="client-dashboard" className="scroll-mt-24 pt-8 border-t border-neutral-800">
              <h2 className="text-2xl font-normal text-white mb-4">Client Portal</h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                The Client Portal is your command center. Once logged in, you gain access to the following modules:
              </p>

              <div className="space-y-8">
                <div id="project-requests">
                  <h3 className="text-xl text-white mb-3">Dashboard Overview</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    A snapshot of your active projects, pending tickets, and recent activity. Use this to get a quick pulse on your engagement's health.
                  </p>
                </div>

                <div id="support-tickets">
                  <h3 className="text-xl text-white mb-3">Support Tickets System</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                    Found a bug or need a change? Use the Tickets module to submit requests directly to our dev team.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <li className="bg-[#0A0A0A] p-4 rounded-lg border border-neutral-800">
                      <span className="text-white block mb-1">New Ticket</span>
                      <span className="text-neutral-500 text-xs">Submit issues with priority levels and descriptions.</span>
                    </li>
                    <li className="bg-[#0A0A0A] p-4 rounded-lg border border-neutral-800">
                      <span className="text-white block mb-1">Ticket History</span>
                      <span className="text-neutral-500 text-xs">Track the resolution status of all your past requests.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Pro Client Features */}
            <section id="pro-features" className="scroll-mt-24 pt-8 border-t border-neutral-800">
              <h2 className="text-2xl font-normal text-white mb-4">Pro Client Features</h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Pro clients have access to specialized tools for complex, long-term development projects.
              </p>

              <div className="space-y-8">
                <div id="dev-tracking">
                  <h3 className="text-xl text-white mb-3">Live Development Tracking</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                    Monitor the progress of your App or Web build in real-time. This module provides granular updates on development milestones.
                  </p>
                  <div className="flex gap-4">
                    <div className="px-4 py-2 bg-blue-900/20 text-blue-400 text-xs rounded border border-blue-900/30">App Tracking</div>
                    <div className="px-4 py-2 bg-green-900/20 text-green-400 text-xs rounded border border-green-900/30">Web Tracking</div>
                  </div>
                </div>

                <div id="asset-management">
                  <h3 className="text-xl text-white mb-3">Asset Management</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    A secure repository for shared design files, documents, and resources relevant to your project.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Approach Plans</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Review and approve strategic plans and technical roadmaps proposed by our architects before implementation begins.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* 3. Footer */}
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
              <Link to="/" className="block opacity-70 hover:opacity-100">Home</Link>
              <Link to="/pricing" className="block opacity-70 hover:opacity-100">Pricing</Link>
              <Link to="/client" className="block opacity-70 hover:opacity-100">Client portal</Link>
              <Link to="/request-project" className="block opacity-70 hover:opacity-100">Request project</Link>
            </div>

            <div className="col-span-1 space-y-3 text-sm">
              <p className="font-medium">Support & Legal</p>
              <Link to="/docs" className="block opacity-100 font-medium">Documentation</Link>
              <Link to="/help" className="block opacity-70 hover:opacity-100">Help center</Link>
              <Link to="/privacy" className="block opacity-70 hover:opacity-100 pt-2">Privacy policy</Link>
              <Link to="/terms" className="block opacity-70 hover:opacity-100">Terms of use</Link>
            </div>

            <div className="col-span-1 md:text-right text-sm space-y-1 opacity-70">
              <p>System status: Online</p>
              <p>Version 2.6.4</p>
              <p className="pt-2 text-[10px] opacity-50">© 2026 CSAPP Systems Inc.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
