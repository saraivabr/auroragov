import { validatePasswordStrength } from '@/lib/auth/password-validation'
import { Progress } from '@/components/ui/progress'
import { Check, X } from 'lucide-react'

interface PasswordStrengthMeterProps {
  password: string
  showRequirements?: boolean
}

export function PasswordStrengthMeter({ password, showRequirements = true }: PasswordStrengthMeterProps) {
  if (!password) return null

  const { score, feedback, requirements } = validatePasswordStrength(password)

  const getColorClass = () => {
    if (score >= 75) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    if (score >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const requirementsList = [
    { key: 'minLength', label: 'Mínimo de 8 caracteres' },
    { key: 'hasUppercase', label: 'Letra maiúscula' },
    { key: 'hasLowercase', label: 'Letra minúscula' },
    { key: 'hasNumber', label: 'Número' },
    { key: 'hasSpecialChar', label: 'Caractere especial' },
  ]

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <Progress value={score} className="flex-1" indicatorClassName={getColorClass()} />
        <span className="text-xs font-medium text-muted-foreground min-w-[100px]">{feedback}</span>
      </div>

      {showRequirements && (
        <div className="space-y-1">
          {requirementsList.map((req) => {
            const met = requirements[req.key as keyof typeof requirements]
            return (
              <div key={req.key} className="flex items-center gap-2 text-xs">
                {met ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <X className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={met ? 'text-green-600' : 'text-muted-foreground'}>
                  {req.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
