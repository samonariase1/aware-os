'use client'

import { useState } from 'react'
import { Send, Loader2, Sparkles, WifiOff } from 'lucide-react'
import { saveToQueue } from '@/lib/queue'

export default function InputZone() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || loading) return

    // OFFLINE CHECK
    if (!navigator.onLine) {
      saveToQueue(text)
      setText('')
      alert("Offline: Entry queued for sync.") // Simple notification
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) throw new Error('Analysis failed')
      
      // Clear input on success
      setText('')
      
    } catch (error) {
      console.error(error)
      // Optional: Save to queue if API fails even if navigator says online
      saveToQueue(text)
      setText('')
      alert("Connection unstable. Saved to offline queue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 left-0 w-full px-4 z-50">
      <div className="max-w-4xl mx-auto">
        <form 
          onSubmit={handleAnalyze}
          className="
            relative
            flex items-center gap-2
            p-2
            rounded-2xl
            bg-[#121418]/80
            backdrop-blur-xl
            border border-neutral-800
            shadow-[0_8px_32px_rgba(0,0,0,0.5)]
            transition-all duration-300
            focus-within:border-[#00E0FF]/50
            focus-within:shadow-[0_0_20px_rgba(0,224,255,0.1)]
          "
        >
          {/* Decorative Icon */}
          <div className="pl-3 text-primary animate-pulse">
            <Sparkles size={18} />
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Log your current mental state..."
            disabled={loading}
            className="
              flex-1
              bg-transparent
              border-none
              outline-none
              text-text
              placeholder-neutral-500
              py-3
              text-lg
            "
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="
              p-3
              rounded-xl
              bg-[#00E0FF]
              text-[#050505]
              font-bold
              hover:bg-[#00b3cc]
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition-all
              flex items-center justify-center
            "
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}