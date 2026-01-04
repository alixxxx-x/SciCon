import React, { useState, useEffect } from 'react';
import api from '../../api';
import EventCard from '../../components/EventCard';
import { Search, Calendar, Filter } from 'lucide-react';

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
            // Handle potentially paginated response
            const eventsData = res.data;
            const eventsList = Array.isArray(eventsData) ? eventsData : (eventsData.results || []);
            setEvents(eventsList);
        } catch (error) {
            console.error("Error fetching events:", error);
            setError("Failed to load events.");
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
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-10 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Upcoming Events
                        </h1>
                        <p className="text-gray-400">Discover and participate in scientific events across Algeria</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="mb-8 relative max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search events by title or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111111] border border-white/5 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-gray-600"
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl mb-8 text-center font-bold">
                        {error}
                    </div>
                )}

                {/* Events Grid */}
                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    !error && (
                        <div className="text-center py-20 bg-[#111111] border border-white/5 rounded-2xl">
                            <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-500">No events found</h3>
                            <p className="text-gray-600 mt-2">Try adjusting your search terms</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Events;