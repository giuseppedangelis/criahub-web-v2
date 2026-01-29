import { ChevronDown } from 'lucide-react';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

/**
 * Componente Select Nativo Padronizado - CriaHub Design System
 * 
 * Este componente fornece um select HTML nativo estilizado de acordo com o design system do CriaHub.
 * 
 * Características:
 * - Bordas arredondadas (rounded-xl)
 * - Ícone ChevronDown customizado
 * - Suporte a dark/light mode
 * - Estilo consistente com bg-[#3a3a3a] no dark mode
 * - Focus ring com transição suave
 * 
 * @example
 * ```tsx
 * <NativeSelect value={value} onChange={(e) => setValue(e.target.value)}>
 *   <option value="1">Opção 1</option>
 *   <option value="2">Opção 2</option>
 * </NativeSelect>
 * ```
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={`w-full h-11 px-4 pr-11 appearance-none bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 transition-all ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground dark:text-white pointer-events-none" />
      </div>
    );
  }
);

NativeSelect.displayName = 'NativeSelect';