export interface PasswordStrength {
  score: number
  feedback: string
  requirements: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
  }
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }

  const metRequirements = Object.values(requirements).filter(Boolean).length
  let score = 0
  let feedback = ''

  if (metRequirements === 5) {
    score = 100
    feedback = 'Senha muito forte'
  } else if (metRequirements === 4) {
    score = 75
    feedback = 'Senha forte'
  } else if (metRequirements === 3) {
    score = 50
    feedback = 'Senha média'
  } else if (metRequirements === 2) {
    score = 25
    feedback = 'Senha fraca'
  } else {
    score = 10
    feedback = 'Senha muito fraca'
  }

  return {
    score,
    feedback,
    requirements,
  }
}

export function getPasswordRequirements(): string[] {
  return [
    'Mínimo de 8 caracteres',
    'Pelo menos uma letra maiúscula',
    'Pelo menos uma letra minúscula',
    'Pelo menos um número',
    'Pelo menos um caractere especial (!@#$%...)',
  ]
}

export function isPasswordValid(password: string): boolean {
  const { requirements } = validatePasswordStrength(password)
  return Object.values(requirements).every(Boolean)
}
