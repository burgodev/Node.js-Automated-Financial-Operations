import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:80/api/",
    baseURL: "https://api-hml.selectmarkets.global/api/",
});

export default api;
