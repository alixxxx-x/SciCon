import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import AuthorSidebar from './AuthorSidebar';
import OrganizerSidebar from './OrganizerSidebar';
import { Loader2 } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/api/auth/profile/');
                setUserInfo(res.data);
            } catch (error) {
                console.error("Error fetching profile for layout:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (userInfo?.role === 'organizer') {
        return <OrganizerSidebar userInfo={userInfo}>{children}</OrganizerSidebar>;
    }

    return <AuthorSidebar userInfo={userInfo}>{children}</AuthorSidebar>;
};

export default DashboardLayout;
