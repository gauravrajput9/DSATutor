import { Link } from 'react-router-dom'
// import { Code2, Twitter, Linkedin, Youtube } from 'lucide-react'
import { Code2 } from 'lucide-react'

const footerLinks = {
  Product: ['Features', 'Roadmap', 'Changelog', 'Pricing'],
  Learn: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Legal: ['Privacy', 'Terms', 'Cookie Policy'],
}

const socials = []

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a0f] border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Algo<span className="text-violet-400">Mind</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              The AI-powered DSA instructor helping engineers crack top-tier technical interviews.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-500 text-sm hover:text-gray-300 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} AlgoMind. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}