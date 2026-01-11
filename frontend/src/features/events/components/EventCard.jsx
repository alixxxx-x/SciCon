import React from 'react';
import { MapPin, Calendar, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const getStatusLabel = (status) => {
    return status?.replace('_', ' ').toUpperCase() || 'UPCOMING';
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-slate-100 text-slate-600 border-slate-200',
      'open_call': 'bg-green-50 text-green-700 border-green-100',
      'reviewing': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'program_ready': 'bg-blue-50 text-blue-700 border-blue-100',
      'ongoing': 'bg-purple-50 text-purple-700 border-purple-100',
      'completed': 'bg-slate-100 text-slate-500 border-slate-200',
    };
    return colors[status] || 'bg-blue-50 text-blue-700 border-blue-100';
  };

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer flex flex-col h-full overflow-hidden"
    >
      <div className="flex items-start justify-between mb-5">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border ${getStatusColor(event.status)}`}>
          {getStatusLabel(event.status)}
        </span>
        <div className="flex items-center gap-1.5 text-blue-600">
          <Tag size={12} className="opacity-70" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {event.event_type?.replace('_', ' ') || 'Conference'}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
        {event.title}
      </h3>

      <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
        {event.description}
      </p>

      <div className="mt-auto space-y-3 pt-6 border-t border-slate-50 dark:border-slate-800/50">
        <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold dark:text-slate-300">
          <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span>
            {event.start_date ? new Date(event.start_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) : 'Date TBD'}
          </span>
        </div>
        {(event.city || event.country) && (
          <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold dark:text-slate-300">
            <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="truncate">{event.city}{event.city && event.country ? ', ' : ''}{event.country}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between text-blue-600">
        <span className="text-xs font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
          View Event Details
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all ml-auto">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
