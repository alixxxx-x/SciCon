import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import EventCard from '../components/EventCard';
import { Search, Calendar, Filter, Loader2 } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/events/");
            // Handle Django REST Framework paginated response or direct list
            const eventsData = res.data.results || (Array.isArray(res.data) ? res.data : []);
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching events:", error);
            setError("Unable to load events at the moment.");
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Fetching events...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">Upcoming Events</h1>
                    <p className="text-slate-500 text-lg">
                        Explore and participate in scientific conferences across Algeria.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-12 max-w-2xl relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for events, keywords, or locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-xl mb-12 text-center font-semibold">
                        {error}
                    </div>
                )}

                {/* Events Grid */}
                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    !error && (
                        <div className="text-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-500">No events found</h3>
                            <p className="text-slate-400 mt-2">Try adjusting your search criteria.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Events;