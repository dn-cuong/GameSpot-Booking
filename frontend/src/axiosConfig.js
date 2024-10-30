// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000', // Địa chỉ backend của bạn
});

export default instance;
