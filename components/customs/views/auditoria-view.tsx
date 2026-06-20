'use client'

import { useMemo, useState } from 'react'
import { Lock, ScrollText } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SectionTitle } from '../shared'
import { useStore, type EstadoLog } from '../store'

function estadoVariant(estado: EstadoLog) {
  switch (estado) {
    case 'Aprobado':
      return 'success' as const
    case 'Rechazado':
      return 'destructive' as const
    case 'Pendiente':
      return 'warning' as const
    default:
      return 'muted' as const
  }
}

export function AuditoriaView() {
  const { logs } = useStore()
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return logs
    return logs.filter(
      (l) =>
        l.operacion.toLowerCase().includes(t) ||
        l.funcionario.toLowerCase().includes(t) ||
        l.estado.toLowerCase().includes(t),
    )
  }, [logs, q])

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Consola Audit Trail"
        description="Registro inmutable de auditoría. Cada acción de usuario queda trazada con marca de tiempo, funcionario, operación y estado."
        rf="RNF10"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="size-4" /> Bitácora de eventos
              </CardTitle>
              <CardDescription>{logs.length} eventos registrados</CardDescription>
            </div>
            <Badge variant="muted">
              <Lock className="size-3" /> Inmutable
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar por operación, funcionario o estado..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-md"
          />
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Timestamp</TableHead>
                  <TableHead>Funcionario</TableHead>
                  <TableHead>Operación</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Sin eventos que coincidan con la búsqueda.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {l.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">
                        {l.funcionario}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {l.operacion}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={estadoVariant(l.estado)}>
                          {l.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
