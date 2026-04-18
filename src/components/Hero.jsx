import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-100 h-100 bg-blue-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-75 h-75 bg-purple-600/8 rounded-full blur-[80px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8"
        >
          <Sparkles size={14} />
          AI-Powered DSA Learning — Free to Start
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
        >
          Master{' '}
          <span className="bg-linear-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Algorithms
          </span>
          <br />
          with Your AI Tutor
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-400 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Get instant explanations, step-by-step walkthroughs, and interactive problem solving for every DSA topic — from arrays to dynamic programming.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/chat')}
            className="group flex items-center gap-2.5 px-7 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-violet-600/30 hover:shadow-violet-500/40 hover:scale-105 active:scale-95"
          >
            Start Learning Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-7 py-4 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 font-medium text-base transition-all duration-200 hover:bg-white/5">
            Watch Demo
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-500"
        >
          <span>✓ No credit card required</span>
          <span className="hidden sm:block">✓ 50+ DSA topics covered</span>
          <span>✓ Used by 12,000+ engineers</span>
        </motion.div>

        {/* Floating code preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-16 relative mx-auto max-w-2xl"
        >
          <div className="rounded-2xl bg-[#111118] border border-white/8 p-5 text-left shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-gray-500 font-mono">AlgoMind Chat</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs flex-shrink-0">
                  U
                </div>
                <div className="bg-white/5 rounded-xl rounded-tl-sm px-4 py-3 text-sm text-gray-300">
                  Explain binary search with time complexity
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-violet-600/20 border border-violet-500/20 rounded-xl rounded-tr-sm px-4 py-3 text-sm text-gray-200 max-w-xs">
                  Binary search runs in <span className="text-violet-300 font-mono">O(log n)</span> by halving the search space each step. Here's how it works...
                </div>
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center text-xs flex-shrink-0 text-white font-bold">
                  A
                </div>
              </div>
            </div>
          </div>
          {/* Glow under card */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-violet-600/20 blur-xl rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}