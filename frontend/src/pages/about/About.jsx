import React from "react";
import {
    Users, Target, Award, Rocket,
    ArrowRight, Heart, Brain, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const team = [
    {
        name: "Dr. Sara Ben Ahmed",
        role: "Medical Director",
        initials: "SA",
        bio: "Specializing in health innovation with 15+ years of clinical research experience.",
        tag: "Board Member"
    },
    {
        name: "Karim Belkacemi",
        role: "Tech Lead",
        initials: "KB",
        bio: "Passionate about building scalable platforms that connect the medical scientific community.",
        tag: "Lead Architect"
    },
    {
        name: "Lydia Mensouri",
        role: "Event Coordinator",
        initials: "LM",
        bio: "Ensuring world-class organization for every conference and medical workshop.",
        tag: "Operations"
    }
];

const stats = [
    { label: "Medical Events", value: "50+", icon: Award },
    { label: "Researchers", value: "10k+", icon: Users },
    { label: "Countries", value: "12", icon: Rocket },
    { label: "Impact Score", value: "98%", icon: Zap }
];

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-24 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.1),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <Badge variant="outline" className="text-blue-400 border-blue-400/30 mb-6 px-4 py-1">
                        Our Story
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
                        Empowering Algerian <br />
                        <span className="text-blue-500">Medical Science.</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        SciCon is more than just a platform—it's a bridge between knowledge and practice,
                        connecting the brightest minds in health science across the nation.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-blue-600 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-blue-100 text-xs font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                <Target className="text-blue-600" />
                                Our Mission
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                SciCon was founded in 2024 with a singular focus: to modernize how medical
                                knowledge is shared in Algeria. We provide researchers, doctors, and students
                                with a centralized path to discover top-tier conferences and workshops.
                            </p>
                            <Separator className="bg-slate-200" />
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="h-2 w-12 bg-blue-600 rounded-full" />
                                    <p className="font-bold text-slate-900">Accessibility</p>
                                    <p className="text-sm text-slate-500">Democratizing scientific access for all provinces.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-12 bg-slate-400 rounded-full" />
                                    <p className="font-bold text-slate-900">Innovation</p>
                                    <p className="text-sm text-slate-500">Pushing the boundaries of event technology.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-3xl overflow-hidden bg-slate-900 p-12 flex flex-col justify-center text-white min-h-[400px]">
                            <div className="absolute top-0 right-0 p-8 opacity-20">
                                <Brain size={120} />
                            </div>
                            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                "To become the leading digital ecosystem for medical scientific exchange in
                                the African Mediterranean region, fostering a culture of continuous learning
                                and breakthrough research."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
                                    <Heart className="text-blue-500 h-5 w-5 fill-blue-500" />
                                </div>
                                <span className="font-bold text-sm">Driven by passion</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-slate-900">The Minds Behind SciCon</h2>
                            <p className="text-slate-500 text-lg max-w-xl">
                                Our diverse team combines medical expertise with cutting-edge engineering
                                to deliver a seamless experience for the scientific community.
                            </p>
                        </div>
                        <Button variant="outline" className="rounded-full font-bold px-8 group">
                            Join Our Team
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, i) => (
                            <Card key={i} className="border-none shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 rounded-3xl group overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <Avatar className="h-20 w-20 mb-6 ring-4 ring-offset-4 ring-blue-50">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-slate-900 text-white font-bold text-xl">
                                            {member.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none px-3 font-bold text-[10px] mb-2">
                                            {member.tag}
                                        </Badge>
                                        <CardTitle className="text-xl font-bold text-slate-900">{member.name}</CardTitle>
                                        <CardDescription className="text-blue-600 font-bold text-xs">
                                            {member.role}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-2">
                                    <p className="text-slate-500 leading-relaxed text-sm italic">
                                        "{member.bio}"
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="bg-blue-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-white rounded-full blur-[120px]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">
                        Ready to share your research?
                    </h2>
                    <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
                        Join thousands of professionals already using SciCon to advance their medical careers.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 relative z-10">
                        <Button size="lg" className="bg-slate-900 hover:bg-black text-white px-10 h-14 rounded-full font-bold text-lg shadow-xl shadow-slate-900/20 transition-all active:scale-95">
                            Submit Your Paper
                        </Button>
                        <Button variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10 px-10 h-14 rounded-full font-bold text-lg transition-all active:scale-95">
                            Contact Us
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}