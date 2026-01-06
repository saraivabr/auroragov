import { ReactNode } from 'react'
import { GovBrHeader } from '@/components/layout/GovBrHeader'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GovBrHeader />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Sistema de Gestão
            </h1>
            <p className="text-sm text-gray-600">
              Acesse sua conta e gerencie seus recursos
            </p>
          </div>
          {children}
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center text-xs text-gray-600">
            <p className="mb-1">
              © {new Date().getFullYear()} Governo Federal - Todos os direitos reservados
            </p>
            <p className="text-gray-500">
              Desenvolvido com tecnologia nacional
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
