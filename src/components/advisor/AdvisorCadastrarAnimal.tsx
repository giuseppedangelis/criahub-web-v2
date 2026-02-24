'use client'

import { BreederCadastrarAnimal } from '../breeder/BreederCadastrarAnimal'

interface AdvisorCadastrarAnimalProps {
  onBack: () => void
}

export function AdvisorCadastrarAnimal({ onBack }: AdvisorCadastrarAnimalProps) {
  return <BreederCadastrarAnimal onBack={onBack} />
}
