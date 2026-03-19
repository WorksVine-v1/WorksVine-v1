import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Grape, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { useYears } from "../hooks/useYears";

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
      setError("Saisis une année valide (ex: 2024)");
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
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pt-4">
        <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center">
          <Grape className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">WorksVine</h1>
          <p className="text-xs text-white/40">Mon vignoble</p>
        </div>
      </div>

      {/* Titre section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider">
          Mes années
        </h2>
        <button
          onClick={() => {
            setShowInput(!showInput);
            setError("");
          }}
          className="w-8 h-8 rounded-lg glass flex items-center justify-center
                     text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Formulaire ajout année */}
      {showInput && (
        <div className="glass-strong rounded-2xl p-4 mb-4">
          <p className="text-white/60 text-sm mb-3">Nouvelle année</p>
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
              className="flex-1 bg-white/10 border border-white/20 rounded-xl
                         px-4 py-2.5 text-white placeholder-white/30
                         focus:outline-none focus:border-purple-400/50 text-sm"
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2.5 bg-purple-500/30 hover:bg-purple-500/50
                         border border-purple-400/30 rounded-xl text-purple-300
                         text-sm font-medium transition-colors"
            >
              Ajouter
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
      )}

      {/* Liste des années */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      ) : years.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <Grape className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Aucune année pour l'instant</p>
          <p className="text-white/25 text-xs mt-1">
            Appuie sur + pour commencer
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {years.map((y) => (
            <div
              key={y.id}
              onClick={() => navigate(`/year/${y.id}`)}
              className="glass-strong rounded-2xl p-4 flex items-center
                         justify-between cursor-pointer
                         hover:border-purple-400/30 transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl bg-purple-500/20
                                border border-purple-400/20 flex items-center
                                justify-center"
                >
                  <span className="text-purple-300 font-bold text-sm">
                    {y.year}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{y.year}</p>
                  <p className="text-white/40 text-xs">
                    {y.works?.length ?? 0} travaux · {y.treatments?.length ?? 0}{" "}
                    traitements
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDelete(y.id, e)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center
                             text-white/20 hover:text-red-400 transition-colors"
                >
                  {deleting === y.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
