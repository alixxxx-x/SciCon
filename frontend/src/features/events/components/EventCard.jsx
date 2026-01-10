import React from 'react';
import { MapPin, Calendar, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-600 border-gray-200',
      'open_call': 'bg-green-50 text-green-700 border-green-100',
      'reviewing': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'program_ready': 'bg-blue-50 text-blue-700 border-blue-100',
      'ongoing': 'bg-purple-50 text-purple-700 border-purple-100',
      'completed': 'bg-gray-100 text-gray-500 border-gray-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-500 border-gray-100';
  };

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-5">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(event.status)}`}>
          {event.status?.replace('_', ' ') || 'UPCOMING'}
        </span>
        <div className="flex items-center gap-1.5 text-blue-600">
          <Tag size={12} className="fill-blue-600/10" />
          <span className="text-[10px] font-black uppercase tracking-wider">{event.event_type}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
        {event.title}
      </h3>

      <p className="text-gray-500 text-sm mb-6 line-clamp-3 font-medium flex-grow">
        {event.description}
      </p>

      <div className="pt-6 border-t border-gray-50 space-y-3">
        {event.start_date && (
          <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-tight">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>
              {new Date(event.start_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        )}
        {(event.city || event.country) && (
          <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-tight">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>{event.city}{event.city && event.country ? ', ' : ''}{event.country}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs font-black text-gray-400 group-hover:text-blue-600 transition-colors">EXPLORE EVENT</span>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
