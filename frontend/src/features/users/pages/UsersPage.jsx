import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Mail, Building, Globe, Microscope, Search, User, Loader2, Link, Filter } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

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
            setLoading(true);
            const response = await api.get('/api/users/');
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Management access required.");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.institution?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const getRoleStyle = (role) => {
        switch (role) {
            case 'super_admin': return 'bg-red-50 text-red-700 border-red-100';
            case 'organizer': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'reviewer': return 'bg-orange-50 text-orange-700 border-orange-100';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Directory of all researchers and collaborators on the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">Export Directory</button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, institution, or domain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 font-bold text-sm bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter size={18} /> Role Filter
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-gray-100">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                            <div key={u.id} className="p-8 hover:bg-gray-50/50 transition-colors group">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-xl font-black text-blue-600 border border-blue-100 group-hover:bg-white group-hover:shadow-md transition-all">
                                        {u.photo ? <img src={u.photo} alt="" className="w-full h-full rounded-full object-cover" /> : u.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors truncate">{u.username}</h3>
                                        <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-black uppercase tracking-widest border ${getRoleStyle(u.role)}`}>
                                            {u.role?.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Mail size={16} className="text-gray-400" />
                                        <span className="truncate">{u.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Building size={16} className="text-gray-400" />
                                        <span className="truncate">{u.institution || "Professional Independent"}</span>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Joined {new Date(u.created_at || Date.now()).getFullYear()}</span>
                                    <button className="text-blue-600 font-bold text-xs uppercase hover:underline">View Profile</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 py-24 text-center">
                            <User className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">No users match your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Users;
