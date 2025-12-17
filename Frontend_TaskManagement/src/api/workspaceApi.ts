
import api from "./axiosConfig";

export const workspaceApi = {
    getMyWorkspaces: async () => {
        const url = '/workspace';
        return await api.get(url);
    }
}
