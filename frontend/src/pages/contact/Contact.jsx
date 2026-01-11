import React, { useState } from "react";
import { CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 800);
    };

    if (submitted) {
        return (
            <div className="max-w-md mx-auto py-32 px-6 text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle2 className="h-12 w-12 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Message sent</h1>
                <p className="text-slate-500 mb-8">We'll get back to you shortly.</p>
                <Button
                    variant="link"
                    onClick={() => setSubmitted(false)}
                    className="text-blue-600 font-semibold"
                >
                    Send another message
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-8 md:py-16 px-4 md:px-6">
            {/* Main Container */}
            <div className="max-w-5xl mx-auto bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="grid md:grid-cols-5 text-slate-900">

                    {/* Info Section */}
                    <div className="md:col-span-2 bg-blue-600 p-8 md:p-12 text-white">
                        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
                        <p className="text-blue-50 mb-10 leading-relaxed text-sm">
                            Have a question about SciCon? Fill out the form and our team will get back to you as soon as possible.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-blue-50" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold">info@scicon.dz</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                    <Phone className="h-5 w-5 text-blue-50" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold">+213 564 875 214</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-blue-50" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold">Constantine, Algeria</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="md:col-span-3 p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Your name"
                                        required
                                        className="border-slate-300 focus:border-blue-500 shadow-none transition-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        required
                                        className="border-slate-300 focus:border-blue-500 shadow-none transition-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="How can we help?"
                                    required
                                    className="min-h-[160px] border-slate-300 focus:border-blue-500 shadow-none transition-none resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-lg font-bold transition-none"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}