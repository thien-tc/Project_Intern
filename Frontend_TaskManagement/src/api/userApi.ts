import api from "./axiosConfig";

export const userApi = {
    getProfile: async () => {
        const url = '/user/profile';
        return await api.get(url);
    },

    updateProfile: async (data: { fullname: string, avatarUrl?: string | null }) => {
        const url = '/user/profile';
        return await api.put(url, {
            FullName: data.fullname,
            AvatarUrl: data.avatarUrl

        })

    },

    changePassword: async (data: any) => {
        const url = '/user/change-password';
        return await api.put(url, data);
    }
}