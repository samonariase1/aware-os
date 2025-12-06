import { createClient } from '@/utils/supabase/server'
import Dashboard from '@/components/Dashboard'
import Link from 'next/link'
import { Terminal } from 'lucide-react'

export default async function Home() {
  // 1. Check Auth Status on Server
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 2. If User Exists, Render Dashboard
  if (user) {
    return (
      <main className="min-h-screen">
        {/* We pass the initial user to the dashboard if needed, 
            but the dashboard fetches its own data currently. */}
        <Dashboard />
      </main>
    )
  }

  // 3. If No User, Render Manifesto (Terminal Style)
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505] text-left">
      <div className="max-w-2xl w-full space-y-12">
        
        {/* Terminal Header */}
        <div className="flex items-center gap-2 text-neutral-600 border-b border-neutral-800 pb-2 mb-8">
          <Terminal size={16} />
          <span className="text-xs tracking-widest uppercase">System Boot /// Root Access</span>
        </div>

        {/* The Manifesto */}
        <div className="space-y-6 font-mono text-lg md:text-2xl leading-relaxed">
          <p className="text-neutral-400">
            &gt; The Attention Economy is over.
          </p>
          <p className="text-[#00E0FF]">
            &gt; Welcome to the Intention Economy.
            <span className="inline-block w-3 h-6 bg-[#00E0FF] ml-2 animate-pulse align-middle"></span>
          </p>
        </div>

        {/* Decorative Binary/Hex Rain (Static for minimalism) */}
        <div className="grid grid-cols-2 gap-8 text-xs font-mono text-neutral-700 mt-12 opacity-50">
          <div>
            0x4F 0x50 0x54 0x49 0x4D 0x49 0x5A 0x45<br/>
            0x43 0x4C 0x41 0x52 0x49 0x54 0x59 0x2E
          </div>
          <div className="text-right">
            ERR_DISTRACTION_NOT_FOUND<br/>
            STATUS: AWAITING_INPUT
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-12">
          <Link href="/login">
            <button className="
              group relative
              px-8 py-4 
              bg-transparent 
              text-[#00E0FF] 
              font-mono font-bold tracking-wider
              border border-[#00E0FF]
              hover:bg-[#00E0FF]/10
              transition-all duration-300
              uppercase
            ">
              <span className="absolute inset-0 w-full h-full bg-[#00E0FF]/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              [ Initialize Neural Link ]
            </button>
          </Link>
        </div>

      </div>
    </main>
  )
}