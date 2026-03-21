import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Grape, Trash2, Loader2, LogOut, Search, X } from "lucide-react";
import { useYears } from "../hooks/useYears";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { years, loading, addYear, deleteYear } = useYears();
  const { user, logout } = useAuth();
  const [showInput, setShowInput] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Filtrage en temps réel
  const filtered = useMemo(() => {
    if (!search.trim()) return years;
    return years.filter((y) => String(y.year).includes(search.trim()));
  }, [years, search]);

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
      <div className="animate-fade-in-up pt-2 pb-3">
        {/* Bouton déconnexion en haut à droite */}
        <div className="flex justify-end mb-1">
          <button
            onClick={logout}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ color: "rgba(235,235,165,0.18)" }}
            title="Déconnexion"
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(220,80,80,0.7)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(235,235,165,0.18)")
            }
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Logo centré */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <img
            src="/logo.svg"
            alt="WorksVine"
            className="w-24 h-24"
            style={{ filter: "drop-shadow(0 0 12px rgba(4,101,110,0.3))" }}
          />
          <p className="text-xs" style={{ color: "rgba(235,235,165,0.35)" }}>
            {user?.displayName ?? user?.email ?? "Mon vignoble"}
          </p>
        </div>
        <div className="divider-gold" />
      </div>

      {/* ── Barre de recherche ── */}
      {years.length > 1 && (
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3 animate-fade-in-up delay-1"
          style={{
            background: "rgba(235,235,165,0.04)",
            border: "1px solid rgba(235,235,165,0.09)",
          }}
        >
          <Search
            className="w-4 h-4 shrink-0"
            style={{ color: "rgba(235,235,165,0.25)" }}
          />
          <input
            type="number"
            placeholder="Rechercher une année…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--cream)" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="transition-colors"
              style={{ color: "rgba(235,235,165,0.25)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(235,235,165,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(235,235,165,0.25)")
              }
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* ── Titre section + bouton ── */}
      <div className="flex items-center justify-between mb-3 animate-fade-in-up delay-1">
        <div
          className="ornament-line text-xs font-medium tracking-widest uppercase"
          style={{ color: "rgba(235,235,165,0.4)" }}
        >
          {search
            ? `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}`
            : "Mes années"}
        </div>
        <button
          onClick={() => {
            setShowInput(!showInput);
            setError("");
          }}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center
                     transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            border: "1px solid rgba(4,101,110,0.35)",
            color: "var(--teal-light)",
          }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* ── Formulaire ajout ── */}
      {showInput && (
        <div
          className="glass-strong rounded-2xl p-4 mb-3 animate-fade-in"
          style={{ border: "1px solid rgba(4,101,110,0.25)" }}
        >
          <p
            className="text-xs font-medium mb-3 tracking-wide"
            style={{ color: "rgba(235,235,165,0.5)" }}
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
              style={{ color: "var(--teal-light)" }}
            />
            <p className="text-xs" style={{ color: "rgba(235,235,165,0.3)" }}>
              Chargement…
            </p>
          </div>
        </div>
      ) : filtered.length === 0 && search ? (
        /* ── Aucun résultat de recherche ── */
        <div
          className="glass rounded-2xl p-10 text-center animate-fade-in"
          style={{ border: "1px solid rgba(235,235,165,0.07)" }}
        >
          <Search
            className="w-10 h-10 mx-auto mb-4 animate-pulse-soft"
            style={{ color: "rgba(235,235,165,0.15)" }}
          />
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "rgba(235,235,165,0.3)" }}
          >
            Aucune année trouvée
          </p>
          <button
            onClick={() => setSearch("")}
            className="text-xs mt-2 transition-colors"
            style={{ color: "rgba(4,101,110,0.7)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--teal-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(4,101,110,0.7)")
            }
          >
            Effacer la recherche
          </button>
        </div>
      ) : years.length === 0 ? (
        /* ── Liste vide ── */
        <div
          className="glass rounded-2xl p-10 text-center animate-fade-in"
          style={{ border: "1px solid rgba(235,235,165,0.07)" }}
        >
          <Grape
            className="w-12 h-12 mx-auto mb-4 animate-pulse-soft"
            style={{ color: "rgba(235,235,165,0.15)" }}
          />
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "rgba(235,235,165,0.3)" }}
          >
            Aucune année enregistrée
          </p>
          <p className="text-xs" style={{ color: "rgba(235,235,165,0.18)" }}>
            Appuie sur + pour commencer
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((y, i) => (
            <div
              key={y.id}
              onClick={() => navigate(`/year/${y.id}`)}
              className={`card-hover animate-fade-in-up cursor-pointer
                          ${i === 0 ? "" : i === 1 ? "delay-1" : i === 2 ? "delay-2" : "delay-3"}`}
              style={{ opacity: 0 }}
            >
              <div
                className="rounded-2xl px-5 py-4 flex items-center justify-between"
                style={{
                  background: "rgba(235,235,165,0.03)",
                  border: "1px solid rgba(235,235,165,0.08)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div>
                  <p
                    className="text-3xl font-bold leading-none mb-1.5"
                    style={{ color: "var(--cream)", letterSpacing: "-0.03em" }}
                  >
                    {y.year}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(235,235,165,0.3)" }}
                  >
                    {y.works?.length ?? 0} travaux · {y.treatments?.length ?? 0}{" "}
                    traitements
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(y.id, e)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200"
                  style={{ color: "rgba(235,235,165,0.12)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "rgba(220,80,80,0.7)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(235,235,165,0.12)")
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
        <p className="text-xs" style={{ color: "rgba(235,235,165,0.12)" }}>
          ✦ WorksVine ✦
        </p>
      </div>
    </div>
  );
}
