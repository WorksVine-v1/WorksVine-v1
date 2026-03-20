import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Grape, Trash2, Loader2, LogOut } from "lucide-react";
import { useYears } from "../hooks/useYears";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { years, loading, addYear, deleteYear } = useYears();
  const { user, logout } = useAuth();
  const [showInput, setShowInput] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAdd = async () => {
    const yearNum = parseInt(newYear);
    if (!newYear || isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      setError("Saisis une année valide (ex: 2025)");
      return;
    }
    const result = await addYear(yearNum);
    if (result.error) {
      setError(result.error);
      return;
    }
    setNewYear("");
    setShowInput(false);
    setError("");
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Supprimer cette année et toutes ses données ?")) return;
    setDeleting(id);
    await deleteYear(id);
    setDeleting(null);
  };

  return (
    <div className="min-h-screen p-4 pb-10 max-w-md mx-auto">
      {/* ── Header ── */}
      <div className="animate-fade-in-up pt-5 pb-4">
        {/* Logo + titre + bouton déco sur une ligne */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl glass-wine glow-wine flex items-center justify-center shrink-0">
              <Grape className="w-5 h-5" style={{ color: "var(--gold)" }} />
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 60%)",
                }}
              />
            </div>
            <div>
              <h1
                className="text-lg font-bold leading-none"
                style={{ color: "var(--gold-light)", letterSpacing: "-0.02em" }}
              >
                WorksVine
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: "rgba(201,168,76,0.4)" }}
              >
                {user?.displayName ?? user?.email ?? "Mon vignoble"}
              </p>
            </div>
          </div>

          {/* Bouton déconnexion — juste l'icône */}
          <button
            onClick={logout}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ color: "rgba(255,255,255,0.18)" }}
            title="Déconnexion"
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(220,80,80,0.7)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.18)")
            }
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divider-gold" />
      </div>

      {/* ── Titre section + bouton ── */}
      <div className="flex items-center justify-between mb-3 animate-fade-in-up delay-1">
        <div
          className="ornament-line text-xs font-medium tracking-widest uppercase"
          style={{ color: "rgba(201,168,76,0.5)" }}
        >
          Mes années
        </div>
        <button
          onClick={() => {
            setShowInput(!showInput);
            setError("");
          }}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center
                     transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            border: "1px solid rgba(201,168,76,0.2)",
            color: "var(--gold)",
          }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* ── Formulaire ajout ── */}
      {showInput && (
        <div
          className="glass-strong rounded-2xl p-4 mb-3 animate-fade-in"
          style={{ border: "1px solid rgba(201,168,76,0.15)" }}
        >
          <p
            className="text-xs font-medium mb-3 tracking-wide"
            style={{ color: "rgba(201,168,76,0.6)" }}
          >
            ✦ Nouvelle année
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="2025"
              value={newYear}
              onChange={(e) => {
                setNewYear(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm input-dark"
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="px-5 py-2.5 rounded-xl text-sm font-medium btn-gold"
            >
              Ajouter
            </button>
          </div>
          {error && (
            <p
              className="text-xs mt-2"
              style={{ color: "rgba(232,100,100,0.8)" }}
            >
              {error}
            </p>
          )}
        </div>
      )}

      {/* ── Liste des années ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: "var(--gold)" }}
            />
            <p className="text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>
              Chargement…
            </p>
          </div>
        </div>
      ) : years.length === 0 ? (
        <div
          className="glass rounded-2xl p-10 text-center animate-fade-in"
          style={{ border: "1px solid rgba(201,168,76,0.08)" }}
        >
          <Grape
            className="w-12 h-12 mx-auto mb-4 animate-pulse-soft"
            style={{ color: "rgba(201,168,76,0.2)" }}
          />
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Aucune année enregistrée
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Appuie sur + pour commencer
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {years.map((y, i) => (
            <div
              key={y.id}
              onClick={() => navigate(`/year/${y.id}`)}
              className={`card-hover animate-fade-in-up cursor-pointer
                          ${i === 0 ? "" : i === 1 ? "delay-1" : i === 2 ? "delay-2" : "delay-3"}`}
              style={{ opacity: 0 }}
            >
              {/* Carte minimaliste */}
              <div
                className="rounded-2xl px-5 py-4 flex items-center justify-between"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Année en grand + stats en petit */}
                <div>
                  <p
                    className="text-3xl font-bold leading-none mb-1.5"
                    style={{
                      color: "var(--gold-light)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {y.year}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {y.works?.length ?? 0} travaux · {y.treatments?.length ?? 0}{" "}
                    traitements
                  </p>
                </div>

                {/* Bouton supprimer */}
                <button
                  onClick={(e) => handleDelete(y.id, e)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200"
                  style={{ color: "rgba(255,255,255,0.12)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "rgba(220,80,80,0.7)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.12)")
                  }
                >
                  {deleting === y.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs" style={{ color: "rgba(201,168,76,0.15)" }}>
          ✦ WorksVine ✦
        </p>
      </div>
    </div>
  );
}
