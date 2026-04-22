import { motion } from "framer-motion"
import Hero from "./Hero"
import Navbar from "./Navbar"
import Features from "./Features"
import Stats from "./Stats"
import Footer from "./Footer"

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0a0a0f] min-h-screen"
    >
      <Navbar />

      <main className="pt-20">
        <Hero />
        <Features />
        <Stats />
        <Footer />
      </main>
    </motion.div>
  )
}