import api from './axiosConfig';

export const authApi = {
    login: async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        return res.data;
    },

    googleLogin: () =>{
        window.location.href = 'https://localhost:7129/api/auth/google';
    },

    sendOtp : async (email: string) => {
        const res = await api.post('/auth/register/SendOtp', { email });
        return res.data;
    },
    
    verifiedOtp : async (fullname: string, email: string, password: string, otp: string)=> {
        const res = await api.post('/auth/register/VerifyOtp', { fullname, email, password, otp });
        return res.data;
    }
};