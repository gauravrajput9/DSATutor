import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './components/HomePage'
import ChatPage from './components/ChatPage'
import LoginPage from './components/Signup'

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}