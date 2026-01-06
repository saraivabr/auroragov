import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Sistema de Gestão
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Acesse sua conta e gerencie seus recursos
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
