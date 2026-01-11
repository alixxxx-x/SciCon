import { useEffect, useRef } from "react";
import api from "../services/api";
import { useToast } from "../hooks/use-toast";
import { Bell, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { ACCESS_TOKEN } from "../constants";

const NotificationListener = () => {
    const { toast } = useToast();
    const lastFetchedIds = useRef(new Set());
    const isFirstRun = useRef(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) return;

            try {
                // Fetch unread messages
                const response = await api.get('/api/messages/');
                const messages = Array.isArray(response.data) ? response.data : (response.data.results || []);

                // Only show unread as popups
                const unreadMessages = messages.filter(m => !m.is_read);

                unreadMessages.forEach(msg => {
                    if (!lastFetchedIds.current.has(msg.id)) {
                        lastFetchedIds.current.add(msg.id);

                        // Don't toast existing unread messages on first load to avoid a barrage
                        if (!isFirstRun.current) {
                            const isAlert = msg.content.toLowerCase().includes('deadline') || msg.content.toLowerCase().includes('urgent');
                            const isSuccess = msg.content.toLowerCase().includes('confirmed') || msg.content.toLowerCase().includes('success');

                            toast({
                                title: isAlert ? "Alert" : isSuccess ? "Success" : "Update Received",
                                description: msg.content,
                                variant: isAlert ? "destructive" : "default",
                            });
                        }
                    }
                });

                isFirstRun.current = false;
            } catch (error) {
                console.error("Notification sync error:", error);
            }
        };

        // Initial fetch
        fetchNotifications();

        // Poll every 15 seconds
        const interval = setInterval(fetchNotifications, 15000);

        return () => clearInterval(interval);
    }, [toast]);

    return null; // Side-effect only component
};

export default NotificationListener;
