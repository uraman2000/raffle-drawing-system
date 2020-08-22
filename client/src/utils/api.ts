import axios, { Method } from "axios";
import { getAccess, setAccess } from "./localStorage";
const baseURL = process.env.NODE_ENV === "development" ? "localhost" : "18.140.209.86";
const apiBase = `http://${baseURL}:3000/api/`;
const jwtDecode = require("jwt-decode");

const getInstance = async () => {
  const axiosInstance = axios.create({
    baseURL: `${apiBase}/`,
    headers: {
      access_token: getAccess().access_token,
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const data = error.response.data;

      if (error.response.status === 401) {
        const originalRequest = error.config;
        const decode = jwtDecode(getAccess().access_token);
        const getdata: any = await api.post("auth/refresh/", decode);
        setAccess(getdata.data);
        originalRequest.headers.access_token = getAccess().access_token;

        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const api = {
  get: async (endpoint: string) => {
    const res = await (await getInstance()).get(`${apiBase}${endpoint}`);
    return res.data;
  },
  post: async (endpoint: string, data: any) => {
    return await (await getInstance()).post(`${apiBase}${endpoint}`, data);
  },
  put: async (endpoint: string, data: any) => {
    return await (await getInstance()).put(`${apiBase}${endpoint}`, data);
  },
  delete: async (endpoint: string) => {
    return await (await getInstance()).delete(`${apiBase}${endpoint}`);
  },
};
