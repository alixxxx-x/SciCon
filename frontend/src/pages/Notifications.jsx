import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Trash2, CheckCircle2 } from 'lucide-react';

const Notifications = () => {
    // Mock notifications for now
    const notifications = [
        {
            id: 1,
            type: 'success',
            title: 'Registration Confirmed',
            message: 'Your registration for "Advanced AI in Healthcare" has been confirmed.',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            type: 'info',
            title: 'New Event Available',
            message: 'Check out the new seminar on Molecular Biology.',
            time: '1 day ago',
            read: true
        },
        {
            id: 3,
            type: 'alert',
            title: 'Submission Deadline Approaching',
            message: 'The deadline for paper submission is tomorrow.',
            time: '2 days ago',
            read: true
        }
    ];

    const getIconStyle = (type) => {
        switch (type) {
            case 'success': return { icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-600' };
            case 'alert': return { icon: AlertCircle, bg: 'bg-orange-50', text: 'text-orange-600' };
            default: return { icon: Info, bg: 'bg-blue-50', text: 'text-blue-600' };
        }
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-4xl mx-auto px-6 pt-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Notifications</h1>
                        <p className="text-gray-500 font-medium">Stay updated with the latest activity and announcements.</p>
                    </div>
                    <button className="text-xs font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl border border-blue-100 transition-all flex items-center gap-2 active:scale-95">
                        <CheckCircle2 size={16} /> Mark all as read
                    </button>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => {
                                const style = getIconStyle(notification.type);
                                const Icon = style.icon;

                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-8 flex gap-6 transition-all hover:bg-gray-50/50 ${!notification.read ? 'bg-blue-50/20' : ''}`}
                                    >
                                        <div className={`p-4 rounded-2xl h-fit shadow-sm ${style.bg} ${style.text} transform -rotate-2`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className={`font-bold text-lg ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {notification.title}
                                                </h3>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {notification.time}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 leading-relaxed font-medium">
                                                {notification.message}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-4">
                                            {!notification.read && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 animate-pulse"></div>
                                            )}
                                            <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-24 bg-gray-50/30">
                                <Bell className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                                <h3 className="text-xl font-bold text-gray-900">Inbox is empty</h3>
                                <p className="text-gray-500 font-medium">No new notifications to show right now.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
