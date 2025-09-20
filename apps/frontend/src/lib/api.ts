import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // 세션, 쿠키
    headers: {
        'Content-Type': 'application/json',
    },
})