import axios from "axios";

/* Define base URL for axios to make requests,
set requests header's format accepted by backend */
axios.defaults.baseURL = "https://drf-travelshutter.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();