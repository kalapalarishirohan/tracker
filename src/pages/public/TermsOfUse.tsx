import { Link } from "react-router-dom";

export default function TermsOfUse() {
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
                    <h1 className="text-4xl font-normal mb-4 tracking-tight">Terms of <span className="text-[#059669]">Use</span></h1>
                    <p className="text-neutral-500 text-sm">Last updated: February 7, 2026</p>
                </header>

                <div className="space-y-12 text-sm leading-relaxed text-neutral-300">
                    <section className="space-y-4">
                        <p className="text-white text-base">
                            By accessing or using the CSAPP website and project tracking platform, you agree to these Terms of Use. If you do not agree, please discontinue use of the platform.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">1. Use of Website & Portal</h2>
                        <p>
                            The CSAPP platform is provided for project tracking, communication, and asset management. You agree to use the site lawfully and in a manner that does not infringe on the rights of others.
                        </p>
                        <p>
                            If you are a Client, you are responsible for maintaining the confidentiality of your unique project access key. Any unauthorized use of your key should be reported immediately.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">2. Intellectual Property</h2>
                        <p>
                            All content on this platform—including text, visuals, branding, layouts, dashboard designs, and underlying code—is the intellectual property of CSAPP, unless otherwise stated.
                        </p>
                        <p>
                            You may not copy, reproduce, distribute, or modify any proprietary portal components without prior written permission.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">3. Services & Engagement</h2>
                        <p>
                            Submitting a contact form or project request through this system does not establish a formal client relationship.
                        </p>
                        <p>
                            Development services are provided only after mutual agreement, confirmation, and acceptance of project-specific terms. As noted in our pricing model, projects typically require a 50% upfront payment to initiate work.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">4. Limitation of Liability</h2>
                        <p>CSAPP and its operators are not liable for:</p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-400">
                            <li>Any direct or indirect damages arising from platform use</li>
                            <li>Temporary unavailability or technical maintenance issues</li>
                            <li>Errors, omissions, or outdated project information on the dashboard</li>
                            <li>Third-party services or links (e.g., development tools, hosting) accessed through the system</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">5. External Links</h2>
                        <p>
                            The platform may include links to third-party tools or external websites. CSAPP is not responsible for the content, privacy policies, or practices of those external sites.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">6. Termination of Access</h2>
                        <p>
                            We reserve the right to restrict or terminate access to the project portal at any time without notice if these Terms are violated or if project engagements are terminated.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">7. Governing Law</h2>
                        <p>
                            These Terms are governed by and interpreted in accordance with the laws of India.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-normal text-white border-b border-neutral-900 pb-2">8. Changes to Terms</h2>
                        <p>
                            CSAPP may revise these Terms of Use at any time. Continued use of the platform indicates your acceptance of the updated terms.
                        </p>
                    </section>

                    <section className="space-y-4 pt-8 border-t border-neutral-800">
                        <p className="text-neutral-500 italic">
                            For questions regarding these Terms, please contact us at support.ckrdatapoint@gmail.com.
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
