import a from 'axios';

const axios = a.create({
    baseURL: `${import.meta.env.PROD ? import.meta.env.VITE_PROD_API_URL : import.meta.env.VITE_DEV_API_URL}/api/v1`,
    withCredentials: true
});

export default axios