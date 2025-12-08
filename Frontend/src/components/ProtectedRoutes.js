import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center text-yellow-500 p-5">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
