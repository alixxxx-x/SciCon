import React from 'react';
import { Clock, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      'open_call': 'bg-green-500/10 text-green-400 border-green-500/20',
      'reviewing': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'program_ready': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'ongoing': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'completed': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="group relative bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(event.status)}`}>
            {event.status?.replace('_', ' ') || 'UPCOMING'}
          </span>
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
            {event.event_type}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h3>

        <p className="text-gray-400 text-sm mb-6 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-6">
          {event.start_date && (
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>
                {new Date(event.start_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
          {(event.city || event.country) && (
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>{event.city}{event.city && event.country ? ', ' : ''}{event.country}</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-indigo-400 text-sm font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
          View Details <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
