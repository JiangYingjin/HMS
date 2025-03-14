'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from 'react-toastify';

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('patient' | 'doctor' | 'nurse' | 'admin')[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/session')
        const data = await response.json()

        if (!data.user) {
          toast.error('请先登录')
          router.push('/login')
          return
        }

        if (allowedRoles && !allowedRoles.includes(data.user.Role)) {
          toast.error('没有访问权限')
          router.push('/dashboard')
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        toast.error('认证失败')
        router.push('/login')
      }
    }

    checkAuth()
  }, [allowedRoles, router])

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
} 