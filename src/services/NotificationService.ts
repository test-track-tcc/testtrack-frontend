import axios from 'axios';

export const NotificationService = {
    getNotifications: async (userId: string) => {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications/user/${userId}`);
        return response.data;
    },

    markNotificationAsRead: async (notificationId: string) => {
        const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/notifications/${notificationId}/read`);
        return response.data;
    },

    acceptOrganizationInvite: async (membershipId: string, authUserId: string) => {
        const body = { authUserId };
        const response = await axios.patch(`/organization/invites/${membershipId}/accept`, body);
        return response.data;
    }
};