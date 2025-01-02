'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = async () => {
        try {
            console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/v1/line/login?tracking_id=ABC123`);

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/line/login?tracking_id=ABC123`
            );

            console.log('API Response:', response);

            const { auth_url } = response.data;
            if (auth_url) {
                console.log('Redirecting to:', auth_url);
                window.location.href = auth_url;
            } else {
                console.error('auth_url is undefined', response.data);
            }
        } catch (error: any) {
            console.error('Error during API connection test:', error.message);
            console.error('Error Details:', error.response?.data || error);
        }
    };

    return (
        <div>
            <h1>LINEログインする！</h1>
            <button onClick={handleLogin}>LINEでログイン</button>
        </div>
    );
}
