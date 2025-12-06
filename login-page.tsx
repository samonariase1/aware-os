'use client'

import { createClient } from '@/utils/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  // Listen for auth state changes to redirect user after login
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            AwareOS
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Initialize your cognitive environment.
          </p>
        </div>

        {/* The Deep Void Card */}
        <div className="
          relative
          bg-[#050505] /* Deep Void */
          border border-[#00E0FF]/20 /* Subtle Oxygen Teal Border */
          shadow-[0_0_25px_-5px_rgba(0,224,255,0.15)] /* Teal Glow */
          rounded-2xl
          p-8
          overflow-hidden
        ">
          
          {/* Supabase Auth UI Component */}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#00E0FF', // Oxygen Teal button
                    brandAccent: '#00b3cc', // Darker teal on hover
                    brandButtonText: '#050505', // Dark text on teal button
                    defaultButtonBackground: '#121418', // Surface color
                    defaultButtonBackgroundHover: '#1e2126',
                    inputBackground: '#0a0a0a',
                    inputBorder: '#333333',
                    inputBorderHover: '#00E0FF',
                    inputBorderFocus: '#00E0FF',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              className: {
                button: 'font-semibold tracking-wide',
                input: 'text-text placeholder-neutral-600',
              },
            }}
            theme="dark"
            providers={['google', 'github']} // Add or remove providers as needed
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
            showLinks={true}
          />
        </div>
      </div>
    </div>
  )
}