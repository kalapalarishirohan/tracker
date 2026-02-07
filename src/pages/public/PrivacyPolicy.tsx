import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-light flex flex-col selection:bg-[#059669]/30">

            {/* 1. Header Navigation */}
            <nav className="flex justify-between items-center px-8 py-8 max-w-5xl mx-auto w-full">
                <Link to="/" className="flex items-center">
                    <img
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png"
                        alt="CSAPP Logo"
                        className="h-10 w-auto"
                    />
                </Link>
                <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Close
                </Link>
            </nav>

            {/* 2. Content */}
            <main className="flex-grow max-w-3xl mx-auto px-8 py-12 w-full">
                <header className="mb-16">
                    <h1 className="text-4xl font-normal mb-4 tracking-tight">Privacy <span className="text-[#059669]">Policy</span></h1>
                    <p className="text-neutral-500 text-sm">Last updated: February 7, 2026</p>
                </header>

                <div className="space-y-12 text-sm leading-relaxed text-neutral-300">
                    <section className="space-y-4">
                        <p className="text-white text-base">
                            At CSAPP, we believe great design is invisible—and so is our approach to privacy. We are committed to protecting the personal information you share with us and using it responsibly.
                        </p>
                        <p>
                            This Privacy Policy explains how we collect, use, and safeguard information when you visit or interact with the CSAPP website and project tracking system.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">1. Information We Collect</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-white font-medium mb-2">Personal & Contact Information</h3>
                                <p className="mb-2">When you contact us or start a project request, we may collect:</p>
                                <ul className="list-disc list-inside space-y-1 text-neutral-400">
                                    <li>Full Name</li>
                                    <li>Work Email Address</li>
                                    <li>Company Name</li>
                                    <li>Any communication details you choose to share</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-2">Project & Business Data</h3>
                                <p className="mb-2">To provide our services, we collect specific project parameters including:</p>
                                <ul className="list-disc list-inside space-y-1 text-neutral-400">
                                    <li>Project Name and Type (Web/Mobile/Other)</li>
                                    <li>Budget range and Timeline preferences</li>
                                    <li>Detailed project goals and descriptions</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-2">Usage Data</h3>
                                <p className="mb-2">We may automatically collect limited technical data such as:</p>
                                <ul className="list-disc list-inside space-y-1 text-neutral-400">
                                    <li>Browser type and Device information</li>
                                    <li>Pages visited and Time spent on the platform</li>
                                    <li>Access logs for secure portals</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">2. How We Use Your Information</h2>
                        <p>CSAPP uses your information to:</p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-400">
                            <li>Respond to inquiries and project requests</li>
                            <li>Communicate about our services and active projects</li>
                            <li>Improve platform usability and performance</li>
                            <li>Maintain security and prevent unauthorized access</li>
                        </ul>
                        <p className="pt-2 text-[#059669] font-medium">We do not sell, rent, or trade your personal information.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">3. Cookies</h2>
                        <p>
                            Our website uses cookies or similar technologies to enhance functionality, remember your preferences, and analyze platform usage. You may disable cookies in your browser settings if you prefer, though some features may not function correctly.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">4. Data Security</h2>
                        <p>
                            We take reasonable technical and organizational measures to protect your data. All sensitive project data is stored securely and access is restricted to authorized personnel. However, no online system is completely secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">5. Third-Party Services</h2>
                        <p>
                            We may use trusted third-party tools (such as Supabase for database management or mail services) that process limited data on our behalf. These services operate under their own privacy policies.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-400">
                            <li>Request access to your personal data</li>
                            <li>Request correction or deletion of your information</li>
                            <li>Withdraw consent for data usage</li>
                        </ul>
                        <p>You can exercise these rights by contacting us through our platform support.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">7. Policy Updates</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated "Last updated" date at the top.
                        </p>
                    </section>

                    <section className="space-y-4 pt-8 border-t border-neutral-800">
                        <p className="text-neutral-500 italic">
                            If you have any questions about this Privacy Policy, please contact us at support.ckrdatapoint@gmail.com.
                        </p>
                    </section>
                </div>
            </main>

            {/* 3. Simple Footer */}
            <footer className="border-t border-neutral-900 py-12 px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-xs text-neutral-600">© 2026 CSAPP Systems Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
