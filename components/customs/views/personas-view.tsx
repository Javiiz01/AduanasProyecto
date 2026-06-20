'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, UserPlus, UsersRound, XCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SectionTitle, Spinner, simulate } from '../shared'
import { useStore } from '../store'

/** Calcula edad desde fecha DD/MM/YYYY. */
function calcEdad(fecha: string): number | null {
  const m = fecha.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  const [, d, mes, y] = m
  const nac = new Date(Number(y), Number(mes) - 1, Number(d))
  if (Number.isNaN(nac.getTime())) return null
  const hoy = new Date()
  let edad = hoy.getFullYear() - nac.getFullYear()
  const mm = hoy.getMonth() - nac.getMonth()
  if (mm < 0 || (mm === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}

const empty = {
  nombre: '',
  run: '',
  nacimiento: '',
  autorizacion: 'Sí',
  acompanante: '',
}

export function PersonasView() {
  const { personas, addPersona, addLog, currentUser } = useStore()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<
    { type: 'ok' | 'error'; msg: string } | null
  >(null)

  function set(field: keyof typeof empty, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)
    const next: Record<string, string> = {}
    if (!form.nombre.trim()) next.nombre = 'Solicitud de completar campo'
    if (!form.run.trim()) next.run = 'Solicitud de completar campo'
    const edad = calcEdad(form.nacimiento)
    if (edad === null)
      next.nacimiento = 'Ingrese fecha válida (DD/MM/AAAA)'
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }

    setLoading(true)
    await simulate()
    setLoading(false)

    const esMenor = (edad as number) < 18
    const autorizado = form.autorizacion === 'Sí'

    // CP-05 / CP-06: menor sin autorización es rechazado
    if (esMenor && !autorizado) {
      addPersona({
        nombre: form.nombre,
        run: form.run,
        nacimiento: form.nacimiento,
        esMenor,
        autorizacion: false,
        acompanante: form.acompanante,
        estado: 'Rechazado',
      })
      addLog(
        `Registro de menor ${form.nombre} bloqueado (sin autorización)`,
        'Rechazado',
        currentUser?.nombre,
      )
      setFeedback({
        type: 'error',
        msg: 'Registro rechazado por falta de autorización notarial',
      })
      return
    }

    addPersona({
      nombre: form.nombre,
      run: form.run,
      nacimiento: form.nacimiento,
      esMenor,
      autorizacion: autorizado,
      acompanante: form.acompanante,
      estado: 'Aprobado',
    })
    addLog(
      `Registro de persona ${form.nombre}${esMenor ? ' (menor, autorizado)' : ''}`,
      'Aprobado',
      currentUser?.nombre,
    )
    setFeedback({
      type: 'ok',
      msg: esMenor
        ? 'Menor de edad verificado y aprobado con autorización notarial'
        : 'Persona registrada y aprobada',
    })
    setForm(empty)
  }

  const edadPreview = calcEdad(form.nacimiento)

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Módulo de Personas"
        description="Registro de personas y control de menores: verificación de acompañantes y permisos notariales digitales."
        rf="RF01"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersRound className="size-4" /> Registro de persona / menor
            </CardTitle>
            <CardDescription>
              El sistema calcula automáticamente la minoría de edad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nombre"
                  placeholder="Juan Pérez"
                  value={form.nombre}
                  onChange={(e) => set('nombre', e.target.value)}
                  aria-invalid={!!errors.nombre}
                />
                {errors.nombre ? (
                  <p className="flex items-center gap-1 text-xs font-medium text-destructive">
                    <AlertCircle className="size-3" /> {errors.nombre}
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="run">
                    RUN <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="run"
                    placeholder="18.456.789-2"
                    value={form.run}
                    onChange={(e) => set('run', e.target.value)}
                    aria-invalid={!!errors.run}
                  />
                  {errors.run ? (
                    <p className="flex items-center gap-1 text-xs font-medium text-destructive">
                      <AlertCircle className="size-3" /> {errors.run}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nacimiento">
                    Nacimiento <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nacimiento"
                    placeholder="15/08/2010"
                    value={form.nacimiento}
                    onChange={(e) => set('nacimiento', e.target.value)}
                    aria-invalid={!!errors.nacimiento}
                  />
                  {errors.nacimiento ? (
                    <p className="flex items-center gap-1 text-xs font-medium text-destructive">
                      <AlertCircle className="size-3" /> {errors.nacimiento}
                    </p>
                  ) : null}
                </div>
              </div>

              {edadPreview !== null ? (
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs">
                  <span className="text-muted-foreground">Edad calculada:</span>
                  <span className="font-medium">{edadPreview} años</span>
                  {edadPreview < 18 ? (
                    <Badge variant="warning">Menor de edad</Badge>
                  ) : (
                    <Badge variant="muted">Mayor de edad</Badge>
                  )}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="autorizacion">
                  Autorización notarial (menores)
                </Label>
                <Select
                  id="autorizacion"
                  value={form.autorizacion}
                  onChange={(e) => set('autorizacion', e.target.value)}
                >
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="acompanante">Acompañante</Label>
                <Input
                  id="acompanante"
                  placeholder="Nombre del adulto responsable"
                  value={form.acompanante}
                  onChange={(e) => set('acompanante', e.target.value)}
                />
              </div>

              {feedback ? (
                <div
                  role="alert"
                  className={
                    feedback.type === 'ok'
                      ? 'flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success'
                      : 'flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive'
                  }
                >
                  {feedback.type === 'ok' ? (
                    <CheckCircle2 className="size-4 shrink-0" />
                  ) : (
                    <XCircle className="size-4 shrink-0" />
                  )}
                  {feedback.msg}
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Spinner label="Verificando..." />
                ) : (
                  <>
                    <UserPlus /> Registrar persona
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Personas registradas</CardTitle>
            <CardDescription>
              {personas.length} registro(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>RUN</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Sin personas registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  personas.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nombre}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {p.run}
                      </TableCell>
                      <TableCell>
                        {p.esMenor ? (
                          <Badge variant="warning">Menor</Badge>
                        ) : (
                          <Badge variant="muted">Adulto</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {p.estado === 'Aprobado' ? (
                          <Badge variant="success">
                            <CheckCircle2 className="size-3" /> Aprobado
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="size-3" /> Rechazado
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
