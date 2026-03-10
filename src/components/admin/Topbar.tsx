import { Bell, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useTheme } from '../../contexts/ThemeContext';

export function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const controlClass =
    theme === 'dark'
      ? 'text-gray-400 hover:text-white hover:bg-[#333333]'
      : 'rounded-xl text-foreground hover:text-foreground hover:bg-accent';

  return (
    <header className={`border-b px-12 py-6 flex items-center justify-between transition-colors ${
      theme === 'dark' 
        ? 'bg-[#1a1a1a] border-[#333333]' 
        : 'bg-card border-border'
    }`}>
      {/* Saudação */}
      <div className="flex flex-col">
        <h1 className={theme === 'dark' ? 'text-white' : 'text-foreground'}>
          Olá, Rick!
        </h1>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
          Bem-vindo de volta ao seu haras
        </p>
      </div>

      {/* Ações à direita */}
      <div className="flex items-center gap-4">
        {/* Toggle Dark/Light Mode */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className={controlClass}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* Notificações */}
        <Button
          variant="ghost"
          size="icon"
          className={`relative ${controlClass}`}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* Avatar do Usuário */}
        <Avatar className="w-9 h-9 cursor-pointer">
          <AvatarFallback className={
            theme === 'dark' 
              ? 'bg-[#333333] text-white' 
              : 'bg-primary text-primary-foreground'
          }>
            RH
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
