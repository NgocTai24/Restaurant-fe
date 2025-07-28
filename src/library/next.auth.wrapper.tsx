// src/app/next.auth.wrapper.tsx
'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface NextAuthWrapperProps {
  children: ReactNode
}

const NextAuthWrapper = ({ children }: NextAuthWrapperProps) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default NextAuthWrapper
