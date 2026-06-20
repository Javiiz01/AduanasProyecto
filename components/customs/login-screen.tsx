'use client'

import { useState } from 'react'
import {
  AlertCircle,
  KeyRound,
  Lock,
  ShieldCheck,
  ShieldEllipsis,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Spinner, simulate } from './shared'
import { useStore, type Funcionario } from './store'

const ADMIN: Funcionario = {
  id: 'admin',
  nombre: 'Administrador General',
  email: 'admin@aduana.gob.cl',
  rol: 'Administrador',
  activo: true,
}

export function LoginScreen() {
  const { login, addLog } = useStore()
  const [step, setStep] = useState<'credenciales' | '2fa'>('credenciales')
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCredenciales(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await simulate()
    setLoading(false)

    // CP-01 / CP-02
    if (usuario.trim() === 'admin' && password === 'Aduana123') {
      addLog('Validación de credenciales primarias', 'Aprobado', 'admin')
      setStep('2fa')
    } else {
      setError('Credenciales Inválidas')
      addLog('Intento de inicio de sesión fallido', 'Rechazado', usuario || '—')
    }
  }

  async function handle2fa(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (otp.trim().length < 6) {
      setError('Ingrese el código de 6 dígitos enviado a su dispositivo.')
      return
    }
    setLoading(true)
    await simulate(900)
    setLoading(false)
    addLog('Inicio de sesión con doble factor (2FA)', 'Aprobado', ADMIN.nombre)
    login(ADMIN)
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand / institutional side */}
      <aside className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Control Fronterizo Integrado</p>
            <p className="text-xs text-sidebar-foreground/70">
              Aduanas Terrestres · Chile — Argentina
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-balance text-3xl font-semibold leading-tight">
            Plataforma única de control de cruce terrestre
          </h2>
          <p className="max-w-md text-pretty text-sm text-sidebar-foreground/70">
            Coordinación interinstitucional entre Aduana, PDI y SAG con
            digitación anticipada, fiscalización paralela y trazabilidad total
            del tránsito fronterizo.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sidebar-accent px-3 py-1 text-xs text-sidebar-accent-foreground">
              <Lock className="size-3" /> TLS 1.3
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sidebar-accent px-3 py-1 text-xs text-sidebar-accent-foreground">
              <ShieldEllipsis className="size-3" /> AES-256
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sidebar-accent px-3 py-1 text-xs text-sidebar-accent-foreground">
              <KeyRound className="size-3" /> Doble Factor (2FA)
            </span>
          </div>
        </div>

        <p className="text-xs text-sidebar-foreground/50">
          Uso exclusivo de funcionarios autorizados · Sistema crítico nivel 1
        </p>
      </aside>

      {/* Form side */}
      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <p className="text-sm font-semibold">Control Fronterizo Integrado</p>
          </div>

          {step === 'credenciales' ? (
            <form onSubmit={handleCredenciales} className="space-y-5">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">Iniciar sesión</h1>
                <p className="text-sm text-muted-foreground">
                  Ingrese sus credenciales institucionales.
                </p>
              </div>

              {error ? (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  {error}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  autoComplete="username"
                  placeholder="admin"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  aria-invalid={!!error}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!error}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <Spinner label="Verificando..." /> : 'Continuar'}
              </Button>

              <p className="rounded-md bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
                Demo · usuario <span className="font-mono font-medium">admin</span>{' '}
                · clave <span className="font-mono font-medium">Aduana123</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handle2fa} className="space-y-5">
              <div className="space-y-1">
                <Badge variant="success" className="mb-1">
                  <ShieldCheck className="size-3" /> Credenciales verificadas
                </Badge>
                <h1 className="text-xl font-semibold">Verificación 2FA</h1>
                <p className="text-sm text-muted-foreground">
                  Ingrese el código de 6 dígitos del autenticador. (Demo: cualquier
                  código de 6 dígitos)
                </p>
              </div>

              {error ? (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  {error}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="otp">Código de verificación</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  className="text-center font-mono text-lg tracking-[0.5em]"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  aria-invalid={!!error}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <Spinner label="Validando 2FA..." /> : 'Acceder al sistema'}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
