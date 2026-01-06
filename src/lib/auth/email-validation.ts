export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function getEmailError(email: string): string | null {
  if (!email) {
    return 'Email é obrigatório'
  }
  if (!validateEmail(email)) {
    return 'Email inválido'
  }
  return null
}
