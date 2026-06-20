'use client'

import { useState } from 'react'
import {
  Car,
  GaugeCircle,
  GitMerge,
  Leaf,
  Lock,
  LogOut,
  Menu,
  ScrollText,
  ShieldCheck,
  Users,
  UsersRound,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useStore } from './store'
import { DashboardView } from './views/dashboard-view'
import { VehiculosView } from './views/vehiculos-view'
import { PersonasView } from './views/personas-view'
import { SanitarioView } from './views/sanitario-view'
import { CruceView } from './views/cruce-view'
import { UsuariosView } from './views/usuarios-view'
import { AuditoriaView } from './views/auditoria-view'

type ViewId =
  | 'dashboard'
  | 'cruce'
  | 'vehiculos'
  | 'personas'
  | 'sanitario'
  | 'usuarios'
  | 'auditoria'

const NAV: {
  id: ViewId
  label: string
  rf: string
  icon: typeof Car
}[] = [
  { id: 'dashboard', label: 'Dashboard', rf: 'RF10', icon: GaugeCircle },
  { id: 'cruce', label: 'Control de Cruce Único', rf: 'RF03', icon: GitMerge },
  { id: 'vehiculos', label: 'Módulo de Vehículos', rf: 'RF02', icon: Car },
  { id: 'personas', label: 'Módulo de Personas', rf: 'RF01', icon: UsersRound },
  { id: 'sanitario', label: 'Control Sanitario', rf: 'RF06', icon: Leaf },
  { id: 'usuarios', label: 'Administración de Usuarios', rf: 'RF09', icon: Users },
  { id: 'auditoria', label: 'Consola Audit Trail', rf: 'RNF10', icon: ScrollText },
]

export function CustomsApp() {
  const { currentUser, logout, logs } = useStore()
  const [view, setView] = useState<ViewId>('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  function go(id: ViewId) {
    setView(id)
    setMobileOpen(false)
  }

  return (
    <div className="flex min-h-svh bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Control Fronterizo</p>
            <p className="text-xs text-sidebar-foreground/60">Integrado CL — AR</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          >
            <X />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = view === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                <span
                  className={cn(
                    'font-mono text-[10px]',
                    active
                      ? 'text-sidebar-primary-foreground/70'
                      : 'text-sidebar-foreground/40',
                  )}
                >
                  {item.rf}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 flex items-center gap-2 rounded-md bg-sidebar-accent px-3 py-2 text-xs text-sidebar-accent-foreground">
            <Lock className="size-3.5 shrink-0" />
            <span>Canal cifrado · TLS 1.3 / AES-256</span>
          </div>
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="flex size-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
              {currentUser?.nombre.charAt(0) ?? 'A'}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium">
                {currentUser?.nombre}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {currentUser?.rol}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={logout}
              aria-label="Cerrar sesión"
              className="text-sidebar-foreground/80 hover:bg-sidebar-accent"
            >
              <LogOut />
            </Button>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      ) : null}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:px-8">
          <Button
            variant="outline"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu />
          </Button>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-success" />
            </span>
            <span className="text-sm font-medium">Paso Los Libertadores</span>
            <Badge variant="success" className="hidden sm:inline-flex">
              Operativo
            </Badge>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="muted" className="hidden font-mono md:inline-flex">
              {logs.length} eventos
            </Badge>
            <Badge variant="outline" className="hidden sm:inline-flex">
              Turno diurno
            </Badge>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 lg:p-8">
          {view === 'dashboard' && <DashboardView />}
          {view === 'cruce' && <CruceView />}
          {view === 'vehiculos' && <VehiculosView />}
          {view === 'personas' && <PersonasView />}
          {view === 'sanitario' && <SanitarioView />}
          {view === 'usuarios' && <UsuariosView />}
          {view === 'auditoria' && <AuditoriaView />}
        </main>
      </div>
    </div>
  )
}
