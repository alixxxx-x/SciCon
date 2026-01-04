import React, { useState, useEffect } from 'react';
import api from '../api';
import { Mail, Building, Globe, Microscope, Search, User } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/users/');
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. You might not have permission to view this page.");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.institution?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'super_admin': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'organizer': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'reviewer': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
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
                        <h1 className="text-3xl font-black mb-2">Users Management</h1>
                        <p className="text-gray-400">View and manage platform users</p>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or institution..."
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

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-lg">
                                        {user.photo ? (
                                            <img src={user.photo} alt={user.username} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user.username.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{user.username}</h3>
                                        <div className={`text-[10px] font-black uppercase tracking-widest inline-block px-2 py-0.5 rounded border mt-1 ${getRoleBadgeColor(user.role)}`}>
                                            {user.role?.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-400">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-gray-600" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                {user.institution && (
                                    <div className="flex items-center gap-3">
                                        <Building className="w-4 h-4 text-gray-600" />
                                        <span className="truncate">{user.institution}</span>
                                    </div>
                                )}
                                {user.research_domain && (
                                    <div className="flex items-center gap-3">
                                        <Microscope className="w-4 h-4 text-gray-600" />
                                        <span className="truncate">{user.research_domain}</span>
                                    </div>
                                )}
                                {user.country && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-4 h-4 text-gray-600" />
                                        <span>{user.country}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && filteredUsers.length === 0 && !error && (
                    <div className="text-center py-20">
                        <User className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-500">No users found</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
