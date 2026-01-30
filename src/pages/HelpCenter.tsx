import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HelpCenter() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-light flex flex-col">
            {/* 1. Navigation */}
            <nav className="flex justify-between items-center px-8 py-10 max-w-6xl mx-auto w-full">
                <Link to="/" className="text-lg font-medium tracking-tight">
                    Redlix <span className="text-blue-500">Tracker</span>
                </Link>
                <div className="flex gap-8 items-center text-sm text-neutral-400">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
                    <Link to="/contact" className="bg-white text-black px-5 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-all">
                        Contact us
                    </Link>
                </div>
            </nav>

            {/* 2. Main Content */}
            <main className="max-w-6xl mx-auto px-8 flex-grow w-full pt-10 pb-20">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h1 className="text-4xl font-normal mb-6 tracking-tight">
                        How can we <span className="text-blue-500">help?</span>
                    </h1>
                    <p className="text-neutral-400 text-base leading-relaxed mb-8">
                        Browse our knowledge base or reach out to our dedicated support team.
                    </p>
                    <div className="relative max-w-lg mx-auto">
                        <Input
                            placeholder="Search for answers..."
                            className="h-14 bg-[#0A0A0A] border-neutral-800 text-white pl-6 rounded-full focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <HelpCard
                        title="Getting Started"
                        desc="New to Redlix Tracker? Learn the basics of setting up your dashboard."
                        link="/docs"
                    />
                    <HelpCard
                        title="Account & Billing"
                        desc="Manage your subscription, invoices, and account settings."
                        link="/docs"
                    />
                    <HelpCard
                        title="Project Management"
                        desc="Tips and tricks for managing your projects efficiently."
                        link="/docs"
                    />
                    <HelpCard
                        title="Troubleshooting"
                        desc="Facing issues? Find solutions to common problems."
                        link="/docs"
                    />
                    <HelpCard
                        title="API Integrations"
                        desc="Connect Redlix Tracker with your favorite tools."
                        link="/docs"
                    />
                    <HelpCard
                        title="Community"
                        desc="Join our community forum to connect with other users."
                        link="#"
                    />
                </div>

                <div className="mt-24 p-12 bg-[#0A0A0A] border border-neutral-800 rounded-2xl text-center">
                    <h2 className="text-2xl font-normal mb-4">Still need support?</h2>
                    <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
                        Our team is available 24/7 to help you with any issues you might face.
                        Don't hesitate to reach out.
                    </p>
                    <Link to="/contact">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-xl text-base">
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </main>

            {/* 3. Footer */}
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
                                <Link to="/" className="block opacity-70 hover:opacity-100">Home</Link>
                                <Link to="/admin" className="block opacity-70 hover:opacity-100">Admin portal</Link>
                                <Link to="/client" className="block opacity-70 hover:opacity-100">Client portal</Link>
                            </div>
                            <div className="space-y-3 text-sm">
                                <p className="font-medium">Support</p>
                                <Link to="/docs" className="block opacity-70 hover:opacity-100">Documentation</Link>
                                <Link to="/help" className="block opacity-100 font-medium">Help center</Link>
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

function HelpCard({ title, desc, link }: { title: string, desc: string, link: string }) {
    return (
        <div className="p-8 border border-neutral-800 bg-[#0A0A0A] rounded-xl hover:border-blue-500 transition-colors group cursor-pointer">
            <h3 className="text-lg font-normal mb-3 text-white group-hover:text-blue-500 transition-colors">
                {title}
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                {desc}
            </p>
            <Link to={link} className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">
                Read more →
            </Link>
        </div>
    );
}
