import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '12,400+', label: 'Active Learners', sub: 'engineers leveling up daily' },
  { value: '280K+',   label: 'Problems Explained', sub: 'across all difficulty levels' },
  { value: '94%',     label: 'Interview Success', sub: 'of users who practiced 30+ days' },
  { value: '50+',     label: 'DSA Topics', sub: 'from basics to advanced' },
]

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative py-24 bg-[#0a0a0f]">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      {/* BG accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-violet-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-4 block">
            By the numbers
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Trusted by engineers{' '}
            <span className="bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group rounded-2xl bg-white/3 border border-white/8 p-6 md:p-8 text-center hover:bg-white/6 hover:border-white/15 transition-all duration-300 overflow-hidden"
            >
              {/* Inner glow on hover */}
              <div className="absolute inset-0 bg-linear-to-b from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight bg-linear-to-r from-white to-gray-300 bg-clip-text">
                {stat.value}
              </div>
              <div className="text-violet-300 font-semibold text-sm mb-1">{stat.label}</div>
              <div className="text-gray-500 text-xs">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 rounded-2xl bg-linear-to-r from-violet-600/10 via-blue-600/10 to-violet-600/10 border border-violet-500/15 p-6 md:p-8 text-center"
        >
          <p className="text-gray-300 text-lg md:text-xl font-medium italic max-w-2xl mx-auto leading-relaxed">
            "AlgoMind helped me go from struggling with linked lists to passing my Google interview in 6 weeks. Best DSA resource I've used."
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
              R
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-semibold">Riya Sharma</p>
              <p className="text-gray-500 text-xs">Software Engineer @ Google</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}