import store from "../store";
import { openAuthSidebar } from "../features/uiSlice";

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const res = await fetch(url, { ...options, headers });

  if ((res.status === 401 || res.status === 403) && token) {
    if (!window.location.pathname.includes("login")) {
      localStorage.removeItem("token");
      store.dispatch(openAuthSidebar());
    }
    return;
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null; // یا throw error
  }

  return res.json();
};
