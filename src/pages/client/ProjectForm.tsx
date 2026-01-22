import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useSubmissions } from "@/hooks/useDatabase";
import { useClientStore } from "@/store/clientStore";

export default function ProjectForm() {
    const currentClient = useClientStore((state) => state.currentClient);
    const { addSubmission } = useSubmissions(currentClient?.id);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        timeline: "",
        projectType: "",
        requirements: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentClient) return;

        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error("Required fields missing", { description: "Please fill in title and description." });
            return;
        }

        setIsSubmitting(true);

        const result = await addSubmission({
            client_id: currentClient.id,
            type: 'project_request',
            data: formData,
            status: 'pending'
        });

        setIsSubmitting(false);

        if (result) {
            setIsSubmitted(true);
            toast.success("Project request submitted!", { description: "Our team will review your submission shortly." });
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm">
                    <CardContent className="p-12 text-center space-y-6">
                        <div className="w-20 h-20 mx-auto bg-emerald-950/30 border border-emerald-900/50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-medium text-white">Submission Received</h2>
                            <p className="text-neutral-500 max-w-md mx-auto">
                                Your project request has been submitted successfully. Our team will review it and get back to you within 24-48 hours.
                            </p>
                        </div>
                        <Button 
                            onClick={() => {
                                setIsSubmitted(false);
                                setFormData({ title: "", description: "", budget: "", timeline: "", projectType: "", requirements: "" });
                            }}
                            variant="outline"
                            className="bg-transparent border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900"
                        >
                            Submit Another Request
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="bg-[#0A0A0A] border-neutral-800 rounded-sm">
                <CardHeader className="border-b border-neutral-900 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-sm">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">NEW REQUEST</span>
                    </div>
                    <CardTitle className="text-xl font-medium text-white">Submit Project Details</CardTitle>
                    <CardDescription className="text-neutral-500">
                        Provide information about your project requirements. All fields marked with * are required.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs uppercase tracking-widest text-neutral-500">
                                Project Title *
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Website Redesign, Mobile App Development"
                                className="bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="projectType" className="text-xs uppercase tracking-widest text-neutral-500">
                                Project Type
                            </Label>
                            <Select
                                value={formData.projectType}
                                onValueChange={(v) => setFormData({ ...formData, projectType: v })}
                            >
                                <SelectTrigger className="bg-neutral-900/50 border-neutral-800 focus:border-white transition-colors rounded-sm h-11">
                                    <SelectValue placeholder="Select project type" />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                    <SelectItem value="web-development">Web Development</SelectItem>
                                    <SelectItem value="mobile-app">Mobile App</SelectItem>
                                    <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                                    <SelectItem value="branding">Branding</SelectItem>
                                    <SelectItem value="consulting">Consulting</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs uppercase tracking-widest text-neutral-500">
                                Project Description *
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your project goals, target audience, and key features..."
                                className="min-h-[120px] bg-neutral-900/50 border-neutral-800 focus:border-white focus:bg-black transition-colors rounded-sm resize-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budget" className="text-xs uppercase tracking-widest text-neutral-500">
                                    Estimated Budget
                                </Label>
                                <Select
                                    value={formData.budget}
                                    onValueChange={(v) => setFormData({ ...formData, budget: v })}
                                >
                                    <SelectTrigger className="bg-neutral-900/50 border-neutral-800 focus:border-white transition-colors rounded-sm h-11">
                                        <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                        <SelectItem value="under-5k">Under $5,000</SelectItem>
                                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                                        <SelectItem value="50k-plus">$50,000+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timeline" className="text-xs uppercase tracking-widest text-neutral-500">
                                    Timeline
                                </Label>
                                <Select
                                    value={formData.timeline}
                                    onValueChange={(v) => setFormData({ ...formData, timeline: v })}
                                >
                                    <SelectTrigger className="bg-neutral-900/50 border-neutral-800 focus:border-white transition-colors rounded-sm h-11">
                                        <SelectValue placeholder="Select timeline" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                        <SelectItem value="asap">ASAP</SelectItem>
                                        <SelectItem value="1-month">Within 1 month</SelectItem>
                                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                                        <SelectItem value="flexible">Flexible</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-white hover:bg-neutral-200 text-black font-bold h-12 rounded-sm tracking-wider uppercase text-xs"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        SUBMITTING...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Request
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
