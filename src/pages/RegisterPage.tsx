import { useState } from 'react'
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
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import { isPasswordValid } from '@/lib/auth/password-validation'
import { validateEmail } from '@/lib/auth/email-validation'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, digite um email válido.',
        variant: 'destructive',
      })
      return
    }

    if (!isPasswordValid(password)) {
      toast({
        title: 'Senha fraca',
        description: 'A senha não atende aos requisitos mínimos de segurança.',
        variant: 'destructive',
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Senhas não coincidem',
        description: 'A confirmação de senha deve ser igual à senha.',
        variant: 'destructive',
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: 'Aceite os termos',
        description: 'Você precisa aceitar os termos de uso para continuar.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      await signUp(email, password)

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você já pode fazer login com suas credenciais.',
      })

      navigate('/login')
    } catch (error: any) {
      let errorMessage = 'Erro ao criar conta. Tente novamente.'

      if (error.message?.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado. Faça login ou use outro email.'
      }

      toast({
        title: 'Erro ao criar conta',
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
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="new-password"
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
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive">As senhas não coincidem</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                disabled={loading}
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Eu aceito os{' '}
                <Link to="/termos" className="text-primary hover:underline" target="_blank">
                  termos de uso
                </Link>{' '}
                e a{' '}
                <Link to="/privacidade" className="text-primary hover:underline" target="_blank">
                  política de privacidade
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !acceptTerms}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <div className="text-sm text-center w-full text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Fazer login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
