import a from 'axios';

const axios = a.create({
    baseURL: import.meta.env.PROD ? "https://certamina-com.onrender.com/api/v1" : "http://localhost:3000",
    withCredentials: true
})

export default axios;