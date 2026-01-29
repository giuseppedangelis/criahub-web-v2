'use client'

import { useState } from 'react';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

interface LoginScreenProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ onLogin, onForgotPassword }: LoginScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validação das credenciais usando Supabase
      const success = await login(formData.email, formData.password);

      if (success) {
        toast.success('Login realizado com sucesso!');
        onLogin();
      } else {
        toast.error('Email ou senha inválidos.');
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0d0d0d] p-4 relative">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 md:top-6 right-4 md:right-6 p-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
        aria-label="Alternar tema"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-foreground dark:text-white" />
        ) : (
          <Moon className="w-5 h-5 text-foreground dark:text-white" />
        )}
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6 md:p-8 space-y-6">
          {/* Logo/Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary dark:bg-white rounded-xl mx-auto flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-white dark:bg-[#1a1a1a] rounded-lg" />
            </div>
            <h1 className="text-3xl text-foreground dark:text-white">CriaHub</h1>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Gestão completa de haras
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Digite sua senha"
                  className="w-full h-10 px-4 pr-12 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-primary dark:text-white hover:underline"
                disabled={isLoading}
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="text-center pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
              Use suas credenciais do CriaHub para acessar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}