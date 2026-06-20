'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Fingerprint,
  Leaf,
  RotateCcw,
  XCircle,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RevisionBadge, SectionTitle, Spinner, simulate } from '../shared'
import { useStore, type EstadoRevision } from '../store'

function RevisionCard({
  titulo,
  descripcion,
  icon: Icon,
  estado,
  onAprobar,
  onRechazar,
  loading,
}: {
  titulo: string
  descripcion: string
  icon: typeof Fingerprint
  estado: EstadoRevision
  onAprobar: () => void
  onRechazar: () => void
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className="size-4" /> {titulo}
          </CardTitle>
          <RevisionBadge estado={estado} />
        </div>
        <CardDescription>{descripcion}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <Spinner label="Evaluando antecedentes..." />
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onAprobar}
              disabled={estado === 'Aprobado'}
            >
              <CheckCircle2 /> Aprobar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onRechazar}
              disabled={estado === 'Rechazado'}
            >
              <XCircle /> Rechazar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function CruceView() {
  const {
    pdiStatus,
    sagStatus,
    setPdiStatus,
    setSagStatus,
    addLog,
    currentUser,
  } = useStore()
  const [pdiLoading, setPdiLoading] = useState(false)
  const [sagLoading, setSagLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [exported, setExported] = useState(false)

  const ambasAprobadas = pdiStatus === 'Aprobado' && sagStatus === 'Aprobado'

  async function revisar(
    modulo: 'PDI' | 'SAG',
    resultado: EstadoRevision,
  ) {
    setExported(false)
    if (modulo === 'PDI') setPdiLoading(true)
    else setSagLoading(true)
    await simulate()
    if (modulo === 'PDI') {
      setPdiLoading(false)
      setPdiStatus(resultado)
    } else {
      setSagLoading(false)
      setSagStatus(resultado)
    }
    addLog(
      `Revisión ${modulo} del tránsito TRX-48201`,
      resultado === 'Aprobado' ? 'Aprobado' : 'Rechazado',
      currentUser?.nombre,
    )
  }

  async function exportar() {
    setExportLoading(true)
    await simulate()
    setExportLoading(false)
    setExported(true)
    addLog('Emisión de Reporte de Salida (PDF/Excel) TRX-48201', 'Procesado', currentUser?.nombre)
  }

  function reset() {
    setPdiStatus('Pendiente')
    setSagStatus('Pendiente')
    setExported(false)
    addLog('Reinicio de evaluación del tránsito TRX-48201', 'Procesado', currentUser?.nombre)
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Control de Cruce Único"
        description="Evaluación paralela e independiente de PDI y SAG sobre un mismo tránsito. Integración limítrofe con la aduana vecina."
        rf="RF03"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Tránsito TRX-48201</CardTitle>
              <CardDescription>
                VW Amarok · Patente GJKL92 · Argentina → Chile
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="muted">Control Único</Badge>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw /> Reiniciar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <RevisionCard
          titulo="Revisión PDI"
          descripcion="Alertas migratorias, arraigos y validación de documentos"
          icon={Fingerprint}
          estado={pdiStatus}
          loading={pdiLoading}
          onAprobar={() => revisar('PDI', 'Aprobado')}
          onRechazar={() => revisar('PDI', 'Rechazado')}
        />
        <RevisionCard
          titulo="Revisión SAG"
          descripcion="Bioseguridad: alimentos, vegetales, productos animales y mascotas"
          icon={Leaf}
          estado={sagStatus}
          loading={sagLoading}
          onAprobar={() => revisar('SAG', 'Aprobado')}
          onRechazar={() => revisar('SAG', 'Rechazado')}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compuerta lógica de salida</CardTitle>
          <CardDescription>
            La emisión solo se habilita cuando ambas revisiones están aprobadas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm">
              PDI: <RevisionBadge estado={pdiStatus} />
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm">
              SAG: <RevisionBadge estado={sagStatus} />
            </span>
          </div>

          {!ambasAprobadas ? (
            <div className="flex items-center gap-2 rounded-md border border-warning/40 bg-warning/15 px-3 py-2 text-sm font-medium text-warning-foreground">
              <AlertTriangle className="size-4 shrink-0" />
              No se puede emitir: se requieren ambas revisiones (PDI y SAG)
              aprobadas. Una revisión rechazada o pendiente bloquea la salida.
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success">
              <CheckCircle2 className="size-4 shrink-0" />
              Ambas revisiones aprobadas. Habilitada la emisión del reporte de
              salida.
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={exportar}
              disabled={!ambasAprobadas || exportLoading}
            >
              {exportLoading ? (
                <Spinner label="Generando documento..." />
              ) : (
                <>
                  <FileSpreadsheet /> Emitir y Exportar Reporte de Salida
                  (PDF/Excel)
                </>
              )}
            </Button>
            {exported ? (
              <Badge variant="success">
                <CheckCircle2 className="size-3" /> Reporte de salida emitido
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
