'use client'

import { useState, useEffect } from 'react'
import { SplashScreen } from './splash-screen'

export function SplashController() {
  const [show, setShow] = useState<boolean | null>(null)

  useEffect(() => {
    const seen = sessionStorage.getItem('splash-seen')
    setShow(!seen)
  }, [])

  if (!show) return null

  return (
    <SplashScreen
      onComplete={() => {
        sessionStorage.setItem('splash-seen', '1')
        setShow(false)
      }}
    />
  )
}
