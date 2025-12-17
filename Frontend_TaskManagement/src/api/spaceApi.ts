import api from "./axiosConfig";

export const spaceApi = {
    inviteMember: async (spaceId: string, email: string) => {
        const url = `/space/${spaceId}/invite`;
        return await api.post(url, { email });
    }
}
