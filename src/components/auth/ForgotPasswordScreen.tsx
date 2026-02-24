import { useState } from 'react';
import { ChevronLeft, Mail, Moon, Sun, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, digite seu e-mail.');
      return;
    }

    setIsLoading(true);

    // Simular envio de e-mail com delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Instruções enviadas para seu e-mail!');
    setIsSubmitted(true);
    setIsLoading(false);
  };

  const handleBackToLogin = () => {
    setIsSubmitted(false);
    setEmail('');
    onBack();
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

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6 md:p-8 space-y-6">
          {/* Back Button */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center gap-2 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
            disabled={isLoading}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar ao login</span>
          </button>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary dark:bg-white rounded-xl mx-auto flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h1 className="text-2xl text-foreground dark:text-white">Esqueci minha senha</h1>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Digite seu e-mail para receber as instruções de recuperação
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  ) : (
                    'Enviar instruções'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl mx-auto flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl text-foreground dark:text-white">E-mail enviado!</h1>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Enviamos as instruções para <strong className="text-foreground dark:text-white">{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>

                {/* Back to Login Button */}
                <button
                  onClick={handleBackToLogin}
                  className="w-full h-10 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                >
                  Voltar ao login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}