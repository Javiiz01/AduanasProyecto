'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Rol = 'Administrador' | 'Aduana' | 'PDI' | 'SAG'
export type EstadoLog = 'Aprobado' | 'Rechazado' | 'Creado' | 'Procesado' | 'Pendiente'

export type AuditLog = {
  id: string
  timestamp: string
  funcionario: string
  operacion: string
  estado: EstadoLog
}

export type Vehiculo = {
  id: string
  patente: string
  chasis: string
  marca: string
  modelo: string
  pais: string
  propietario: string
}

export type Persona = {
  id: string
  nombre: string
  run: string
  nacimiento: string
  esMenor: boolean
  autorizacion: boolean
  acompanante: string
  estado: 'Aprobado' | 'Rechazado'
}

export type DeclaracionSag = {
  id: string
  mascota: string
  alimentos: boolean
  vegetales: boolean
  productosAnimales: boolean
  declaracionJurada: boolean
  estado: 'Aprobado' | 'Rechazado'
}

export type Funcionario = {
  id: string
  nombre: string
  email: string
  rol: Rol
  activo: boolean
}

export type EstadoRevision = 'Pendiente' | 'Aprobado' | 'Rechazado'

type Store = {
  // auth
  currentUser: Funcionario | null
  login: (user: Funcionario) => void
  logout: () => void
  // audit
  logs: AuditLog[]
  addLog: (operacion: string, estado: EstadoLog, funcionario?: string) => void
  // data
  vehiculos: Vehiculo[]
  addVehiculo: (v: Omit<Vehiculo, 'id'>) => void
  personas: Persona[]
  addPersona: (p: Omit<Persona, 'id'>) => void
  declaraciones: DeclaracionSag[]
  addDeclaracion: (d: Omit<DeclaracionSag, 'id'>) => void
  funcionarios: Funcionario[]
  addFuncionario: (f: Omit<Funcionario, 'id'>) => void
  toggleFuncionario: (id: string) => void
  // crossing control
  pdiStatus: EstadoRevision
  sagStatus: EstadoRevision
  setPdiStatus: (s: EstadoRevision) => void
  setSagStatus: (s: EstadoRevision) => void
}

const StoreContext = createContext<Store | null>(null)

const uid = () => Math.random().toString(36).slice(2, 9)

function nowStamp() {
  return new Date().toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const seedFuncionarios: Funcionario[] = [
  {
    id: 'u1',
    nombre: 'Carolina Reyes',
    email: 'creyes@aduana.gob.cl',
    rol: 'Administrador',
    activo: true,
  },
  {
    id: 'u2',
    nombre: 'Miguel Fuentes',
    email: 'mfuentes@pdi.gob.cl',
    rol: 'PDI',
    activo: true,
  },
  {
    id: 'u3',
    nombre: 'Andrea Soto',
    email: 'asoto@sag.gob.cl',
    rol: 'SAG',
    activo: true,
  },
  {
    id: 'u4',
    nombre: 'Jorge Lillo',
    email: 'jlillo@aduana.gob.cl',
    rol: 'Aduana',
    activo: false,
  },
]

const seedLogs: AuditLog[] = [
  {
    id: uid(),
    timestamp: '19/06/2026 08:14:02',
    funcionario: 'Sistema',
    operacion: 'Inicialización del nodo Paso Los Libertadores',
    estado: 'Creado',
  },
  {
    id: uid(),
    timestamp: '19/06/2026 08:15:31',
    funcionario: 'Carolina Reyes',
    operacion: 'Sincronización Control Único con Aduana AR',
    estado: 'Procesado',
  },
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Funcionario | null>(null)
  const [logs, setLogs] = useState<AuditLog[]>(seedLogs)
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([
    {
      id: uid(),
      patente: 'GJKL92',
      chasis: '9BWZZZ377VT004251',
      marca: 'Volkswagen',
      modelo: 'Amarok',
      pais: 'Argentina',
      propietario: 'Ramiro Aguilar',
    },
  ])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [declaraciones, setDeclaraciones] = useState<DeclaracionSag[]>([])
  const [funcionarios, setFuncionarios] =
    useState<Funcionario[]>(seedFuncionarios)
  const [pdiStatus, setPdiStatus] = useState<EstadoRevision>('Pendiente')
  const [sagStatus, setSagStatus] = useState<EstadoRevision>('Pendiente')

  const addLog = useCallback(
    (operacion: string, estado: EstadoLog, funcionario?: string) => {
      setLogs((prev) => [
        {
          id: uid(),
          timestamp: nowStamp(),
          funcionario: funcionario ?? 'Sistema',
          operacion,
          estado,
        },
        ...prev,
      ])
    },
    [],
  )

  const login = useCallback((user: Funcionario) => setCurrentUser(user), [])
  const logout = useCallback(() => setCurrentUser(null), [])

  const addVehiculo = useCallback((v: Omit<Vehiculo, 'id'>) => {
    setVehiculos((prev) => [{ id: uid(), ...v }, ...prev])
  }, [])
  const addPersona = useCallback((p: Omit<Persona, 'id'>) => {
    setPersonas((prev) => [{ id: uid(), ...p }, ...prev])
  }, [])
  const addDeclaracion = useCallback((d: Omit<DeclaracionSag, 'id'>) => {
    setDeclaraciones((prev) => [{ id: uid(), ...d }, ...prev])
  }, [])
  const addFuncionario = useCallback((f: Omit<Funcionario, 'id'>) => {
    setFuncionarios((prev) => [...prev, { id: uid(), ...f }])
  }, [])
  const toggleFuncionario = useCallback((id: string) => {
    setFuncionarios((prev) =>
      prev.map((f) => (f.id === id ? { ...f, activo: !f.activo } : f)),
    )
  }, [])

  const value = useMemo<Store>(
    () => ({
      currentUser,
      login,
      logout,
      logs,
      addLog,
      vehiculos,
      addVehiculo,
      personas,
      addPersona,
      declaraciones,
      addDeclaracion,
      funcionarios,
      addFuncionario,
      toggleFuncionario,
      pdiStatus,
      sagStatus,
      setPdiStatus,
      setSagStatus,
    }),
    [
      currentUser,
      login,
      logout,
      logs,
      addLog,
      vehiculos,
      addVehiculo,
      personas,
      addPersona,
      declaraciones,
      addDeclaracion,
      funcionarios,
      addFuncionario,
      toggleFuncionario,
      pdiStatus,
      sagStatus,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}
