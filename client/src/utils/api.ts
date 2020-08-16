import axios, { Method } from "axios";
const baseURL = process.env.NODE_ENV === "development" ? "localhost" : "localhost";
const apiBase = `http://${baseURL}:3000/api/`;

const instance = axios.create({
  baseURL: apiBase,
  //   timeout: 60000,
});

const request = (method: Method, url: string, data?: object) => {
  return new Promise((resolve, reject) => {
    (() => {
      if (method === "get") {
        return instance.request({
          url,
          method,
          params: data,
          headers: {},
        });
      } else {
        return instance.request({
          url,
          method,
          data,
          headers: {},
        });
      }
    })()
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

export default {
  get: (endpoint: string) => {
    return request("get", endpoint);
  },
  post: (endpoint: string, data: object) => {
    return request("post", endpoint, data);
  },
  put: (endpoint: string, data: object) => {
    return request("put", endpoint, data);
  },
  delete: (endpoint: string) => {
    return request("delete", endpoint);
  },
};
