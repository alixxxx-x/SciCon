import React, { useState, useEffect } from 'react';
import api from '../api';
import EventCard from '../components/EventCard';
import { Search, Filter, Calendar, LayoutGrid, MapPin } from 'lucide-react';

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading Catalog...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
            {/* Professional Header */}
            <div className="bg-white border-b border-gray-200 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="h-px w-8 bg-blue-600"></span>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">Scientific Catalog</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                        Explore Upcoming <br />
                        <span className="text-blue-600">Medical Conferences</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl text-lg font-medium">
                        Join thousands of researchers and practitioners at the forefront of healthcare innovation.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8">
                {/* Search Bar - Integrated with Background */}
                <div className="bg-white p-4 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Find events by title, keyword, or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                    <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2">
                        <Filter size={18} /> Search
                    </button>
                </div>

                {/* Grid Overlay */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl mb-8 text-center font-bold">
                        {error}
                    </div>
                )}

                {!loading && !error && filteredEvents.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
                        <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No results found</h3>
                        <p className="text-gray-400">Try refining your search terms.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;