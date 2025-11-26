import React from "react"
import { Navigate } from "react-router-dom"
import { getToken, isExpired } from "../utils/token.js"

export default function ProtectedRoute({ children }) {
  const tk = getToken()
  if (!tk || isExpired()) return <Navigate to="/login" replace />
  return children
}
