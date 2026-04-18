import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, Eye, EyeOff, ArrowRight} from 'lucide-react'

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/chat')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden"
    >
      {/* BG glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-75 h-75 bg-blue-600/6 rounded-full blur-[80px] pointer-events-none" />

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors"
      >
        <Code2 size={16} />
        <span className="font-bold">
          Algo<span className="text-violet-400">Mind</span>
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/3 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
              <Code2 size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isSignup
                ? 'Start your DSA journey with AlgoMind'
                : 'Continue your learning journey'}
            </p>
          </div>

          {/* OAuth
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm font-medium hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-200 mb-5">
            <Github size={18} />
            Continue with GitHub
          </button> */}

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#0e0e17] text-gray-600">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Riya Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all duration-200"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-400">Password</label>
                {!isSignup && (
                  <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-gray-500 text-sm mt-6">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              {isSignup ? 'Sign in' : 'Sign up for free'}
            </button>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-gray-600 text-xs mt-5 px-4">
          By continuing, you agree to our{' '}
          <a href="#" className="text-gray-500 hover:text-gray-300 underline transition-colors">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-gray-500 hover:text-gray-300 underline transition-colors">Privacy Policy</a>.
        </p>
      </motion.div>
    </motion.div>
  )
}