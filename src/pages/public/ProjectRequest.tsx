import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function ProjectRequest() {
    // --- Functional Logic (Preserved) ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        projectName: "",
        projectType: "",
        budget: "",
        timeline: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.projectName || !formData.projectType) {
            toast.error("Required fields missing", { description: "Please fill out all required fields." });
            return;
        }
        setIsSubmitting(true);
        try {
            const { error: dbError } = await supabase
                .from('submissions')
                .insert({
                    client_id: '00000000-0000-0000-0000-000000000000',
                    type: 'project_request',
                    data: formData,
                    status: 'pending'
                });
            if (dbError) console.error("Database error:", dbError);
            const { error: emailError } = await supabase.functions.invoke('send-admin-notification', {
                body: { type: 'project_request', data: formData }
            });
            if (emailError) console.error("Email notification error:", emailError);
            setIsSubmitted(true);
            toast.success("Request sent successfully");
        } catch (error) {
            console.error("Error submitting project request:", error);
            toast.error("Submission failed", { description: "Please try again later." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Success State View ---
    if (isSubmitted) {
        return (
            <div className="h-screen w-full bg-[#050505] text-white flex items-center justify-center p-6 font-light overflow-hidden">
                <div className="text-center space-y-6 max-w-sm bg-[#0A0A0A] border border-neutral-800 p-12 rounded-2xl">
                    <h2 className="text-3xl font-normal">Request received</h2>
                    <p className="text-neutral-500 text-sm">
                        Our team will review your requirements and reach out within 48 hours.
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

            {/* Top Bar */}
            <div className="bg-[#059669] py-2 px-4 text-center">
                <p className="text-xs font-medium text-white">
                    Submit your project details safely. All requests are encrypted.
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex justify-between items-center px-8 py-8 max-w-7xl mx-auto w-full">
                <Link to="/" className="flex items-center">
                    <img
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" // Add your external logo link here
                        alt="CSAPP Logo"
                        className="h-10 w-auto"
                    />
                </Link>
                <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Cancel request
                </Link>
            </nav>

            {/* Main Layout */}
            <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-8 gap-16 items-center pb-12">

                {/* Left Side: Information (Steps Removed) */}
                <div className="w-full md:w-1/3">
                    <h1 className="text-4xl font-normal mb-6 leading-tight">
                        Start your <br />
                        <span className="text-[#059669] font-medium">project request.</span>
                    </h1>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                        Provide your contact details and project goals. We use this information to plan timelines and resources.
                    </p>
                </div>

                {/* Right Side: The Form */}
                <div className="w-full md:w-2/3 bg-[#0A0A0A] border border-neutral-800 p-8 md:p-10 rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Row 1: Contact Info */}
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

                        {/* Row 2: Company & Project Name */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-neutral-400 ml-1">Company name</label>
                                <Input
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Your organization"
                                    className="h-12 bg-black border-neutral-800 text-white rounded-xl focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-neutral-400 ml-1">Project name</label>
                                <Input
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                    placeholder="Internal reference name"
                                    className="h-12 bg-black border-neutral-800 text-white rounded-xl focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 3: Selectors with updated CSS */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-neutral-400 ml-1">Project type</label>
                                <Select onValueChange={(v) => setFormData({ ...formData, projectType: v })}>
                                    <SelectTrigger className="h-12 bg-black border-neutral-800 text-white rounded-xl focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0A0A0A] border-neutral-800 text-white">
                                        <SelectItem value="web" className="focus:bg-[#059669] focus:text-white">Web application</SelectItem>
                                        <SelectItem value="mobile" className="focus:bg-[#059669] focus:text-white">Mobile application</SelectItem>
                                        <SelectItem value="other" className="focus:bg-[#059669] focus:text-white">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-neutral-400 ml-1">Budget range</label>
                                <Select onValueChange={(v) => setFormData({ ...formData, budget: v })}>
                                    <SelectTrigger className="h-12 bg-black border-neutral-800 text-white rounded-xl focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none">
                                        <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0A0A0A] border-neutral-800 text-white">
                                        <SelectItem value="5k-10k" className="focus:bg-[#059669] focus:text-white">₹5k - ₹10k</SelectItem>
                                        <SelectItem value="15k-20k" className="focus:bg-[#059669] focus:text-white">₹15k - ₹20k</SelectItem>
                                        <SelectItem value="25k-50k" className="focus:bg-[#059669] focus:text-white">₹25k - ₹50k</SelectItem>
                                        <SelectItem value="50k-1L" className="focus:bg-[#059669] focus:text-white">₹50k - ₹1L</SelectItem>
                                        <SelectItem value="1L+" className="focus:bg-[#059669] focus:text-white">₹1L+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-neutral-400 ml-1">Timeline</label>
                                <Select onValueChange={(v) => setFormData({ ...formData, timeline: v })}>
                                    <SelectTrigger className="h-12 bg-black border-neutral-800 text-white rounded-xl focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none">
                                        <SelectValue placeholder="Select speed" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0A0A0A] border-neutral-800 text-white">
                                        <SelectItem value="urgent" className="focus:bg-[#059669] focus:text-white">Urgent (4-5 business days)</SelectItem>
                                        <SelectItem value="standard" className="focus:bg-[#059669] focus:text-white">Standard (2 weeks)</SelectItem>
                                        <SelectItem value="flexible" className="focus:bg-[#059669] focus:text-white">Flexible (Project dependent)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Row 4: Textarea */}
                        <div className="space-y-2">
                            <label className="text-xs text-neutral-400 ml-1">Project description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Tell us about your goals..."
                                rows={3}
                                className="bg-black border-neutral-800 text-white rounded-xl focus:ring-1 focus:ring-[#059669] focus:border-[#059669] outline-none resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-[#059669] hover:bg-[#059669]/90 text-white font-medium rounded-xl transition-all"
                        >
                            {isSubmitting ? "Sending request..." : "Submit request"}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}