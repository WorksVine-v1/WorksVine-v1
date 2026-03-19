import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Grape, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { useYears } from "../hooks/useYears";

// Formate une date ISO (YYYY-MM-DD) en JJ/MM/AAAA
function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function HomePage() {
  const { years, loading, addYear, deleteYear } = useYears();
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
      <div className="animate-fade-in-up pt-8 pb-6">
        <div className="flex flex-col items-center gap-3 mb-1">
          <div className="relative w-14 h-14 rounded-2xl glass-wine glow-wine flex items-center justify-center">
            <Grape className="w-7 h-7" style={{ color: "var(--gold)" }} />
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
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--gold-light)", letterSpacing: "-0.02em" }}
            >
              WorksVine
            </h1>
            <p className="text-xs" style={{ color: "rgba(201,168,76,0.45)" }}>
              Carnet de vignoble
            </p>
          </div>
        </div>
        <div className="divider-gold mt-5" />
      </div>

      {/* ── Titre section + bouton ── */}
      <div className="flex items-center justify-between mb-4 animate-fade-in-up delay-1">
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
          className="glass-strong rounded-2xl p-4 mb-5 animate-fade-in"
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
              className={`glass-strong rounded-2xl p-4 flex items-center justify-between
                          cursor-pointer card-hover animate-fade-in-up
                          ${i === 0 ? "" : i === 1 ? "delay-1" : i === 2 ? "delay-2" : "delay-3"}`}
              style={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl glass-wine flex items-center justify-center shrink-0 overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, transparent 70%)",
                    }}
                  />
                  <span
                    className="text-base font-bold relative z-10"
                    style={{ color: "var(--gold-light)" }}
                  >
                    {y.year}
                  </span>
                </div>
                <div>
                  {/* <p className="text-base font-semibold text-white mb-0.5">{y.year}</p> */}
                  <div className="flex items-center gap-2">
                    <span className="badge-wine">
                      {y.works?.length ?? 0} travaux
                    </span>
                    <span className="badge-vine">
                      {y.treatments?.length ?? 0} traitements
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleDelete(y.id, e)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ color: "rgba(255,255,255,0.15)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "rgba(220,80,80,0.8)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.15)")
                  }
                >
                  {deleting === y.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
                <ChevronRight
                  className="w-4 h-4"
                  style={{ color: "rgba(201,168,76,0.3)" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <p className="text-xs" style={{ color: "rgba(201,168,76,0.2)" }}>
          ✦ WorksVine ✦
        </p>
      </div>
    </div>
  );
}

// Export de la fonction pour réutilisation dans les autres composants
export { formatDate };
