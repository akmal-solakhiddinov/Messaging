import axios from 'axios';

// Create an Axios instance with default configuration
const $axios = axios.create({
    baseURL: 'http://localhost:4000/api/v-1/',
    headers: { 'Content-Type': 'application/json' },
});

$axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
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
