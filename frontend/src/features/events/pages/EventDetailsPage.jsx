import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    Clock,
    Mail,
    ArrowLeft,
    CheckCircle,
    Loader2,
    Tag,
    Lock,
    Info,
    Phone,
    FileText,
    Users
} from 'lucide-react';
import api from '../../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";

const EventDetails = () => {
    const { toast } = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [registrationData, setRegistrationData] = useState({
        registration_type: 'participant',
        payment_status: 'pending'
    });

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const [eventRes, profileRes] = await Promise.all([
                api.get(`/api/events/${id}/`),
                api.get('/api/auth/profile/').catch(() => ({ data: null }))
            ]);
            setEvent(eventRes.data);
            setUserInfo(profileRes.data);
        } catch (error) {
            console.error("Error fetching event details:", error);
            toast({
                variant: "destructive",
                title: "Load Error",
                description: "Failed to load event details. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        const canRegister = ['open_call', 'ongoing', 'program_ready'].includes(event?.status);
        if (!canRegister) {
            toast({
                variant: "destructive",
                title: "Registration Closed",
                description: "This event is currently not accepting registrations.",
            });
            return;
        }

        setRegistering(true);
        try {
            await api.post(`/api/events/${id}/registrations/`, registrationData);

            toast({
                title: "Registration Successful",
                description: `You have successfully registered for ${event.title}.`,
            });

            setTimeout(() => {
                const role = userInfo?.role;
                navigate(role === 'organizer' ? '/dashboard-organizer' : (role === 'author' ? '/dashboard-author' : '/dashboard'));
            }, 1500);
        } catch (err) {
            console.error("Error registering for event:", err);
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: err.response?.data?.detail || "We couldn't process your registration. Try again.",
            });
        } finally {
            setRegistering(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'TBD';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return 'TBD';
        }
    };

    const formatDateShort = (dateStr) => {
        if (!dateStr) return 'TBD';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch (e) {
            return 'TBD';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4">
                <Card className="max-w-md w-full border-slate-200 shadow-none rounded-2xl">
                    <CardHeader className="text-center pb-2">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info className="w-6 h-6 text-slate-300" />
                        </div>
                        <CardTitle className="text-lg font-medium text-slate-900">Event not found</CardTitle>
                        <CardDescription className="text-sm font-medium">The event requested is unavailable or has been archived.</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center pt-6">
                        <Button onClick={() => navigate('/events')} variant="outline" className="rounded-xl font-medium px-8 border-slate-200">
                            Back to Events
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const canRegister = ['open_call', 'ongoing', 'program_ready'].includes(event.status);

    return (
        <div className="min-h-screen bg-slate-50/30 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Event Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Header Details */}
                        <div className="space-y-6 bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none px-3 py-1 text-[10px] font-medium rounded-md uppercase tracking-wider">
                                    {event.event_type?.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="text-slate-400 border-slate-200 px-3 py-1 text-[10px] font-medium rounded-md uppercase tracking-wider">
                                    {event.status?.replace('_', ' ')}
                                </Badge>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 leading-tight">
                                {event.title}
                            </h1>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-1.5">
                                    <span className="text-xs font-medium text-slate-400">Duration</span>
                                    <div className="flex items-center gap-3 text-slate-900 font-medium">
                                        <Calendar size={18} className="text-blue-500" />
                                        <span>{formatDateShort(event.start_date)} — {formatDate(event.end_date)}</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-xs font-medium text-slate-400">Venue</span>
                                    <div className="flex items-center gap-3 text-slate-900 font-medium">
                                        <MapPin size={18} className="text-slate-400" />
                                        <span>{event.venue}, {event.city}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <h3 className="text-xs font-medium text-slate-400 border-l-2 border-blue-600 pl-3">About this Event</h3>
                            <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-line">
                                {event.description}
                            </p>
                        </section>

                        {event.sessions?.filter(s => s.submissions_count > 0).length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest">Program Schedule</h2>
                                    <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">{event.sessions.filter(s => s.submissions_count > 0).length} Sessions</span>
                                </div>
                                <div className="grid gap-4">
                                    {event.sessions.filter(s => s.submissions_count > 0).map((session, idx) => (
                                        <div key={idx} className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-colors">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">{session.session_type || 'General'}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{session.date}</span>
                                                    </div>
                                                    <h4 className="font-medium text-slate-900 text-xl leading-tight group-hover:text-blue-600 transition-colors uppercase">{session.title}</h4>
                                                    <div className="flex items-center gap-6 text-xs text-slate-500 font-medium uppercase tracking-tight">
                                                        <span className="flex items-center gap-2"><Clock size={14} className="text-blue-500" /> {session.start_time} - {session.end_time}</span>
                                                        {session.room && <span className="flex items-center gap-2"><MapPin size={14} className="text-slate-300" /> {session.room}</span>}
                                                    </div>
                                                </div>
                                                {session.description && (
                                                    <p className="text-xs text-slate-400 font-medium italic leading-relaxed max-w-sm md:text-right">
                                                        "{session.description}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-12 space-y-6">
                            <Card className="border-blue-100 shadow-sm rounded-2xl overflow-hidden bg-white dark:border-blue-900/50">
                                <CardHeader className="bg-blue-50 border-b border-blue-100 p-8 dark:bg-blue-900/20 dark:border-blue-900/50">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 dark:text-blue-400">Registration Fee</p>
                                    <CardTitle className="text-3xl font-medium text-slate-900 flex items-baseline gap-2 tabular-nums dark:text-foreground">
                                        <span className="text-sm font-medium text-slate-400">DZD</span>
                                        {event.registration_fee ? parseFloat(event.registration_fee).toLocaleString() : "0.00"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    {event.submission_deadline && (
                                        <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex items-start gap-4">
                                            <Clock size={16} className="text-orange-500 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-medium text-orange-800 uppercase tracking-wider mb-0.5">Abstract Deadline</p>
                                                <p className="text-sm font-medium text-orange-950">{formatDate(event.submission_deadline)}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium text-slate-500 ml-0.5">Delegate Category</Label>
                                            <Select
                                                value={registrationData.registration_type}
                                                onValueChange={(val) => setRegistrationData({ ...registrationData, registration_type: val })}
                                            >
                                                <SelectTrigger className="w-full h-11 rounded-lg border-slate-200 bg-white text-sm font-medium px-4 focus:ring-1 focus:ring-blue-500 transition-all outline-none">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-slate-200 p-1 shadow-xl">
                                                    <SelectItem value="participant" className="rounded-md font-medium text-sm py-2">Participant</SelectItem>
                                                    <SelectItem value="speaker" className="rounded-md font-medium text-sm py-2">Speaker</SelectItem>
                                                    <SelectItem value="invited" className="rounded-md font-medium text-sm py-2">Invited Delegate</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            onClick={handleRegister}
                                            disabled={registering || !canRegister}
                                            className="w-full h-11 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all disabled:bg-slate-100 disabled:text-slate-400"
                                        >
                                            {registering ? (
                                                <Loader2 className="animate-spin mr-2" size={16} />
                                            ) : !canRegister ? (
                                                <span className="flex items-center gap-2"><Lock size={16} /> Registration Closed</span>
                                            ) : (
                                                "Confirm Registration"
                                            )}
                                        </Button>

                                        {userInfo?.role === 'author' && event.status === 'open_call' && (
                                            <Button
                                                variant="outline"
                                                onClick={() => navigate('/submissions/new', { state: { eventId: event.id } })}
                                                className="w-full h-11 rounded-lg border-slate-200 font-medium text-sm hover:bg-slate-50 transition-all"
                                            >
                                                Submit Abstract
                                            </Button>
                                        )}
                                    </div>

                                    <Separator className="bg-slate-50" />

                                    <div className="space-y-6">
                                        <h4 className="text-xs font-medium text-slate-400">Conference Engagement</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-3 text-slate-500 font-medium">
                                                    <Users size={16} className="text-slate-300" />
                                                    <span>Attending</span>
                                                </div>
                                                <span className="font-medium text-slate-900 tabular-nums">{event.registrations_count || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-3 text-slate-500 font-medium">
                                                    <FileText size={16} className="text-slate-300" />
                                                    <span>Papers</span>
                                                </div>
                                                <span className="font-medium text-slate-900 tabular-nums">{event.submissions_count || 0}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 space-y-3 border-t border-slate-50">
                                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 group">
                                                <Mail size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                <a href={`mailto:${event.contact_email}`} className="hover:text-blue-600 transition-colors truncate">{event.contact_email}</a>
                                            </div>
                                            {event.contact_phone && (
                                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                    <Phone size={16} className="text-slate-300" />
                                                    <span className="font-medium">{event.contact_phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EventDetails;
