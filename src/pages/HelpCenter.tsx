import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HelpCenter() {
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
                    <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
                    <Link to="/contact" className="bg-white text-black px-5 py-2 rounded-md hover:bg-[#059669] hover:text-white transition-all">
                        Contact us
                    </Link>
                </div>
            </nav>

            {/* 2. Main Content */}
            <main className="max-w-6xl mx-auto px-8 flex-grow w-full pt-10 pb-20">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h1 className="text-4xl font-normal mb-6 tracking-tight">
                        How can we <span className="text-[#059669]">help?</span>
                    </h1>
                    <p className="text-neutral-400 text-base leading-relaxed mb-8">
                        Browse our knowledge base or reach out to our dedicated support team.
                    </p>
                    <div className="relative max-w-lg mx-auto">
                        <Input
                            placeholder="Search for answers..."
                            className="h-14 bg-[#0A0A0A] border-neutral-800 text-white pl-6 rounded-full focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <HelpCard
                        title="Getting Started"
                        desc="New to CSAPP? Learn the basics of setting up your dashboard."
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
                        desc="Connect CSAPP with your favorite tools."
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
                        <Button className="bg-[#059669] hover:bg-[#059669]/90 text-white px-8 h-12 rounded-xl text-base">
                            Contact Support
                        </Button>
                    </Link>
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
                        </div>

                        <div className="col-span-1 space-y-3 text-sm">
                            <p className="font-medium">Support & Legal</p>
                            <Link to="/docs" className="block opacity-70 hover:opacity-100">Documentation</Link>
                            <Link to="/help" className="block opacity-100 font-medium">Help center</Link>
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

function HelpCard({ title, desc, link }: { title: string, desc: string, link: string }) {
    return (
        <div className="p-8 border border-neutral-800 bg-[#0A0A0A] rounded-xl hover:border-[#059669] transition-colors group cursor-pointer">
            <h3 className="text-lg font-normal mb-3 text-white group-hover:text-[#059669] transition-colors">
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
