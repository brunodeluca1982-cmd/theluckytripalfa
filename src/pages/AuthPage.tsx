import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { toast } from "sonner";
import logoSymbol from "@/assets/brand/logo-l-correct.png";

type AuthMode = "signup" | "login";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resumePendingAction } = useAuthRedirect();

  // Listen for auth state changes to handle post-auth redirect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Small delay to let subscription context refresh
        setTimeout(() => {
          const resumed = resumePendingAction();
          if (!resumed) {
            navigate("/", { replace: true });
          }
        }, 300);
      }
    });
    return () => subscription.unsubscribe();
  }, [resumePendingAction, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !termsAccepted) {
      toast.error("Aceite os termos para continuar");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Verifique seu e-mail para confirmar o cadastro");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // onAuthStateChange will handle redirect
      }
    } catch (err: any) {
      toast.error(err.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    try {
      const { error } = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast.error("Erro ao conectar com " + provider);
      }
    } catch {
      toast.error("Erro ao iniciar login social");
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,20%,12%)] via-[hsl(30,15%,10%)] to-[hsl(30,10%,8%)]" />

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-10 pb-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 self-start"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logoSymbol}
            alt="The Lucky Trip"
            className="h-10 w-auto brightness-0 invert opacity-80"
          />
        </div>

        {/* Header */}
        <div className="flex justify-center mb-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-semibold border border-primary/30 rounded-full px-4 py-1.5">
            {mode === "signup" ? "Crie sua conta" : "Entrar"}
          </span>
        </div>

        <h1 className="text-2xl font-serif font-semibold text-white text-center leading-tight mb-8">
          {mode === "signup"
            ? "Comece a planejar suas viagens dos sonhos"
            : "Bem-vindo de volta"}
        </h1>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4 w-full max-w-sm mx-auto">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          )}

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-primary/50 transition-colors pr-12"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {mode === "signup" && (
            <label className="flex items-start gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <span className="text-xs text-white/50 leading-relaxed">
                Concordo com os{" "}
                <span className="text-primary underline">Termos de Uso</span> e{" "}
                <span className="text-primary underline">Política de Privacidade</span>
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading
              ? "Carregando..."
              : mode === "signup"
              ? "Criar conta"
              : "Entrar"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-sm mx-auto my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] text-white/30">ou continue com</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Social buttons */}
        <div className="flex gap-3 w-full max-w-sm mx-auto">
          <button
            onClick={() => handleOAuth("google")}
            className="flex-1 py-3 rounded-full bg-white/10 border border-white/15 text-white text-sm font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <button
            onClick={() => handleOAuth("apple")}
            className="flex-1 py-3 rounded-full bg-white/10 border border-white/15 text-white text-sm font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Apple
          </button>
        </div>

        {/* Toggle */}
        <p className="text-center text-sm text-white/40 mt-8">
          {mode === "signup" ? "Já tem uma conta? " : "Não tem uma conta? "}
          <button
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="text-primary underline font-medium"
          >
            {mode === "signup" ? "Entrar" : "Criar conta"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
