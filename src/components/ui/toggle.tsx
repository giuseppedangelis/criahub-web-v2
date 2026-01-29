interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${checked 
          ? 'bg-primary dark:bg-white' 
          : 'bg-muted dark:bg-[#3a3a3a]'
        }
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full transition-transform
          ${checked 
            ? 'translate-x-6 bg-white dark:bg-black' 
            : 'translate-x-1 bg-foreground dark:bg-white'
          }
        `}
      />
    </button>
  );
}
