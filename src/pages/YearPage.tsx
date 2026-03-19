import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Grape,
  Loader2,
  Shovel,
  FlaskConical,
} from "lucide-react";
import { useYear } from "../hooks/useYear";
import WorkCard from "../components/WorkCard";
import TreatmentCard from "../components/TreatmentCard";
import type { WorkType, TreatmentType } from "../types";

const WORK_TYPES: WorkType[] = [
  "Taille",
  "Liage",
  "Baisse des fils",
  "Remonter les fils",
  "Pré-palissage",
  "Palissage",
  "Vendanges",
];

const TREATMENT_TYPES: TreatmentType[] = [
  "Engrais",
  "Chélate de fer",
  "Désherbage",
];

export default function YearPage() {
  const { yearId } = useParams<{ yearId: string }>();
  const navigate = useNavigate();
  const {
    year,
    loading,
    addWork,
    updateWork,
    deleteWork,
    addTreatment,
    updateTreatment,
    deleteTreatment,
  } = useYear(yearId ?? "");

  const [activeTab, setActiveTab] = useState<"works" | "treatments">("works");
  const [showWorkSelect, setShowWorkSelect] = useState(false);
  const [showTreatmentSelect, setShowTreatmentSelect] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddWork = async (type: WorkType) => {
    setAdding(true);
    await addWork({
      type,
      startDate: "",
      endDate: "",
      notes: "",
      documents: [],
    });
    setShowWorkSelect(false);
    setAdding(false);
  };

  const handleAddTreatment = async (type: TreatmentType) => {
    setAdding(true);
    await addTreatment({ type, date: "", notes: "", documents: [] });
    setShowTreatmentSelect(false);
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!year) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/40">Année introuvable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pt-4">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-xl glass flex items-center
                     justify-center text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Grape className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl font-bold text-white">{year.year}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass rounded-2xl p-1 flex gap-1 mb-6">
        <button
          onClick={() => setActiveTab("works")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5
                      rounded-xl text-sm font-medium transition-all ${
                        activeTab === "works"
                          ? "bg-purple-500/30 text-purple-300 border border-purple-400/30"
                          : "text-white/40 hover:text-white/60"
                      }`}
        >
          <Shovel className="w-4 h-4" />
          Travaux
          <span className="text-xs opacity-60">
            ({year.works?.length ?? 0})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("treatments")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5
                      rounded-xl text-sm font-medium transition-all ${
                        activeTab === "treatments"
                          ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/30"
                          : "text-white/40 hover:text-white/60"
                      }`}
        >
          <FlaskConical className="w-4 h-4" />
          Traitements
          <span className="text-xs opacity-60">
            ({year.treatments?.length ?? 0})
          </span>
        </button>
      </div>

      {/* Section Travaux */}
      {activeTab === "works" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider">
              Travaux
            </h2>
            <button
              onClick={() => setShowWorkSelect(!showWorkSelect)}
              className="w-8 h-8 rounded-lg glass flex items-center justify-center
                         text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Sélecteur travaux */}
          {showWorkSelect && (
            <div className="glass-strong rounded-2xl p-3 mb-4">
              <p className="text-white/50 text-xs mb-2">Choisir un travail</p>
              <div className="flex flex-col gap-1">
                {WORK_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddWork(type)}
                    disabled={adding}
                    className="text-left px-3 py-2.5 rounded-xl text-sm
                               text-white/80 hover:bg-purple-500/20
                               hover:text-purple-300 transition-colors
                               disabled:opacity-50"
                  >
                    {adding ? (
                      <Loader2 className="w-3 h-3 animate-spin inline mr-2" />
                    ) : null}
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Liste travaux */}
          {(year.works?.length ?? 0) === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <Shovel className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">
                Aucun travail pour l'instant
              </p>
              <p className="text-white/25 text-xs mt-1">
                Appuie sur + pour ajouter
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {year.works.map((work: Work) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  onUpdate={updateWork}
                  onDelete={deleteWork}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section Traitements */}
      {activeTab === "treatments" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white/70 text-sm font-medium uppercase tracking-wider">
              Traitements
            </h2>
            <button
              onClick={() => setShowTreatmentSelect(!showTreatmentSelect)}
              className="w-8 h-8 rounded-lg glass flex items-center justify-center
                         text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Sélecteur traitements */}
          {showTreatmentSelect && (
            <div className="glass-strong rounded-2xl p-3 mb-4">
              <p className="text-white/50 text-xs mb-2">
                Choisir un traitement
              </p>
              <div className="flex flex-col gap-1">
                {TREATMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddTreatment(type)}
                    disabled={adding}
                    className="text-left px-3 py-2.5 rounded-xl text-sm
                               text-white/80 hover:bg-emerald-500/20
                               hover:text-emerald-300 transition-colors
                               disabled:opacity-50"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Liste traitements */}
          {(year.treatments?.length ?? 0) === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <FlaskConical className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">
                Aucun traitement pour l'instant
              </p>
              <p className="text-white/25 text-xs mt-1">
                Appuie sur + pour ajouter
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {year.treatments.map((treatment: Treatment) => (
                <TreatmentCard
                  key={treatment.id}
                  treatment={treatment}
                  onUpdate={updateTreatment}
                  onDelete={deleteTreatment}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
