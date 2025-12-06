'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

// Define a simple interface for the Profile data
interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        // 1. Get the current logged-in user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setError("No user logged in. Check your Auth setup.")
          return
        }

        // 2. Fetch their profile from the 'profiles' table
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError) throw fetchError
        setProfile(data)
        
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Render logic
  if (loading) return <div className="p-8 text-neutral-400">Loading profile...</div>
  
  if (error) return (
    <div className="p-8 text-warning">
      <h2 className="text-xl font-bold">Connection Check Failed</h2>
      <p>{error}</p>
      <p className="text-sm mt-4 text-neutral-500">
        (If you haven't implemented Login yet, this error is expected!)
      </p>
    </div>
  )

  return (
    <div className="p-8 text-text">
      <h1 className="text-2xl font-bold text-primary mb-4">User Profile</h1>
      <div className="bg-surface p-6 rounded-lg border border-neutral-800">
        <p><span className="text-neutral-500">Name:</span> {profile?.full_name || 'No name set'}</p>
        <p><span className="text-neutral-500">ID:</span> {profile?.id}</p>
      </div>
    </div>
  )
}