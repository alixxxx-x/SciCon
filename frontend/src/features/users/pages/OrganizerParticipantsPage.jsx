import React, { useState, useEffect } from 'react';
import {
    Search,
    Users,
    ChevronRight,
    Mail,
    Calendar,
    ArrowLeft,
    RefreshCw,
    Download,
    Check,
    CreditCard,
    Clock,
    FileSpreadsheet
} from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const OrganizerParticipants = () => {
    const { toast } = useToast();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [profileRes, eventsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/events/my-events/')
            ]);
            setUserInfo(profileRes.data);
            const eventsData = eventsRes.data;
            const eventsList = Array.isArray(eventsData) ? eventsData : (eventsData.results || []);
            setEvents(eventsList);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEventParticipants = async (event) => {
        setSelectedEvent(event);
        setLoadingParticipants(true);
        try {
            const res = await api.get(`/api/events/${event.id}/registrations/`);
            const data = res.data;
            setParticipants(Array.isArray(data) ? data : (data.results || []));
            toast({
                title: "Data loaded",
                description: `Participant list for ${event.title} is now visible.`,
            });
        } catch (error) {
            console.error("Error fetching participants:", error);
            setParticipants([]);
        } finally {
            setLoadingParticipants(false);
        }
    };

    const handleUpdatePayment = async (regId, status) => {
        setUpdatingId(regId);
        try {
            await api.patch(`/api/registrations/${regId}/payment/`, { payment_status: status });
            setParticipants(prev => prev.map(p => p.id === regId ? { ...p, payment_status: status } : p));
            toast({
                title: "Status updated",
                description: `Payment status changed to ${status.replace('_', ' ')}.`,
            });
        } catch (error) {
            console.error("Error updating payment status:", error);
            toast({
                variant: "destructive",
                title: "Update failed",
                description: "There was an error updating the payment status.",
            });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleBack = () => {
        setSelectedEvent(null);
        setParticipants([]);
        setSearchTerm('');
        setStatusFilter('all');
    };

    const handleExportCSV = () => {
        if (!participants.length) return;

        const headers = ['Order', 'Username', 'Email', 'Institution', 'Type', 'Status', 'Date Registered'];
        const rows = filteredParticipants.map((p, idx) => [
            idx + 1,
            p.user?.username || '',
            p.user?.email || '',
            p.user?.institution || 'N/A',
            p.registration_type,
            p.payment_status,
            new Date(p.registered_at).toLocaleDateString()
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `participants_${(selectedEvent?.title || "event")}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredParticipants = participants.filter(p => {
        const matchesSearch = (
            p.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.user?.institution?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesStatus = statusFilter === 'all' || p.payment_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'completed':
            case 'paid_online':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'paid_onsite':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending':
            default:
                return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    if (loading) {
        return (
            <OrganizerSidebar userInfo={userInfo}>
                <div className="flex bg-slate-50 min-h-[60vh] items-center justify-center rounded-2xl border border-slate-200">
                    <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
                </div>
            </OrganizerSidebar>
        );
    }

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-6">
                {selectedEvent && (
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 px-0 h-auto"
                    >
                        <ArrowLeft size={16} /> <span className="text-sm font-medium">Back to Events</span>
                    </Button>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">
                            {selectedEvent ? selectedEvent.title : "Participants"}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {selectedEvent
                                ? "Manage registrations and payment status for this event."
                                : "Select an event to manage its participant list."}
                        </p>
                    </div>
                </div>
            </div>

            {!selectedEvent ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.length > 0 ? (
                        events.map(event => (
                            <Card key={event.id} className="hover:border-slate-400 transition-all border-slate-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                            <Calendar size={18} className="text-slate-600" />
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-semibold">
                                            {event.status?.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-base font-bold mt-4 leading-snug">{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm mb-6">
                                        <span className="text-slate-500">Participants</span>
                                        <span className="font-semibold">{event.registrations_count || 0}</span>
                                    </div>
                                    <Button
                                        onClick={() => fetchEventParticipants(event)}
                                        className="w-full h-10 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                                    >
                                        View Participants <ChevronRight size={16} />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                            <Users size={32} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500 text-sm">No events found.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, email or institution..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-400 transition-all text-sm"
                            />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-3 pr-8 h-10 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-slate-400 transition-all cursor-pointer min-w-[140px]"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="paid_onsite">Paid Onsite</option>
                                <option value="paid_online">Paid Online</option>
                                <option value="completed">Completed</option>
                            </select>
                            <Button
                                onClick={handleExportCSV}
                                variant="outline"
                                className="h-10 px-4 flex items-center gap-2 text-sm"
                            >
                                <Download size={16} /> Export
                            </Button>
                        </div>
                    </div>

                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        {loadingParticipants ? (
                            <div className="py-20 text-center">
                                <RefreshCw className="w-8 h-8 text-slate-300 animate-spin mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">Loading participants...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Participant</th>
                                            <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Institution</th>
                                            <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Type</th>
                                            <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                            <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredParticipants.length > 0 ? (
                                            filteredParticipants.map((p) => (
                                                <tr key={p.id} className="hover:bg-slate-50 transition-colors group/row">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                                                                {p.user?.username?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-semibold text-slate-900">{p.user?.username}</div>
                                                                <div className="text-xs text-slate-500">{p.user?.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-slate-600">
                                                        {p.user?.institution || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className="text-[10px] font-medium bg-slate-100 text-slate-600 py-1 px-2 rounded-md uppercase tracking-wide">
                                                            {p.registration_type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <Badge variant="outline" className={cn("text-[10px] py-1 px-2 uppercase border", getPaymentBadge(p.payment_status))}>
                                                            {p.payment_status?.replace('_', ' ')}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {updatingId === p.id ? (
                                                                <RefreshCw size={16} className="animate-spin text-slate-400" />
                                                            ) : (
                                                                <div className="flex items-center gap-1 opacity-40 group-hover/row:opacity-100 transition-opacity">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        title="Pending"
                                                                        onClick={() => handleUpdatePayment(p.id, 'pending')}
                                                                        className={cn("h-8 w-8", p.payment_status === 'pending' ? "text-amber-600" : "text-slate-400")}
                                                                    >
                                                                        <Clock size={16} />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        title="Paid Onsite"
                                                                        onClick={() => handleUpdatePayment(p.id, 'paid_onsite')}
                                                                        className={cn("h-8 w-8", p.payment_status === 'paid_onsite' ? "text-blue-600" : "text-slate-400")}
                                                                    >
                                                                        <Check size={16} />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        title="Paid Online"
                                                                        onClick={() => handleUpdatePayment(p.id, 'paid_online')}
                                                                        className={cn("h-8 w-8", p.payment_status === 'paid_online' || p.payment_status === 'completed' ? "text-green-600" : "text-slate-400")}
                                                                    >
                                                                        <CreditCard size={16} />
                                                                    </Button>
                                                                    <div className="w-px h-4 bg-slate-200 mx-1" />
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        asChild
                                                                        className="h-8 w-8 text-slate-400 hover:text-slate-600"
                                                                    >
                                                                        <a href={`mailto:${p.user?.email}`}>
                                                                            <Mail size={16} />
                                                                        </a>
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-20 text-center">
                                                    <p className="text-slate-500 text-sm">No participants found.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </OrganizerSidebar>
    );
};

export default OrganizerParticipants;
