import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, CheckCircle, Rocket, Layers, Clock, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Background Texture
const NoiseTexture = () => (
    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay fixed"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

export default function ProjectRequest() {
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
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Store in submissions table
            const { error: dbError } = await supabase
                .from('submissions')
                .insert({
                    client_id: '00000000-0000-0000-0000-000000000000', // Public submission placeholder
                    type: 'project_request',
                    data: formData,
                    status: 'pending'
                });

            if (dbError) {
                console.error("Database error:", dbError);
            }

            // Send admin notification email
            const { error: emailError } = await supabase.functions.invoke('send-admin-notification', {
                body: {
                    type: 'project_request',
                    data: formData
                }
            });

            if (emailError) {
                console.error("Email notification error:", emailError);
            }

            setIsSubmitted(true);
            toast.success("Project request submitted successfully!");
        } catch (error) {
            console.error("Error submitting project request:", error);
            toast.error("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-4">
                <NoiseTexture />
                <Card className="w-full max-w-md bg-neutral-950 border-neutral-800 text-center">
                    <CardContent className="pt-12 pb-8">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
                        <p className="text-neutral-400 mb-8">
                            Our team will review your project request and get back to you within 24-48 hours.
                        </p>
                        <Link to="/">
                            <Button className="bg-white hover:bg-neutral-200 text-black">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <NoiseTexture />
            
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-neutral-900 bg-black/90 backdrop-blur-md flex justify-between items-center px-6 md:px-12">
                <Link to="/" className="flex items-center gap-4">
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        Redlix Tracker
                    </h1>
                </Link>
                <Link to="/">
                    <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Start Your Project</h1>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Tell us about your project and we'll help bring your vision to life.
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { icon: Rocket, label: "Fast Delivery" },
                        { icon: Layers, label: "Quality Work" },
                        { icon: Clock, label: "On-Time" },
                        { icon: Wallet, label: "Fair Pricing" },
                    ].map((item, index) => (
                        <div key={index} className="bg-neutral-950 border border-neutral-800 rounded-sm p-4 flex flex-col items-center text-center">
                            <item.icon className="w-6 h-6 text-white mb-2" />
                            <span className="text-sm text-neutral-400">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <Card className="bg-neutral-950 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Project Details</CardTitle>
                        <CardDescription className="text-neutral-400">
                            Provide as much detail as possible to help us understand your needs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Contact Information</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">Name *</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your name"
                                            className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">Email *</Label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="your@email.com"
                                            className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">Company</Label>
                                        <Input
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            placeholder="Company name"
                                            className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="space-y-4 pt-4 border-t border-neutral-800">
                                <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Project Information</h3>
                                
                                <div className="space-y-2">
                                    <Label className="text-neutral-300">Project Name *</Label>
                                    <Input
                                        value={formData.projectName}
                                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                        placeholder="Give your project a name"
                                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">Project Type *</Label>
                                        <Select 
                                            value={formData.projectType} 
                                            onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                                        >
                                            <SelectTrigger className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                <SelectItem value="web-app">Web Application</SelectItem>
                                                <SelectItem value="mobile-app">Mobile App</SelectItem>
                                                <SelectItem value="website">Website</SelectItem>
                                                <SelectItem value="e-commerce">E-Commerce</SelectItem>
                                                <SelectItem value="branding">Branding & Design</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">Budget Range</Label>
                                        <Select 
                                            value={formData.budget} 
                                            onValueChange={(value) => setFormData({ ...formData, budget: value })}
                                        >
                                            <SelectTrigger className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                <SelectValue placeholder="Select range" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                                                <SelectItem value="50k-1L">₹50,000 - ₹1,00,000</SelectItem>
                                                <SelectItem value="1L-2.5L">₹1,00,000 - ₹2,50,000</SelectItem>
                                                <SelectItem value="2.5L-5L">₹2,50,000 - ₹5,00,000</SelectItem>
                                                <SelectItem value="5L-plus">₹5,00,000+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">Timeline</Label>
                                        <Select 
                                            value={formData.timeline} 
                                            onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                                        >
                                            <SelectTrigger className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                <SelectValue placeholder="Select timeline" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                <SelectItem value="1-week">1 Week</SelectItem>
                                                <SelectItem value="2-weeks">2 Weeks</SelectItem>
                                                <SelectItem value="1-month">1 Month</SelectItem>
                                                <SelectItem value="2-3-months">2-3 Months</SelectItem>
                                                <SelectItem value="3-plus-months">3+ Months</SelectItem>
                                                <SelectItem value="flexible">Flexible</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-neutral-300">Project Description</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe your project, goals, and any specific requirements..."
                                        rows={5}
                                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 resize-none"
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-14 bg-white hover:bg-neutral-200 text-black font-medium text-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    "Submitting..."
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Submit Project Request
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-900 bg-black/50 py-6 px-8 text-center text-sm text-neutral-500">
                © 2026 Redlix Systems. All rights reserved.
            </footer>
        </div>
    );
}
