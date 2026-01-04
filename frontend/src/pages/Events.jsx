import React, { useState, useEffect } from 'react';
import api from '../api';
import EventCard from '../components/EventCard';
import { Search, Filter, Calendar } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/api/events/');
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError("Failed to load events. Please try again later.");
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-medium">Loading Events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-20">
            {/* Header */}
            <div className="bg-[#111111] border-b border-white/5 py-12 px-6 mb-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-black mb-4">Scientific Events</h1>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Discover and participate in leading international conferences, workshops, and seminars in the healthcare sector.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search events by title or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#111111] border border-white/5 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-gray-600"
                        />
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl mb-8 text-center font-bold">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredEvents.length === 0 && (
                    <div className="text-center py-20 bg-[#111111] rounded-3xl border border-white/5 border-dashed">
                        <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No events found</h3>
                        <p className="text-gray-600">Try adjusting your search terms or check back later for new events.</p>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;