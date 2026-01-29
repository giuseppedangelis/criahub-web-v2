import { X, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSteps = [
  {
    id: 1,
    title: 'Bem-vindo ao CriaHub!',
    description: 'O sistema completo para gestão do seu haras. Vamos fazer um tour rápido pelas principais funcionalidades.',
    image: '🏇',
  },
  {
    id: 2,
    title: 'Dashboard Principal',
    description: 'Aqui você tem uma visão geral do haras: estatísticas, alertas importantes e ações rápidas.',
    image: '📊',
  },
  {
    id: 3,
    title: 'Gestão do Plantel',
    description: 'Cadastre e gerencie todos os animais, com perfil completo, histórico de saúde e genealogia.',
    image: '🐴',
  },
  {
    id: 4,
    title: 'Controle Reprodutivo',
    description: 'Acompanhe coberturas, gestações e nascimentos com alertas automáticos de prazos.',
    image: '💚',
  },
  {
    id: 5,
    title: 'Financeiro Integrado',
    description: 'Controle receitas e despesas, visualize gráficos e gere relatórios financeiros completos.',
    image: '💰',
  },
  {
    id: 6,
    title: 'Pronto para Começar!',
    description: 'Explore o sistema e aproveite todas as funcionalidades. Estamos aqui para ajudar!',
    image: '🎯',
  },
];

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-2xl w-full p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
        </button>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 mx-1 rounded-full transition-colors ${
                  index <= currentStep
                    ? 'bg-primary dark:bg-white'
                    : 'bg-muted dark:bg-[#3a3a3a]'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] text-center">
            Passo {currentStep + 1} de {tourSteps.length}
          </p>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-6">{step.image}</div>
          <h2 className="text-2xl text-foreground dark:text-white mb-4">
            {step.title}
          </h2>
          <p className="text-muted-foreground dark:text-[#99a1af] text-lg">
            {step.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg transition-colors ${
              currentStep === 0
                ? 'opacity-50 cursor-not-allowed text-muted-foreground dark:text-[#99a1af]'
                : 'text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d]'
            }`}
          >
            Anterior
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
          >
            Pular Tour
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {isLastStep ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Começar
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
