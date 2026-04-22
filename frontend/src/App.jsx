import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import LoginPage from "./components/Signup";
import RegisterPage from "./components/Register";
import ProfilePage from "./components/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Toaster } from "./components/ui/sonner"

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top" />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* 🔒 Protected Route */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
