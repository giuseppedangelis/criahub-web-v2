export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value)
  return digits.length === 10 || digits.length === 11
}

export function validatePasswordStrength(password: string): string[] {
  const errors: string[] = []
  if (password.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres.')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos 1 letra minúscula.')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos 1 letra maiúscula.')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos 1 número.')
  }
  if (!/[^\w\s]/.test(password)) {
    errors.push('A senha deve conter pelo menos 1 caractere especial.')
  }
  return errors
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return false
  if (/^(\d)\1+$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i += 1) {
    sum += Number(cpf[i]) * (10 - i)
  }
  let firstCheck = (sum * 10) % 11
  if (firstCheck === 10) firstCheck = 0
  if (firstCheck !== Number(cpf[9])) return false

  sum = 0
  for (let i = 0; i < 10; i += 1) {
    sum += Number(cpf[i]) * (11 - i)
  }
  let secondCheck = (sum * 10) % 11
  if (secondCheck === 10) secondCheck = 0
  return secondCheck === Number(cpf[10])
}
