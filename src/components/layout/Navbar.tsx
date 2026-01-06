import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { GovBrHeader } from './GovBrHeader'

export function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: 'Logout realizado',
        description: 'Você saiu da sua conta com sucesso.',
      })
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Erro ao sair',
        description: 'Não foi possível fazer logout. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const getUserInitials = () => {
    if (!user?.email) return 'U'
    return user.email[0].toUpperCase()
  }

  const getUserDisplayName = () => {
    if (!user?.email) return 'Usuário'
    return user.email.split('@')[0]
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <GovBrHeader />

      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-1">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium ${
                    isActive('/') ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Início
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium ${
                    isActive('/demo') ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Demo
                </Button>
              </Link>
              <Link to="/usuarios">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium ${
                    isActive('/usuarios') ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Usuários
                </Button>
              </Link>
              <Link to="/produtos">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium ${
                    isActive('/produtos') ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Produtos
                </Button>
              </Link>
              <Link to="/faturas">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium ${
                    isActive('/faturas') ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Faturas
                </Button>
              </Link>
              <Link to="/logs">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium ${
                    isActive('/logs') ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Logs de Auditoria
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 px-3 gap-2" size="sm">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700">{getUserDisplayName()}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/perfil')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair do Sistema</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
