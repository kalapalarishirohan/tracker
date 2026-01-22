import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Mail, MapPin, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Background Texture
const NoiseTexture = () => (
    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay fixed"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

export default function Contact() {
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
                    type: 'contact',
                    data: formData,
                    status: 'pending'
                });

            if (dbError) {
                console.error("Database error:", dbError);
            }

            // Send admin notification email
            const { error } = await supabase.functions.invoke('send-admin-notification', {
                body: {
                    type: 'contact',
                    data: formData
                }
            });

            if (error) {
                console.error("Email notification error:", error);
            }

            setIsSubmitted(true);
            toast.success("Message sent successfully!");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again.");
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
                        <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                        <p className="text-neutral-400 mb-8">We'll get back to you as soon as possible.</p>
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
            <main className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                    
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Get in Touch</h1>
                            <p className="text-neutral-400 text-lg">
                                Have a question or want to work together? We'd love to hear from you.
                            </p>
                        </div>

                        <div className="space-y-6 pt-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-sm flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white mb-1">Email</h3>
                                    <p className="text-neutral-400">contact@redlix.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-sm flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white mb-1">Phone</h3>
                                    <p className="text-neutral-400">+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-sm flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white mb-1">Location</h3>
                                    <p className="text-neutral-400">Mumbai, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="bg-neutral-950 border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white">Send us a message</CardTitle>
                            <CardDescription className="text-neutral-400">
                                Fill out the form below and we'll respond within 24 hours.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
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
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-neutral-300">Subject</Label>
                                    <Input
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="What is this about?"
                                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-neutral-300">Message *</Label>
                                    <Textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us more about your inquiry..."
                                        rows={5}
                                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 resize-none"
                                        required
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-white hover:bg-neutral-200 text-black font-medium"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-900 bg-black/50 py-6 px-8 text-center text-sm text-neutral-500">
                © 2026 Redlix Systems. All rights reserved.
            </footer>
        </div>
    );
}
