/**
 * u30a2u30d7u30eau30b1u30fcu30b7u30e7u30f3u5168u4f53u3067u4f7fu7528u3059u308baxiosu8a2du5b9a
 */

import axios from 'axios';

// APIu306eBase URLu3092u8a2du5b9a
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// axiosu30a4u30f3u30b9u30bfu30f3u30b9u306eu4f5cu6210
const instance = axios.create({
  baseURL: apiUrl,
  timeout: 15000, // 15u79d2
  headers: {
    'Content-Type': 'application/json',
  },
});

// u30eau30afu30a8u30b9u30c8u30a4u30f3u30bfu30fcu30bbu30d7u30bfu30fc
instance.interceptors.request.use(
  (config) => {
    // u30c8u30fcu30afu30f3u304cu3042u308cu3070u30d8u30c3u30c0u30fcu306bu8ffdu52a0
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// u30ecu30b9u30ddu30f3u30b9u30a4u30f3u30bfu30fcu30bbu30d7u30bfu30fc
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // u30a8u30e9u30fcu51e6u7406
    if (error.response) {
      // u8a8du8a3cu30a8u30e9u30fc (401) u306eu5834u5408u306eu51e6u7406
      if (error.response.status === 401) {
        console.log('u8a8du8a3cu30a8u30e9u30fcu3067u3059u3002u518du30edu30b0u30a4u30f3u304cu5fc5u8981u306au5834u5408u304cu3042u308au307eu3059');
        // u4f8b: u30edu30b0u30a4u30f3u30dau30fcu30b8u306bu30eau30c0u30a4u30ecu30afu30c8u3059u308bu306au3069
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
