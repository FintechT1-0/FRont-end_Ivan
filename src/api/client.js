import axios from "axios"
import { getToken, clearToken } from "../utils/token.js"

const baseURL = import.meta.env.VITE_API_BASE
export const API_BASE = baseURL

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const t = getToken()
  if (t) config.headers.Authorization = `Bearer ${t}`
  config.headers["Content-Type"] = "application/json"
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      clearToken()
      if (typeof window !== "undefined") window.location.assign("/login")
    }
    if (status === 403) {
      if (typeof window !== "undefined") window.location.assign("/login")
    }
    return Promise.reject(error)
  }
)

export default api
  