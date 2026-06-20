'use client'

import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { EstadoRevision } from './store'

/** Simula una operación asíncrona (RNF03: 1-2s) y ejecuta el callback. */
export function simulate(ms = 1200) {
  const jitter = 1000 + Math.random() * 1000
  return new Promise<void>((resolve) => setTimeout(resolve, ms || jitter))
}

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label ?? 'Procesando...'}
    </span>
  )
}

export function RevisionBadge({ estado }: { estado: EstadoRevision }) {
  if (estado === 'Aprobado')
    return <Badge variant="success">Aprobado</Badge>
  if (estado === 'Rechazado')
    return <Badge variant="destructive">Rechazado</Badge>
  return <Badge variant="warning">Pendiente</Badge>
}

export function SectionTitle({
  title,
  description,
  rf,
}: {
  title: string
  description: string
  rf?: string
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="max-w-2xl text-pretty text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {rf ? (
        <Badge variant="outline" className="font-mono">
          {rf}
        </Badge>
      ) : null}
    </div>
  )
}
