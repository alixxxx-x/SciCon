import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
    BookOpen,
    Calendar,
    MapPin,
    User,
    Users,
    Clock,
    ChevronRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            // Since there's no global workshops endpoint, we fetch events first
            const eventsRes = await api.get("/api/events/");
            const eventsList = eventsRes.data.results || (Array.isArray(eventsRes.data) ? eventsRes.data : []);

            // Then fetch workshops for each event in parallel
            const workshopPromises = eventsList.map(event =>
                api.get(`/api/events/${event.id}/workshops/`)
                    .then(res => res.data.map(w => ({ ...w, eventTitle: event.title })))
                    .catch(() => []) // Ignore errors for individual events
            );

            const workshopResults = await Promise.all(workshopPromises);
            const allWorkshops = workshopResults.flat();

            setWorkshops(allWorkshops);
        } catch (err) {
            console.error("Error fetching workshops:", err);
            setError("Failed to load workshops. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Looking for upcoming workshops...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">Medical Workshops</h1>
                    <p className="text-slate-500 text-lg">
                        Hands-on training sessions led by industry experts.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-xl mb-12 text-center font-semibold">
                        {error}
                    </div>
                )}

                {workshops.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {workshops.map((workshop) => (
                            <Card key={workshop.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden group">
                                <CardHeader className="bg-white pb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-bold uppercase text-[10px] tracking-wider">
                                            Workshop
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Users size={14} />
                                            <span className="text-xs font-bold">{workshop.participants_count}/{workshop.max_participants}</span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {workshop.title}
                                    </CardTitle>
                                    <CardDescription className="text-blue-600 font-bold text-xs uppercase tracking-tight mt-1">
                                        Part of: {workshop.eventTitle}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed italic">
                                        "{workshop.description}"
                                    </p>

                                    <div className="space-y-3 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold uppercase">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            <span>
                                                {new Date(workshop.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold uppercase">
                                            <Clock className="h-4 w-4 text-blue-500" />
                                            <span>{workshop.start_time.slice(0, 5)} - {workshop.end_time.slice(0, 5)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold uppercase">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                            <span>Room: {workshop.room}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold uppercase">
                                            <User className="h-4 w-4 text-blue-500" />
                                            <span>Leader: {workshop.leader?.username || "TBD"}</span>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold h-11 transition-none">
                                        Register Now
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    !error && (
                        <div className="text-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-500">No workshops scheduled</h3>
                            <p className="text-slate-400 mt-2">Check back soon for new training opportunities.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}