import axios from 'axios';
const API = axios.create({
    // Changed REACT_APP_ to VITE_
    baseURL: import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api` 
        : 'http://localhost:8000/api'
});

export default API