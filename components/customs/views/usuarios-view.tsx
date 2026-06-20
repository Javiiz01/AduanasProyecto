'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, ShieldCheck, UserCog, UserPlus } from 'lucide-react'
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
import { useStore, type Rol } from '../store'

const ROLES: Rol[] = ['Administrador', 'Aduana', 'PDI', 'SAG']

const empty = { nombre: '', email: '', rol: 'Aduana' as Rol }

function rolVariant(rol: Rol) {
  switch (rol) {
    case 'Administrador':
      return 'default' as const
    case 'PDI':
      return 'warning' as const
    case 'SAG':
      return 'success' as const
    default:
      return 'muted' as const
  }
}

export function UsuariosView() {
  const { funcionarios, addFuncionario, toggleFuncionario, addLog, currentUser } =
    useStore()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)

  function set(field: keyof typeof empty, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOk(false)
    const next: Record<string, string> = {}
    if (!form.nombre.trim()) next.nombre = 'Solicitud de completar campo'
    if (!form.email.trim()) next.email = 'Solicitud de completar campo'
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setLoading(true)
    await simulate()
    setLoading(false)
    addFuncionario({ ...form, activo: true })
    addLog(
      `Alta de funcionario ${form.nombre} (rol ${form.rol})`,
      'Creado',
      currentUser?.nombre,
    )
    setForm(empty)
    setOk(true)
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Administración de Usuarios"
        description="Control de acceso basado en roles (RBAC): alta, baja y cambio de roles de funcionarios."
        rf="RF09"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-4" /> Nuevo funcionario
            </CardTitle>
            <CardDescription>Asignación de rol institucional</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nombre"
                  placeholder="Nombre y apellido"
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
              <div className="space-y-2">
                <Label htmlFor="email">
                  Correo institucional <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="funcionario@aduana.gob.cl"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email ? (
                  <p className="flex items-center gap-1 text-xs font-medium text-destructive">
                    <AlertCircle className="size-3" /> {errors.email}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol asignado</Label>
                <Select
                  id="rol"
                  value={form.rol}
                  onChange={(e) => set('rol', e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </div>

              {ok ? (
                <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success">
                  <CheckCircle2 className="size-4" /> Funcionario agregado al
                  panel de identidades
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Spinner label="Creando cuenta..." />
                ) : (
                  <>
                    <ShieldCheck /> Crear funcionario
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="size-4" /> Panel de identidades
            </CardTitle>
            <CardDescription>
              {funcionarios.filter((f) => f.activo).length} activos de{' '}
              {funcionarios.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcionarios.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <div className="leading-tight">
                        <p className="font-medium">{f.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {f.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rolVariant(f.rol)}>{f.rol}</Badge>
                    </TableCell>
                    <TableCell>
                      {f.activo ? (
                        <Badge variant="success">Activo</Badge>
                      ) : (
                        <Badge variant="muted">Inactivo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          toggleFuncionario(f.id)
                          addLog(
                            `Cambio de estado de ${f.nombre} a ${
                              f.activo ? 'Inactivo' : 'Activo'
                            }`,
                            'Procesado',
                            currentUser?.nombre,
                          )
                        }}
                      >
                        {f.activo ? 'Dar de baja' : 'Activar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
