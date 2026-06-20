'use client'

import { useState } from 'react'
import {
  AlertCircle,
  Car,
  CheckCircle2,
  PlusCircle,
  QrCode,
  ScanLine,
} from 'lucide-react'
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

const empty = {
  patente: '',
  chasis: '',
  marca: '',
  modelo: '',
  pais: 'Chile',
  propietario: '',
}

export function VehiculosView() {
  const { vehiculos, addVehiculo, addLog, currentUser } = useStore()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)

  // RF07 / CP-08
  const [scanLoading, setScanLoading] = useState(false)
  const [scanned, setScanned] = useState(false)

  function set(field: keyof typeof empty, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOk(false)
    // CP-04: validación obligatoria
    const next: Record<string, string> = {}
    if (!form.patente.trim()) next.patente = 'Solicitud de completar campo'
    if (!form.marca.trim()) next.marca = 'Solicitud de completar campo'
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }

    setLoading(true)
    await simulate()
    setLoading(false)
    // CP-03
    addVehiculo({ ...form, patente: form.patente.toUpperCase() })
    addLog(
      `Digitación anticipada de vehículo ${form.patente.toUpperCase()}`,
      'Creado',
      currentUser?.nombre,
    )
    setForm(empty)
    setOk(true)
  }

  // CP-08
  async function simularEscaneo() {
    setScanned(false)
    setScanLoading(true)
    await simulate()
    setScanLoading(false)
    setScanned(true)
    addLog('Validación documental por QR (vehículo)', 'Procesado', currentUser?.nombre)
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Módulo de Vehículos"
        description="Digitación anticipada de patentes, chasis, marca, país y propietario antes del cruce."
        rf="RF02"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="size-4" /> Nuevo vehículo
            </CardTitle>
            <CardDescription>Ingreso previo al tránsito</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patente">
                  Patente <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="patente"
                  placeholder="AB1234"
                  value={form.patente}
                  onChange={(e) => set('patente', e.target.value)}
                  aria-invalid={!!errors.patente}
                />
                {errors.patente ? (
                  <p className="flex items-center gap-1 text-xs font-medium text-destructive">
                    <AlertCircle className="size-3" /> {errors.patente}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="chasis">N° de chasis</Label>
                <Input
                  id="chasis"
                  placeholder="9BWZZZ377VT004251"
                  value={form.chasis}
                  onChange={(e) => set('chasis', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="marca">
                    Marca <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="marca"
                    placeholder="Toyota"
                    value={form.marca}
                    onChange={(e) => set('marca', e.target.value)}
                    aria-invalid={!!errors.marca}
                  />
                  {errors.marca ? (
                    <p className="flex items-center gap-1 text-xs font-medium text-destructive">
                      <AlertCircle className="size-3" /> {errors.marca}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    placeholder="Hilux"
                    value={form.modelo}
                    onChange={(e) => set('modelo', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Select
                    id="pais"
                    value={form.pais}
                    onChange={(e) => set('pais', e.target.value)}
                  >
                    <option>Chile</option>
                    <option>Argentina</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propietario">Propietario</Label>
                  <Input
                    id="propietario"
                    placeholder="Nombre"
                    value={form.propietario}
                    onChange={(e) => set('propietario', e.target.value)}
                  />
                </div>
              </div>

              {ok ? (
                <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success">
                  <CheckCircle2 className="size-4" /> Vehículo registrado con
                  éxito
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Spinner label="Guardando..." />
                ) : (
                  <>
                    <PlusCircle /> Registrar vehículo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="size-4" /> Validación documental (RF07)
              </CardTitle>
              <CardDescription>
                Lectura asíncrona de códigos QR de documentos oficiales
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={simularEscaneo}
                disabled={scanLoading}
              >
                {scanLoading ? (
                  <Spinner label="Escaneando QR..." />
                ) : (
                  <>
                    <ScanLine /> Simular Escaneo QR de Documento Oficial
                  </>
                )}
              </Button>
              {scanned ? (
                <Badge variant="success">
                  <CheckCircle2 className="size-3" /> Documento Validado /
                  Autenticidad Confirmada
                </Badge>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehículos digitados</CardTitle>
              <CardDescription>
                {vehiculos.length} registro(s) en cola de cruce
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patente</TableHead>
                    <TableHead>Marca / Modelo</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Propietario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiculos.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-sm text-muted-foreground"
                      >
                        Sin vehículos digitados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vehiculos.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-mono font-medium">
                          {v.patente}
                        </TableCell>
                        <TableCell>
                          {v.marca}
                          {v.modelo ? ` ${v.modelo}` : ''}
                        </TableCell>
                        <TableCell>
                          <Badge variant="muted">{v.pais}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {v.propietario || '—'}
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
    </div>
  )
}
