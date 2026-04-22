import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain, Code2, GitBranch, Zap, MessageSquare, Trophy } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Explanations',
    description: 'Get crystal-clear explanations for any DSA concept. AlgoMind adapts to your skill level and explains with the right depth.',
    accent: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
  },
  {
    icon: Code2,
    title: 'Live Code Walkthroughs',
    description: 'Step through algorithm implementations line by line. See exactly how the code maps to the underlying logic.',
    accent: 'from-blue-500 to-cyan-600',
    glow: 'shadow-blue-500/20',
  },
  {
    icon: GitBranch,
    title: 'Complexity Analysis',
    description: 'Instantly understand time and space complexity. AlgoMind breaks down Big-O notation with real-world analogies.',
    accent: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
  },
  {
    icon: Zap,
    title: 'Instant Problem Solving',
    description: 'Paste any LeetCode or HackerRank problem and get a structured approach, hints, and solution explanation.',
    accent: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
  },
  {
    icon: MessageSquare,
    title: 'Natural Conversation',
    description: 'Ask follow-up questions naturally. AlgoMind maintains full context across your session to keep the flow going.',
    accent: 'from-pink-500 to-rose-600',
    glow: 'shadow-pink-500/20',
  },
  {
    icon: Trophy,
    title: 'Interview Prep Mode',
    description: 'Practice with FAANG-style interview questions, get feedback on your approach, and improve your problem-solving speed.',
    accent: 'from-indigo-500 to-violet-600',
    glow: 'shadow-indigo-500/20',
  },
]

function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-2xl bg-white/3 border border-white/8 p-6 hover:bg-white/6 hover:border-white/15 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Hover glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br ${feature.accent} opacity-[0.03]`} />

      <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.accent} flex items-center justify-center mb-4 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} className="text-white" />
      </div>

      <h3 className="text-white font-semibold text-lg mb-2 tracking-tight">{feature.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  )
}

export default function Features() {
  const titleRef = useRef(null)
  const isInView = useInView(titleRef, { once: true, margin: '-60px' })

  return (
    <section className="relative py-32 bg-[#0a0a0f]">
      {/* Subtle separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-violet-400 text-sm font-semibold tracking-widest uppercase mb-4"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
          >
            Everything you need to{' '}
            <span className="bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              ace interviews
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            AlgoMind combines AI intelligence with deep DSA knowledge to give you the most comprehensive learning experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}