import a from 'axios';

const axios = a.create({
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true
})

export default axios;