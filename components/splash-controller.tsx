'use client'

import { useState } from 'react'
import { SplashScreen } from './splash-screen'

export function SplashController() {
  const [done, setDone] = useState(false)
  if (done) return null
  return <SplashScreen onComplete={() => setDone(true)} />
}
