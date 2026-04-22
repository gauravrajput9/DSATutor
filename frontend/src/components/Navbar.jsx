import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, User } from "lucide-react";
import { checkAuth } from "@/lib/checkAuth";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 Check auth on load
  useEffect(() => {
    const verifyAuth = async () => {
      const result = await checkAuth();
      setIsLoggedIn(result);
      console.log(result)
    };

    verifyAuth();
  }, []);

  // 🌊 Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 🔓 Logout (cookie-based)
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  // ⏳ Avoid flicker
  if (isLoggedIn === null) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-lg">
            Algo<span className="text-violet-400">Mind</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              location.pathname === "/"
                ? "text-white bg-white/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Home
          </Link>

          {isLoggedIn && (
            <Link
              to="/chat"
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname === "/chat"
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Chat
            </Link>
          )}

          {!isLoggedIn && (
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname === "/login"
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === "/profile"
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>

              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <User size={15} className="text-gray-300" />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>

              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0f]/95 px-6 pb-4"
          >
            <div className="flex flex-col gap-2 pt-3">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>

              {isLoggedIn && (
                <Link to="/chat" onClick={() => setMenuOpen(false)}>
                  Chat
                </Link>
              )}

              {isLoggedIn && (
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
              )}

              {!isLoggedIn && (
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              )}

              {isLoggedIn && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-red-400 text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
