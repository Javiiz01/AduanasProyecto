'use client'

import { useState } from 'react'
import { CheckCircle2, Dog, Leaf, ShieldCheck } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

function Toggle({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
      <Label htmlFor={id} className="cursor-pointer">
        {label}
      </Label>
      <div className="flex gap-1" role="group" id={id}>
        <Button
          type="button"
          size="xs"
          variant={value ? 'default' : 'outline'}
          onClick={() => onChange(true)}
        >
          Sí
        </Button>
        <Button
          type="button"
          size="xs"
          variant={!value ? 'default' : 'outline'}
          onClick={() => onChange(false)}
        >
          No
        </Button>
      </div>
    </div>
  )
}

export function SanitarioView() {
  const { declaraciones, addDeclaracion, addLog, currentUser } = useStore()
  const [mascota, setMascota] = useState('Ninguna')
  const [alimentos, setAlimentos] = useState(false)
  const [vegetales, setVegetales] = useState(false)
  const [productosAnimales, setProductosAnimales] = useState(false)
  const [declaracionJurada, setDeclaracionJurada] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const [warn, setWarn] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOk(false)
    setWarn('')
    // CP-07: requiere declaración jurada
    if (!declaracionJurada) {
      setWarn('Debe firmar la declaración jurada de bioseguridad para continuar.')
      return
    }
    setLoading(true)
    await simulate()
    setLoading(false)
    addDeclaracion({
      mascota,
      alimentos,
      vegetales,
      productosAnimales,
      declaracionJurada,
      estado: 'Aprobado',
    })
    addLog('Declaración sanitaria SAG aprobada', 'Aprobado', currentUser?.nombre)
    setOk(true)
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Control Sanitario SAG"
        description="Declaración digital de bioseguridad: alimentos, plantas, productos de origen animal y mascotas."
        rf="RF06"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="size-4" /> Declaración de bioseguridad
            </CardTitle>
            <CardDescription>
              Servicio Agrícola y Ganadero (SAG)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mascota" className="gap-1.5">
                  <Dog className="size-4" /> Mascota que transporta
                </Label>
                <Select
                  id="mascota"
                  value={mascota}
                  onChange={(e) => setMascota(e.target.value)}
                >
                  <option>Ninguna</option>
                  <option>Perro</option>
                  <option>Gato</option>
                  <option>Ave</option>
                  <option>Otra</option>
                </Select>
              </div>

              <Toggle
                id="alimentos"
                label="Transporta alimentos"
                value={alimentos}
                onChange={setAlimentos}
              />
              <Toggle
                id="vegetales"
                label="Productos vegetales"
                value={vegetales}
                onChange={setVegetales}
              />
              <Toggle
                id="productosAnimales"
                label="Productos de origen animal"
                value={productosAnimales}
                onChange={setProductosAnimales}
              />
              <Toggle
                id="declaracionJurada"
                label="Firma declaración jurada"
                value={declaracionJurada}
                onChange={setDeclaracionJurada}
              />

              {warn ? (
                <p
                  role="alert"
                  className="rounded-md border border-warning/40 bg-warning/15 px-3 py-2 text-sm font-medium text-warning-foreground"
                >
                  {warn}
                </p>
              ) : null}
              {ok ? (
                <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success">
                  <CheckCircle2 className="size-4" /> Declaración sanitaria
                  almacenada y aprobada
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Spinner label="Validando declaración..." />
                ) : (
                  <>
                    <ShieldCheck /> Enviar declaración sanitaria
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Declaraciones registradas</CardTitle>
            <CardDescription>{declaraciones.length} declaración(es)</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mascota</TableHead>
                  <TableHead>Alimentos</TableHead>
                  <TableHead>Vegetales</TableHead>
                  <TableHead>P. Animal</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {declaraciones.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Sin declaraciones sanitarias.
                    </TableCell>
                  </TableRow>
                ) : (
                  declaraciones.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.mascota}</TableCell>
                      <TableCell>{d.alimentos ? 'Sí' : 'No'}</TableCell>
                      <TableCell>{d.vegetales ? 'Sí' : 'No'}</TableCell>
                      <TableCell>{d.productosAnimales ? 'Sí' : 'No'}</TableCell>
                      <TableCell>
                        <Badge variant="success">
                          <CheckCircle2 className="size-3" /> Aprobado
                        </Badge>
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
