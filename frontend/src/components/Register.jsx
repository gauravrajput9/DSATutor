import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Creating your account...");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Account created successfully!", { id: loadingToast });
      navigate("/chat");
    } catch (err) {
      toast.error(err.message || "Registration failed.", { id: loadingToast });
      console.error(err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden px-6">
      {/* Background (same as Hero) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-purple-600/10 rounded-full blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4">
              <Sparkles size={14} />
              Join AlgoMind
            </div>

            <h2 className="text-3xl font-bold text-white">
              Create Your{" "}
              <span className="bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Account
              </span>
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Start your DSA learning journey today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-violet-500/50 transition"
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-violet-500/50 transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-violet-500/50 transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-95"
            >
              Sign Up
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-violet-400 cursor-pointer hover:underline"
            >
              Log in
            </span>
          </p>

          <button
            onClick={() => navigate("/")}
            className=" mt-3 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-95"
          >
            {" "}
            Go Back Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}