"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { useFBX, useAnimations, OrbitControls, Environment } from "@react-three/drei"
import * as THREE from "three"

// ── FBX model + animation ─────────────────────────────────────────────────────
function AnimatedModel({ url }: { url: string }) {
  const fbx  = useFBX(url)
  const { actions, names } = useAnimations(fbx.animations, fbx)

  useEffect(() => {
    const first = names[0]
    if (!first) return
    const action = actions[first]
    action?.reset().fadeIn(0.3).play()
    return () => { action?.fadeOut(0.3) }
  }, [actions, names])

  // Center the model
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(fbx)
    const center = box.getCenter(new THREE.Vector3())
    fbx.position.sub(center)
    fbx.position.y = -(box.getSize(new THREE.Vector3()).y / 2)
  }, [fbx])

  return <primitive object={fbx} scale={0.012} />
}

// ── Public component ──────────────────────────────────────────────────────────
type Props = {
  url: string          // Full URL or path — e.g. from Supabase Storage public URL
  height?: number      // px, default 400
  className?: string
  autoRotate?: boolean
}

export function FBXPlayer({ url, height = 400, className = "", autoRotate = false }: Props) {
  return (
    <div className={className} style={{ height, borderRadius: "0.75rem", overflow: "hidden", background: "#0d0d0d" }}>
      <Canvas camera={{ position: [0, 1.5, 3.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 6, 3]} intensity={1.2} castShadow />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <AnimatedModel url={url} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  )
}

// ── Hook: fetch available animations from Supabase Storage ────────────────────
export function useAnimations_() {
  const [animations, setAnimations] = useState<{ name: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) return

    fetch(`/api/animations`)
      .then((r) => r.json())
      .then((data) => {
        setAnimations(data.animations ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { animations, loading }
}
