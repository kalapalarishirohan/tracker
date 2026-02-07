import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
    // --- Functional Logic (Fully Preserved) ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Required fields missing", { description: "Please fill in all required fields." });
            return;
        }
        setIsSubmitting(true);
        try {
            const { error: dbError } = await supabase
                .from('submissions')
                .insert({
                    client_id: '00000000-0000-0000-0000-000000000000',
                    type: 'contact',
                    data: formData,
                    status: 'pending'
                });
            if (dbError) {
                console.error("Database error:", dbError);
                toast.error("Failed to send message", { description: "Please try again later." });
                setIsSubmitting(false);
                return;
            }
            // Send email notification (non-blocking)
            try {
                await supabase.functions.invoke('send-admin-notification', {
                    body: { type: 'contact', data: formData }
                });
            } catch (emailError) {
                console.error("Email notification error:", emailError);
            }
            setIsSubmitted(true);
            toast.success("Message sent successfully");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message", { description: "Please try again later." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Success State View ---
    if (isSubmitted) {
        return (
            <div className="h-screen w-full bg-[#050505] text-white flex items-center justify-center p-6 font-light overflow-hidden">
                <div className="text-center space-y-6 max-w-sm bg-[#0A0A0A] border border-neutral-800 p-12 rounded-2xl">
                    <h2 className="text-3xl font-normal">Message sent</h2>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                        Our remote team has received your message. We typically respond within 24 hours.
                    </p>
                    <Link to="/" className="block pt-4">
                        <Button className="bg-[#059669] hover:bg-[#059669]/90 w-full h-12 font-medium rounded-xl">
                            Return to home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#050505] text-white flex flex-col font-light selection:bg-[#059669]/30 overflow-hidden">

            {/* 1. Top Bar */}
            <div className="bg-[#059669] py-2 px-4 text-center">
                <p className="text-xs font-medium text-white">
                    Global remote support active. Average response: 12h.
                </p>
            </div>

            {/* 2. Navigation */}
            <nav className="flex justify-between items-center px-8 py-8 max-w-7xl mx-auto w-full">
                <Link to="/" className="flex items-center">
                    <img
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" // Add your external logo link here
                        alt="CSAPP Logo"
                        className="h-10 w-auto"
                    />
                </Link>
                <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Cancel message
                </Link>
            </nav>

            {/* 3. Main Layout */}
            <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-8 gap-16 items-center pb-12">

                {/* Left Side: Information */}
                <div className="w-full md:w-1/3">
                    <h1 className="text-4xl font-normal mb-6 leading-tight">
                        Get in <br />
                        <span className="text-[#059669] font-medium">touch.</span>
                    </h1>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-8">
                        Have a technical question or want to work with us? Our distributed team is ready to help.
                    </p>

                    <div className="space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-[#059669] font-bold">Email</p>
                            <p className="text-sm text-neutral-300">support.ckrdatapoint@gmail.com</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-[#059669] font-bold">Operations</p>
                            <p className="text-sm text-neutral-300">100% Remote / Distributed</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: The Form */}
                <div className="w-full md:w-2/3 bg-[#0A0A0A] border border-neutral-800 p-8 md:p-10 rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-neutral-400 ml-1">Full name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Jane Doe"
                                    className="h-12 bg-black border-neutral-800 text-white rounded-xl focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-neutral-400 ml-1">Work email</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@company.com"
                                    className="h-12 bg-black border-neutral-800 text-white rounded-xl focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-neutral-400 ml-1">Subject</label>
                            <Input
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="How can we help?"
                                className="h-12 bg-black border-neutral-800 text-white rounded-xl focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-neutral-400 ml-1">Message</label>
                            <Textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Tell us more about your inquiry..."
                                rows={5}
                                className="bg-black border-neutral-800 text-white rounded-xl focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none resize-none"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-[#059669] hover:bg-[#059669]/90 text-white font-medium rounded-xl transition-all"
                        >
                            {isSubmitting ? "Sending message..." : "Send message"}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}