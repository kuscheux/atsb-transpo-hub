"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function PublicNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ backgroundColor: "#0A1628", borderBottom: "1px solid rgba(201,168,76,0.2)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden"
              style={{ backgroundColor: "#0A1628" }}>
              <Image src="/teamsters-logo.png" alt="Teamsters" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <div className="text-white font-black text-sm leading-tight tracking-widest">TEAMSTERS</div>
              <div className="text-xs font-semibold leading-tight tracking-widest" style={{ color: "#C9A84C" }}>
                LOCAL 728 · ATLANTA
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ color: pathname === link.href ? "#C9A84C" : "rgba(255,255,255,0.72)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/members">
              <Button
                size="sm"
                variant="outline"
                className="text-white bg-transparent hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                Member Login
              </Button>
            </Link>
            <Link href="/members/dues">
              <Button
                size="sm"
                className="font-semibold hover:opacity-90"
                style={{ backgroundColor: "#C9A84C", color: "#0A1628" }}
              >
                Pay Dues
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-white" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 py-4 space-y-2"
          style={{ borderTop: "1px solid rgba(201,168,76,0.2)", backgroundColor: "#0A1628" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm py-2"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid rgba(201,168,76,0.12)" }}>
            <Link href="/members" className="flex-1">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-white bg-transparent"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                Member Login
              </Button>
            </Link>
            <Link href="/members/dues" className="flex-1">
              <Button
                size="sm"
                className="w-full font-semibold"
                style={{ backgroundColor: "#C9A84C", color: "#0A1628" }}
              >
                Pay Dues
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
