'use client'

import { useEffect } from 'react';

/**
 * Hook customizado para detectar a tecla ESC
 * Melhora a acessibilidade dos modais (WCAG 2.1)
 * 
 * @param callback - Função a ser executada quando ESC for pressionada
 * @param isActive - Se o listener deve estar ativo (útil para modais condicionais)
 */
export function useEscapeKey(callback: () => void, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Cleanup: remove o listener quando o componente desmonta
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [callback, isActive]);
}
