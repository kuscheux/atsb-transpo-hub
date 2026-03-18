'use client'

import { useAppTheme, type AppTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const themes: {
  id: AppTheme
  label: string
  description: string
  preview: { bg: string; sidebar: string; card: string; primary: string; accent: string }
}[] = [
  {
    id: 'default',
    label: 'Default',
    description: 'Clean black & white',
    preview: {
      bg: '#09090b',
      sidebar: '#18181b',
      card: '#27272a',
      primary: '#fafafa',
      accent: '#3f3f46',
    },
  },
  {
    id: 'teamsters',
    label: 'Teamsters',
    description: 'Union 728 navy & gold',
    preview: {
      bg: '#0c1020',
      sidebar: '#112440',
      card: '#1a2d50',
      primary: '#FEA81A',
      accent: '#FEA81A',
    },
  },
]

export function ThemeSettings() {
  const { theme, setTheme } = useAppTheme()

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {themes.map((t) => {
        const active = theme === t.id
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              'group relative flex flex-col gap-3 rounded-xl border-2 p-4 text-left transition-all hover:border-primary',
              active ? 'border-primary' : 'border-border',
            )}
          >
            {/* Mini app preview */}
            <div
              className="h-24 w-full overflow-hidden rounded-lg"
              style={{ background: t.preview.bg }}
            >
              <div className="flex h-full">
                {/* Sidebar strip */}
                <div
                  className="h-full w-8 shrink-0"
                  style={{ background: t.preview.sidebar }}
                >
                  <div className="mt-3 mx-1.5 space-y-1">
                    {[40, 60, 50, 55].map((w, i) => (
                      <div
                        key={i}
                        className="h-1.5 rounded-full opacity-50"
                        style={{ width: `${w}%`, background: t.preview.primary }}
                      />
                    ))}
                  </div>
                </div>
                {/* Main area */}
                <div className="flex-1 p-2 space-y-1.5">
                  <div
                    className="h-3 w-3/4 rounded"
                    style={{ background: t.preview.card }}
                  />
                  <div
                    className="h-10 w-full rounded-lg"
                    style={{ background: t.preview.card }}
                  >
                    <div
                      className="h-1.5 w-1/3 rounded-full mt-2 ml-2"
                      style={{ background: t.preview.accent, opacity: 0.9 }}
                    />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-6 flex-1 rounded" style={{ background: t.preview.card }} />
                    <div className="h-6 flex-1 rounded" style={{ background: t.preview.card }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-0.5">
              <p className="text-sm font-medium leading-none">{t.label}</p>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </div>

            {active && (
              <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
