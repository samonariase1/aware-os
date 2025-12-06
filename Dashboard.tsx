'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Brain, Zap } from 'lucide-react'

// Define the shape of our data
interface AnalysisLog {
  id: string
  created_at: string
  input_text: string
  emotional_state: string
  clarity_score: number
  attention_score: number
  recommendation: string
}

export default function Dashboard() {
  const [logs, setLogs] = useState<AnalysisLog[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // 1. Fetch initial data and set up Realtime subscription
  useEffect(() => {
    const fetchInitialLogs = async () => {
      const { data } = await supabase
        .from('analysis_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) setLogs(data)
      setLoading(false)
    }

    fetchInitialLogs()

    // Realtime Subscription
    const channel = supabase
      .channel('realtime-logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analysis_logs',
        },
        (payload) => {
          // Animate the new log in by adding it to the top of the state
          const newLog = payload.new as AnalysisLog
          setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 19)]) // Keep list at max 20
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Calculate the gauge values based on the LATEST log
  const latestLog = logs[0]
  const score = latestLog?.attention_score || 0
  
  // SVG Circle Logic for the Gauge
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  if (loading) return <div className="p-8 text-neutral-500 animate-pulse">Syncing neural feed...</div>

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
      
      {/* HERO GAUGE SECTION */}
      <div className="relative bg-surface border border-neutral-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl">
        <div className="z-10 text-center md:text-left">
          <h2 className="text-xl font-bold text-neutral-400 uppercase tracking-widest mb-1">Current Focus</h2>
          <h1 className="text-4xl font-black text-text">
            {latestLog ? latestLog.emotional_state : 'No Data'}
          </h1>
          <p className="text-primary mt-2 flex items-center gap-2">
            <Zap size={16} /> Live Cognitive Metrics
          </p>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-48 h-48 mt-6 md:mt-0 flex items-center justify-center">
          {/* Outer Glow */}
          <div className="absolute inset-0 bg-[#00E0FF] blur-3xl opacity-10 rounded-full"></div>
          
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="#1e2126"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress Circle */}
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              cx="50%"
              cy="50%"
              r={radius}
              stroke="#00E0FF" // Oxygen Teal
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-bold text-text">{score}</span>
            <span className="text-xs text-neutral-500 uppercase tracking-wide">Attention</span>
          </div>
        </div>
      </div>

      {/* RECENT LOGS LIST */}
      <div className="space-y-4">
        <h3 className="text-neutral-400 font-medium px-2 flex items-center gap-2">
          <Activity size={16} /> Recent Analysis
        </h3>

        <div className="space-y-3">
          <AnimatePresence mode='popLayout'>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="
                  bg-[#0a0a0a] 
                  border border-neutral-800 hover:border-[#00E0FF]/50 
                  p-4 rounded-xl 
                  transition-colors group
                "
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold text-sm uppercase">
                        {log.emotional_state}
                      </span>
                      <span className="text-xs text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-sm line-clamp-2">
                      {log.recommendation}
                    </p>
                  </div>

                //Example usage in Dashboard.tsx
                  <div classname="w-16 h-16">
                    <logo processing={isSyncing || loading} />
                  </div>
                  
                  {/* Mini Stats */}
                  <div className="flex gap-4 text-xs text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-neutral-500">Clarity</span>
                      <span className={`font-mono ${log.clarity_score > 70 ? 'text-green-400' : 'text-warning'}`}>
                        {log.clarity_score}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {logs.length === 0 && (
            <div className="text-center py-12 text-neutral-600 border border-dashed border-neutral-800 rounded-xl">
              <Brain className="mx-auto mb-2 opacity-20" size={32} />
              <p>No neural patterns detected yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}