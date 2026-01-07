import React, { useState, useEffect } from 'react';
import { Search, Users, ChevronRight, Mail, Phone, Calendar, ArrowLeft, Loader2, Download, Filter, Check, CreditCard, Clock, MoreHorizontal } from 'lucide-react';
import api from '../../api';
import OrganizerSidebar from '../../components/layout/OrganizerSidebar';

const OrganizerParticipants = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
        } catch (error) {
            console.error("Error updating payment status:", error);
            alert("Failed to update status. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleBack = () => {
        setSelectedEvent(null);
        setParticipants([]);
    };

    const filteredParticipants = participants.filter(p =>
        p.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'completed':
            case 'paid_online':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'paid_onsite':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'pending':
            default:
                return 'bg-orange-50 text-orange-700 border-orange-100';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-8">
                {selectedEvent ? (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 text-sm font-semibold"
                    >
                        <ArrowLeft size={16} /> Back to Event Selection
                    </button>
                ) : null}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {selectedEvent ? `Participants: ${selectedEvent.title}` : 'Participant Management'}
                        </h1>
                        <p className="text-gray-500">
                            {selectedEvent
                                ? `Manage delegate registrations and Verify payments.`
                                : 'Overview of attendance and registration status across your events.'}
                        </p>
                    </div>
                </div>
            </div>

            {!selectedEvent ? (
                /* Event Selection Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.length > 0 ? (
                        events.map(event => (
                            <div key={event.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                        <Calendar size={20} />
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider ${event.status === 'open_call' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {event.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{event.title}</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest">Total Delegates</span>
                                        <span className="font-black text-gray-900">{event.participants_count || 0}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min((event.participants_count / 100) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => fetchEventParticipants(event)}
                                    className="w-full py-3 bg-gray-50 hover:bg-blue-600 hover:text-white border border-gray-100 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    Delegate List <ChevronRight size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white border border-gray-200 rounded-2xl">
                            <Users size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400 font-bold">No events created yet.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Participant List View */
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search delegates by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 shadow-sm"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            <Filter size={18} /> Filter Status
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
                            <Download size={18} /> Export CSV
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        {loadingParticipants ? (
                            <div className="py-20 text-center">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                                <p className="text-gray-400 font-medium">Retrieving delegates...</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                    <tr>
                                        <th className="py-4 px-6 text-center w-16">#</th>
                                        <th className="py-4 px-6">Delegate Information</th>
                                        <th className="py-4 px-6">Registration Type</th>
                                        <th className="py-4 px-6">Payment Status</th>
                                        <th className="py-4 px-6">Date Registered</th>
                                        <th className="py-4 px-6 text-right">Verification Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredParticipants.length > 0 ? (
                                        filteredParticipants.map((p, idx) => (
                                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5 px-6 text-sm font-bold text-gray-300 text-center">{idx + 1}</td>
                                                <td className="py-5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 uppercase text-xs">
                                                            {p.user?.username?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{p.user?.username}</div>
                                                            <div className="text-xs text-gray-400">{p.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-black uppercase tracking-widest">
                                                        {p.registration_type}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getPaymentBadge(p.payment_status)}`}>
                                                        {p.payment_status?.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-sm text-gray-500 font-medium">
                                                    {new Date(p.registered_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {updatingId === p.id ? (
                                                            <Loader2 size={16} className="animate-spin text-blue-600" />
                                                        ) : (
                                                            <>
                                                                <button
                                                                    title="Mark as Pending"
                                                                    onClick={() => handleUpdatePayment(p.id, 'pending')}
                                                                    className={`p-1.5 rounded-lg border transition-all ${p.payment_status === 'pending' ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-400 border-gray-100 hover:bg-orange-50 hover:text-orange-600'}`}
                                                                >
                                                                    <Clock size={16} />
                                                                </button>
                                                                <button
                                                                    title="Mark as Paid Onsite"
                                                                    onClick={() => handleUpdatePayment(p.id, 'paid_onsite')}
                                                                    className={`p-1.5 rounded-lg border transition-all ${p.payment_status === 'paid_onsite' ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-400 border-gray-100 hover:bg-blue-50 hover:text-blue-600'}`}
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                                <button
                                                                    title="Mark as Paid Online"
                                                                    onClick={() => handleUpdatePayment(p.id, 'paid_online')}
                                                                    className={`p-1.5 rounded-lg border transition-all ${p.payment_status === 'paid_online' || p.payment_status === 'completed' ? 'bg-green-500 text-white border-green-500' : 'text-gray-400 border-gray-100 hover:bg-green-50 hover:text-green-600'}`}
                                                                >
                                                                    <CreditCard size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                        <div className="w-px h-4 bg-gray-100 mx-1"></div>
                                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                            <Mail size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-20 text-center">
                                                <Users size={40} className="mx-auto text-gray-100 mb-4" />
                                                <p className="text-gray-400 font-medium">No delegates found matching your search.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </OrganizerSidebar>
    );
};

export default OrganizerParticipants;
