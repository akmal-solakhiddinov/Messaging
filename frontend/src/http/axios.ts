import axios from 'axios';

const $axios = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/v-1/`,
    headers: { 'Content-Type': 'application/json' },
});

$axios.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken')
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error);
});

// $axios.interceptors.response.use(response => {
//   // Handle responses or errors here
//   return response;
// }, error => {
//   return Promise.reject(error);
// });

export default $axios;
