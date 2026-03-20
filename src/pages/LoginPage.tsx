import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Grape, Loader2, Mail, Lock, Eye, EyeOff, Chrome } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { user, loading, loginWithGoogle, loginWithEmail, registerWithEmail } =
    useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Si déjà connecté → redirige vers l'accueil
  if (!loading && user) return <Navigate to="/" replace />;

  const handleEmailSubmit = async () => {
    if (!email || !password) {
      setError("Remplis tous les champs");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Email ou mot de passe incorrect");
      } else if (code === "auth/email-already-in-use") {
        setError("Cet email est déjà utilisé");
      } else if (code === "auth/invalid-email") {
        setError("Email invalide");
      } else {
        setError("Une erreur est survenue, réessaie");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
    } catch {
      setError("Connexion Google annulée ou échouée");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "var(--gold)" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* ── Logo ── */}
      <div className="flex flex-col items-center gap-3 mb-8 animate-fade-in-up">
        <div className="relative w-16 h-16 rounded-2xl glass-wine glow-wine flex items-center justify-center">
          <Grape className="w-8 h-8" style={{ color: "var(--gold)" }} />
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 60%)",
            }}
          />
        </div>
        <div className="text-center">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--gold-light)", letterSpacing: "-0.02em" }}
          >
            WorksVine
          </h1>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(201,168,76,0.45)" }}
          >
            Carnet de vignoble
          </p>
        </div>
      </div>

      {/* ── Carte de connexion ── */}
      <div
        className="w-full max-w-sm rounded-3xl p-6 animate-fade-in-up delay-1"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(201,168,76,0.15)",
        }}
      >
        {/* Titre mode */}
        <h2
          className="text-base font-semibold text-center mb-5"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h2>

        {/* ── Bouton Google ── */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 rounded-2xl py-3 mb-4
                     transition-all duration-200 hover:scale-[1.02] active:scale-100"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.85)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.13)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          }}
        >
          <Chrome className="w-4 h-4" />
          <span className="text-sm font-medium">Continuer avec Google</span>
        </button>

        {/* Séparateur */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            ou
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* ── Formulaire email ── */}
        <div className="flex flex-col gap-3">
          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "rgba(255,255,255,0.25)" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm input-dark"
            />
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "rgba(255,255,255,0.25)" }}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
              className="w-full rounded-xl pl-10 pr-10 py-2.5 text-sm input-dark"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "rgba(255,255,255,0.25)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(201,168,76,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
              }
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Message d'erreur */}
          {error && (
            <p
              className="text-xs px-1 animate-fade-in"
              style={{ color: "rgba(232,100,100,0.9)" }}
            >
              {error}
            </p>
          )}

          {/* Bouton submit */}
          <button
            onClick={handleEmailSubmit}
            disabled={submitting}
            className="w-full rounded-xl py-2.5 text-sm font-medium
                       btn-gold disabled:opacity-40 transition-all duration-200
                       hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2 mt-1"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Se connecter" : "Créer le compte"}
          </button>
        </div>

        {/* ── Basculer login / register ── */}
        <div className="text-center mt-5">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          </span>
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="text-xs font-medium transition-colors"
            style={{ color: "var(--gold)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--gold-light)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--gold)")}
          >
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </button>
        </div>
      </div>

      {/* Pied de page */}
      <p
        className="text-xs mt-8 animate-fade-in-up delay-2"
        style={{ color: "rgba(201,168,76,0.15)" }}
      >
        ✦ WorksVine ✦
      </p>
    </div>
  );
}
