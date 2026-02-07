
import { Link } from "react-router-dom";
import { Check, X, Code, Smartphone, Database, Cloud, CreditCard, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-light flex flex-col selection:bg-[#059669]/30">

            {/* 1. Navigation */}
            <nav className="flex justify-between items-center px-8 py-10 max-w-6xl mx-auto w-full">
                <Link to="/" className="flex items-center">
                    <img
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" // Add your external logo link here
                        alt="CSAPP Logo"
                        className="h-10 w-auto"
                    />
                </Link>
                <div className="hidden md:flex gap-8 items-center text-sm text-neutral-400">
                    <Link to="/pricing" className="text-white">Pricing</Link>
                    <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
                    <Link to="/help" className="hover:text-white transition-colors">Help Center</Link>
                    <Link to="/contact" className="bg-white text-black px-5 py-2 rounded-md hover:bg-[#059669] hover:text-white transition-all">
                        Contact us
                    </Link>
                </div>
            </nav>

            {/* 2. Header Section */}
            <div className="max-w-6xl mx-auto px-8 py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 tracking-tight">
                    Transparent <span className="text-[#059669]">Service Pricing.</span>
                </h1>
                <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                    From custom development to cloud infrastructure. Choose the services that power your business.
                </p>
            </div>

            {/* 3. Service Pricing Grid */}
            <div className="max-w-6xl mx-auto px-8 pb-20 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Web Development */}
                <ServiceCard
                    icon={Code}
                    title="Web Development"
                    price="₹25k"
                    suffix="onwards"
                    description="Custom websites, landing pages, and web applications."
                    features={[
                        "React / Next.js Architecture",
                        "Responsive Design",
                        "SEO Optimization",
                        "Admin Dashboard Integration",
                        "Performance Tuning"
                    ]}
                />

                {/* App Development */}
                <ServiceCard
                    icon={Smartphone}
                    title="App Development"
                    price="₹45k"
                    suffix="onwards"
                    description="Native and cross-platform mobile applications."
                    features={[
                        "iOS & Android (Flutter/React Native)",
                        "Custom UI/UX Design",
                        "Push Notifications",
                        "App Store Submission",
                        "Offline Capability"
                    ]}
                    highlight
                />

                {/* CMS Systems */}
                <ServiceCard
                    icon={Layout}
                    title="CMS Systems"
                    price="₹15k"
                    suffix="setup fee"
                    description="Manage your content easily with custom CMS solutions."
                    features={[
                        "Headless CMS (Strapi/Sanity)",
                        "Custom Content Types",
                        "Role-Based Access Control",
                        "Media Library Management",
                        "API Integration"
                    ]}
                />

                {/* CRM Systems */}
                <ServiceCard
                    icon={Database}
                    title="CRM Systems"
                    price="₹35k"
                    suffix="onwards"
                    description="Customer relationship management tailored to your workflow."
                    features={[
                        "Lead & Contact Management",
                        "Sales Pipeline Tracking",
                        "Automated Email Sequences",
                        "Reporting & Analytics Dashboard",
                        "Third-party Integrations"
                    ]}
                />

                {/* Cloud Systems */}
                <ServiceCard
                    icon={Cloud}
                    title="Cloud Infrastructure"
                    price="Custom"
                    description="Scalable cloud solutions and DevOps services."
                    features={[
                        "AWS / Google Cloud / Azure Setup",
                        "CI/CD Pipeline Configuration",
                        "Serverless Architecture",
                        "Database Optimization",
                        "Security Audits"
                    ]}
                />

                {/* Payment Details */}
                <PaymentCard />

            </div>

            {/* 4. Enterprise/Custom Section */}
            <div className="max-w-6xl mx-auto px-8 pb-20">
                <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl font-normal text-white mb-4">Need a custom enterprise solution?</h2>
                    <p className="text-neutral-500 mb-8 max-w-xl mx-auto">
                        For large-scale organizations requiring dedicated resources, on-premise deployment, and SLA support.
                    </p>
                    <Link to="/contact">
                        <Button className="bg-white text-black hover:bg-neutral-200 px-8 py-6 rounded-xl font-medium text-base">
                            Contact Sales Team
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 5. Footer */}
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
                            <Link to="/docs" className="block opacity-70 hover:opacity-100">Documentation</Link>
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

interface ServiceCardProps {
    icon: any;
    title: string;
    price: string;
    suffix?: string;
    description: string;
    features: string[];
    highlight?: boolean;
}

function ServiceCard({ icon: Icon, title, price, suffix, description, features, highlight }: ServiceCardProps) {
    return (
        <div className={`flex flex-col p-8 rounded-2xl border transition-all duration-300 ${highlight ? 'bg-[#0A0A0A] border-[#059669]/50 shadow-2xl shadow-[#059669]/10' : 'bg-[#0A0A0A] border-neutral-800 hover:border-neutral-700'}`}>
            <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${highlight ? 'bg-[#059669]/10 text-[#059669]' : 'bg-neutral-900 text-white'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-bold text-white">{price}</span>
                    {suffix && <span className="text-neutral-500 text-xs uppercase tracking-wider">{suffix}</span>}
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="flex-grow space-y-3 mb-8">
                {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${highlight ? 'text-[#059669]' : 'text-neutral-600'}`} />
                        <span className="text-sm text-neutral-300">{feature}</span>
                    </div>
                ))}
            </div>

            <Link to="/request-project" className="mt-auto">
                <Button className={`w-full h-12 font-medium rounded-xl transition-all ${highlight ? 'bg-[#059669] hover:bg-[#059669]/90 text-white' : 'bg-white text-black hover:bg-neutral-200'}`}>
                    Start Project
                </Button>
            </Link>
        </div>
    );
}

function PaymentCard() {
    return (
        <div className="flex flex-col p-8 rounded-2xl border border-neutral-800 bg-neutral-900/20 hover:border-neutral-700 transition-all duration-300">
            <div className="mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-green-500/10 text-green-500">
                    <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Payment Details</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                    We accept secure payments via major methods. 50% upfront required for project initiation.
                </p>

                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#0A0A0A] border border-neutral-800">
                        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Bank Transfer / UPI</p>
                        <p className="text-white font-mono text-sm">UPI: csapp@okhdfcbank</p>
                        <p className="text-neutral-400 text-xs mt-1">Acc: 1234567890 • IFSC: HDFC000123</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-[#0A0A0A] border border-neutral-800 rounded-md text-xs text-neutral-400">Visa</span>
                        <span className="px-3 py-1 bg-[#0A0A0A] border border-neutral-800 rounded-md text-xs text-neutral-400">Mastercard</span>
                        <span className="px-3 py-1 bg-[#0A0A0A] border border-neutral-800 rounded-md text-xs text-neutral-400">PayPal</span>
                    </div>
                </div>
            </div>
            <Link to="/contact" className="mt-auto">
                <Button variant="outline" className="w-full h-12 font-medium rounded-xl border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all">
                    Contact Billing
                </Button>
            </Link>
        </div>
    );
}
