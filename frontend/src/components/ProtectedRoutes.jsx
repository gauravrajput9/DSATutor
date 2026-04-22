import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
          method: "POST"
        });

        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  // ⏳ loading state
  if (isAuth === null) return <div>Loading...</div>;

  // ❌ not logged in
  if (!isAuth) return <Navigate to="/login" />;

  // ✅ allowed
  return children;
}
