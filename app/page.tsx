'use client'

import { CustomsApp } from '@/components/customs/customs-app'
import { LoginScreen } from '@/components/customs/login-screen'
import { StoreProvider, useStore } from '@/components/customs/store'

function Gate() {
  const { currentUser } = useStore()
  return currentUser ? <CustomsApp /> : <LoginScreen />
}

export default function Page() {
  return (
    <StoreProvider>
      <Gate />
    </StoreProvider>
  )
}
