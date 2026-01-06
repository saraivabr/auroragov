import { Link } from 'react-router-dom'
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
import { LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'

export function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

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

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
            Sistema de Gestão
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/demo">
              <Button variant="ghost" size="sm">
                Demo
              </Button>
            </Link>
            <Link to="/usuarios">
              <Button variant="ghost" size="sm">
                Usuários
              </Button>
            </Link>
            <Link to="/produtos">
              <Button variant="ghost" size="sm">
                Produtos
              </Button>
            </Link>
            <Link to="/faturas">
              <Button variant="ghost" size="sm">
                Faturas
              </Button>
            </Link>
            <Link to="/logs">
              <Button variant="ghost" size="sm">
                Logs
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
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
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}
