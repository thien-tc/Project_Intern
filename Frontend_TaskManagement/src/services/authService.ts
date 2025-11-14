import { authApi } from "@/api/authApi";

export const authService = {
    login : async (email: string, password: string) => {
        const data = await authApi.login(email, password);
        // Lưu vào localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userFullName', data.user.fullName);
        localStorage.setItem('userAvatar', data.user.avatarUrl);

        return data;
    },

    googleLogin:() =>{
        authApi.googleLogin();
    },

    handleGoogleCallback: (searchParams: URLSearchParams) =>{
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const avatar = searchParams.get('picture');

        if(!token) return false;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', token);
        if(email) localStorage.setItem('userEmail', email);
        if(name) localStorage.setItem('userFullName', name);
        if(avatar) localStorage.setItem('userAvatar', avatar);
        return true;
    },

    registerSendOtp: async (email: string) => {
        return await authApi.sendOtp(email);
    },
    registerVerifyOtp: async (fullname: string, email: string, password: string, otp: string) => {
        const data = await authApi.verifiedOtp(fullname, email, password, otp);
        // Lưu vào localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userFullName', data.user.fullName);
        return data;
    }

}