'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Server,
  TrendingUp,
  Users,
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
import { SectionTitle, Spinner, simulate } from '../shared'
import { useStore } from '../store'

const TRANSITO_SEMANAL = [
  { dia: 'Lun', valor: 1240 },
  { dia: 'Mar', valor: 1390 },
  { dia: 'Mié', valor: 1180 },
  { dia: 'Jue', valor: 1620 },
  { dia: 'Vie', valor: 2340 },
  { dia: 'Sáb', valor: 3120 },
  { dia: 'Dom', valor: 2870 },
]

const maxValor = Math.max(...TRANSITO_SEMANAL.map((d) => d.valor))

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'primary',
}: {
  icon: typeof Users
  label: string
  value: string
  sub: string
  tone?: 'primary' | 'success' | 'warning'
}) {
  const toneMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/12 text-success',
    warning: 'bg-warning/20 text-warning-foreground',
  } as const
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div
          className={`flex size-10 items-center justify-center rounded-lg ${toneMap[tone]}`}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardView() {
  const { addLog } = useStore()
  const [reportLoading, setReportLoading] = useState(false)
  const [reportDone, setReportDone] = useState(false)
  const [autoscale, setAutoscale] = useState(false)

  // CP-10
  async function generarReporte() {
    setReportDone(false)
    setReportLoading(true)
    await simulate()
    setReportLoading(false)
    setReportDone(true)
    addLog('Generación de Reporte Diario de Tránsito (PDF)', 'Procesado')
  }

  // RNF04
  async function simularPico() {
    setAutoscale(true)
    addLog('Auto-escalado activado por pico estival (+180%)', 'Procesado')
    await simulate(2500)
    setAutoscale(false)
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Dashboard de Reportabilidad"
        description="Volúmenes de tránsito, días pico y tiempos promedio del control fronterizo integrado."
        rf="RF10"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={Users}
          label="Tránsitos hoy"
          value="2.871"
          sub="+12,4% vs. ayer"
        />
        <Kpi
          icon={Clock}
          label="Tiempo promedio"
          value="6,2 min"
          sub="Por cruce procesado"
          tone="success"
        />
        <Kpi
          icon={TrendingUp}
          label="Día pico"
          value="Sábado"
          sub="3.120 tránsitos"
          tone="warning"
        />
        <Kpi
          icon={CheckCircle2}
          label="Aprobación"
          value="94,8%"
          sub="Tasa de cruces sin observación"
          tone="success"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Volumen de tránsito semanal</CardTitle>
            <CardDescription>
              Vehículos y personas procesadas por día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-end gap-2 sm:gap-4">
              {TRANSITO_SEMANAL.map((d) => (
                <div
                  key={d.dia}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {d.valor}
                  </span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-primary/85 transition-all"
                      style={{ height: `${(d.valor / maxValor) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{d.dia}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="size-4" />
              Escalabilidad (RNF04)
            </CardTitle>
            <CardDescription>
              Auto-escalado ante demanda estival
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Carga actual</span>
                <span className="font-medium">
                  {autoscale ? '180%' : '64%'}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    autoscale ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: autoscale ? '100%' : '64%' }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Instancias: {autoscale ? '12' : '4'}</span>
                <span>
                  {autoscale ? (
                    <Badge variant="warning">
                      <ArrowUpRight className="size-3" /> Escalando
                    </Badge>
                  ) : (
                    <Badge variant="success">Estable</Badge>
                  )}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={simularPico}
              disabled={autoscale}
            >
              {autoscale ? (
                <Spinner label="Escalando recursos..." />
              ) : (
                'Simular pico estival (+180%)'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4" />
            Reporte diario de tránsito
          </CardTitle>
          <CardDescription>
            Exportación de la actividad consolidada del día (Formato PDF)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button onClick={generarReporte} disabled={reportLoading}>
            {reportLoading ? (
              <Spinner label="Generando reporte..." />
            ) : (
              <>
                <Download /> Generar Reporte Diario de Tránsito
              </>
            )}
          </Button>
          {reportDone ? (
            <Badge variant="success">
              <CheckCircle2 className="size-3" /> Reporte generado exitosamente
            </Badge>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
