import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { isRateLimited, incrementAttempts, resetAttempts, getRemainingAttempts } from '@/lib/auth/rate-limiting'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const rateLimit = isRateLimited()
    if (rateLimit.limited) {
      setRateLimitError(
        `Muitas tentativas falhadas. Tente novamente em ${rateLimit.remainingTime} minutos.`
      )
      return
    }

    setLoading(true)
    setRateLimitError(null)

    try {
      await signIn(email, password)

      if (rememberMe) {
        localStorage.setItem('remembered_email', email)
      } else {
        localStorage.removeItem('remembered_email')
      }

      resetAttempts()

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo de volta.',
      })

      navigate('/')
    } catch (error: any) {
      incrementAttempts()
      const remaining = getRemainingAttempts()

      let errorMessage = 'Email ou senha incorretos'
      if (remaining > 0 && remaining <= 3) {
        errorMessage += `. ${remaining} tentativa${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.`
      }

      toast({
        title: 'Erro ao fazer login',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
          <CardDescription>
            Digite seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rateLimitError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{rateLimitError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  to="/esqueci-senha"
                  className="text-sm text-primary hover:underline"
                  tabIndex={-1}
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={loading}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Lembrar-me neste dispositivo
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <div className="text-sm text-center w-full text-muted-foreground">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-primary font-medium hover:underline">
              Criar conta
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
