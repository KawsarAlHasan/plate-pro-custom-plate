"use client";
import Cookies from "js-cookie";
import axios from "axios";

export const BASE_URL = "https://plateapi.dsrt321.online";
// export const BASE_URL = "http://10.10.7.76:14050";
// export const BASE_URL = "http://10.10.7.76:14030";

export const API = axios.create({
  baseURL: BASE_URL,
});

export const fetcher = (url) => API.get(url).then((res) => res.data);

export const fetcherWithToken = (url) => {
  const token = Cookies.get("token");
  return API.get(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((res) => res.data);
};

export const fetcherWithTokenPost = (url, data) => {
  const token = Cookies.get("token");
  return API.post(url, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((res) => res.data);
};

export const fetcherWithTokenPatch = (url, data) => {
  const token = Cookies.get("token");
  return API.patch(url, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((res) => res.data);
};

export const fetcherWithTokenPut = (url, data) => {
  const token = Cookies.get("token");
  return API.put(url, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((res) => res.data);
};

export const fetcherWithTokenPostFormData = (url, formData) => {
  const token = Cookies.get("token");
  return API.post(url, formData, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then((res) => res.data);
};
