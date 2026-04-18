import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Send, Code2, RotateCcw, ChevronLeft, Sparkles,
  Hash, GitBranch, Layers, Zap, Binary
} from 'lucide-react'

const SUGGESTIONS = [
  { icon: Hash, text: 'Explain binary search with examples' },
  { icon: GitBranch, text: 'How does DFS differ from BFS?' },
  { icon: Layers, text: 'What is dynamic programming?' },
  { icon: Binary, text: 'Explain merge sort time complexity' },
  { icon: Zap, text: 'Solve two-sum problem step by step' },
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 shadow-lg shadow-violet-500/30">
          A
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-violet-600 text-white rounded-tr-sm'
            : 'bg-white/5 border border-white/8 text-gray-200 rounded-tl-sm'
        }`}
      >
        {msg.content}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 text-xs font-semibold shrink-0 mt-1">
          U
        </div>
      )}
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 justify-start"
    >
      <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-violet-500/30">
        A
      </div>
      <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userText }])
    setLoading(true)

    try {
      const history = [...messages, { role: 'user', content: userText }].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system:
            'You are AlgoMind, an expert DSA (Data Structures & Algorithms) instructor. Explain concepts clearly, use examples and pseudocode when helpful, and guide users step-by-step. Keep responses concise but thorough. Format code with proper indentation.',
          messages: history,
        }),
      })

      const data = await res.json()
      const reply = data?.content?.map((c) => c.text || '').join('') || 'Sorry, I could not respond. Please try again.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please check your setup and try again.' },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => setMessages([])
  const isEmpty = messages.length === 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-[#0a0a0f] flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-white/8 bg-[#0d0d14] shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-semibold text-white text-sm">
              Algo<span className="text-violet-400">Mind</span>
            </span>
            <span className="hidden sm:block text-gray-600 text-xs ml-1">— DSA Instructor</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 text-xs transition-all border border-transparent hover:border-white/8"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:block">New Chat</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Live</span>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Empty state / landing */
          <div className="h-full flex flex-col items-center justify-center px-4 py-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-violet-500/30">
                <Sparkles size={28} className="text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                Ask me anything about DSA
              </h1>
              <p className="text-gray-400 text-sm md:text-base mb-10 max-w-sm">
                From arrays to dynamic programming — I'll explain, guide, and help you solve problems step by step.
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-col gap-2.5 max-w-md mx-auto">
                {SUGGESTIONS.map(({ icon: Icon, text }) => (
                  <button
                    key={text}
                    onClick={() => sendMessage(text)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-gray-300 text-sm text-left hover:bg-white/[0.08] hover:border-white/15 hover:text-white transition-all duration-200 group"
                  >
                    <Icon size={15} className="text-violet-400 shrink-0" />
                    {text}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}
              {loading && <TypingIndicator key="typing" />}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-white/8 bg-[#0d0d14] px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 rounded-2xl bg-white/4 border border-white/10 focus-within:border-violet-500/40 focus-within:bg-white/6 transition-all duration-200 px-4 py-3">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
              }}
              onKeyDown={handleKey}
              placeholder="Ask about any DSA topic..."
              disabled={loading}
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 resize-none outline-none leading-relaxed disabled:opacity-50 min-h-6 max-h-35 overflow-y-auto"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-white/10 disabled:text-gray-600 flex items-center justify-center text-white transition-all duration-200 shrink-0 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-violet-600/30 disabled:shadow-none"
            >
              <Send size={15} />
            </button>
          </div>
          <p className="text-center text-gray-600 text-xs mt-2">
            Press <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 text-[10px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 text-[10px]">Shift+Enter</kbd> for newline
          </p>
        </div>
      </div>
    </motion.div>
  )
}