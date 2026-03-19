import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Grape, Loader2, Shovel, FlaskConical } from "lucide-react";
import { useYear } from "../hooks/useYear";
import WorkCard from "../components/WorkCard";
import TreatmentCard from "../components/TreatmentCard";
import type { WorkType, TreatmentType, Work, Treatment } from "../types";

const WORK_TYPES: WorkType[] = [
  "Taille", "Liage", "Baisse des fils", "Remonter les fils",
  "Pré-palissage", "Palissage", "Vendanges",
];

const TREATMENT_TYPES: TreatmentType[] = [
  "Engrais", "Chélate de fer", "Désherbage",
];

export default function YearPage() {
  const { yearId } = useParams<{ yearId: string }>();
  const navigate = useNavigate();
  const {
    year, loading,
    addWork, updateWork, deleteWork,
    addTreatment, updateTreatment, deleteTreatment,
  } = useYear(yearId ?? "");

  const [activeTab, setActiveTab] = useState<"works" | "treatments">("works");
  const [showWorkSelect, setShowWorkSelect] = useState(false);
  const [showTreatmentSelect, setShowTreatmentSelect] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddWork = async (type: WorkType) => {
    setAdding(true);
    await addWork({ type, startDate: "", endDate: "", notes: "", documents: [] });
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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--gold)" }} />
          <p className="text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>Chargement…</p>
        </div>
      </div>
    );
  }

  if (!year) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Année introuvable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-10 max-w-md mx-auto">

      {/* ── Header ── */}
      <div className="animate-fade-in-up pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center
                       transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ color: "rgba(201,168,76,0.6)", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Grape className="w-5 h-5" style={{ color: "var(--gold)" }} />
            <h1 className="text-xl font-bold tracking-tight"
              style={{ color: "var(--gold-light)", letterSpacing: "-0.02em" }}>
              {year.year}
            </h1>
          </div>
        </div>
        <div className="divider-gold" />
      </div>

      {/* ── Tabs ── */}
      <div className="glass rounded-2xl p-1 flex gap-1 mb-6 animate-fade-in-up delay-1"
        style={{ border: "1px solid rgba(201,168,76,0.1)" }}>
        <button
          onClick={() => setActiveTab("works")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                     text-sm font-medium transition-all duration-200"
          style={activeTab === "works" ? {
            background: "rgba(107,31,58,0.3)",
            border: "1px solid rgba(201,168,76,0.2)",
            color: "var(--gold-light)",
          } : {
            color: "rgba(255,255,255,0.3)",
            border: "1px solid transparent",
          }}
        >
          <Shovel className="w-4 h-4" />
          Travaux
          <span className="text-xs opacity-60">({year.works?.length ?? 0})</span>
        </button>
        <button
          onClick={() => setActiveTab("treatments")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                     text-sm font-medium transition-all duration-200"
          style={activeTab === "treatments" ? {
            background: "rgba(26,58,31,0.35)",
            border: "1px solid rgba(45,92,53,0.4)",
            color: "rgba(150,220,160,0.9)",
          } : {
            color: "rgba(255,255,255,0.3)",
            border: "1px solid transparent",
          }}
        >
          <FlaskConical className="w-4 h-4" />
          Traitements
          <span className="text-xs opacity-60">({year.treatments?.length ?? 0})</span>
        </button>
      </div>

      {/* ══ TRAVAUX ══ */}
      {activeTab === "works" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span className="ornament-line text-xs tracking-widest uppercase font-medium flex-1 mr-3"
              style={{ color: "rgba(201,168,76,0.45)" }}>
              Travaux
            </span>
            <button
              onClick={() => setShowWorkSelect(!showWorkSelect)}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center
                         transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ border: "1px solid rgba(201,168,76,0.2)", color: "var(--gold)" }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showWorkSelect && (
            <div className="glass-strong rounded-2xl p-3 mb-4 animate-fade-in"
              style={{ border: "1px solid rgba(201,168,76,0.12)" }}>
              <p className="text-xs font-medium mb-2 px-1" style={{ color: "rgba(201,168,76,0.5)" }}>
                ✦ Choisir un travail
              </p>
              <div className="flex flex-col gap-0.5">
                {WORK_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddWork(type)}
                    disabled={adding}
                    className="text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 disabled:opacity-40"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; e.currentTarget.style.color = "var(--gold-light)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                  >
                    {adding ? <Loader2 className="w-3 h-3 animate-spin inline mr-2 opacity-60" /> : <span className="mr-2 opacity-30">›</span>}
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(year.works?.length ?? 0) === 0 ? (
            <div className="glass rounded-2xl p-10 text-center" style={{ border: "1px solid rgba(201,168,76,0.06)" }}>
              <Shovel className="w-10 h-10 mx-auto mb-3 animate-pulse-soft" style={{ color: "rgba(201,168,76,0.15)" }} />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucun travail enregistré</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>Appuie sur + pour ajouter</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {year.works.map((work: Work) => (
                <WorkCard key={work.id} work={work} onUpdate={updateWork} onDelete={deleteWork} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ TRAITEMENTS ══ */}
      {activeTab === "treatments" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span className="ornament-line text-xs tracking-widest uppercase font-medium flex-1 mr-3"
              style={{ color: "rgba(150,220,160,0.45)" }}>
              Traitements
            </span>
            <button
              onClick={() => setShowTreatmentSelect(!showTreatmentSelect)}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center
                         transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ border: "1px solid rgba(45,92,53,0.35)", color: "rgba(150,220,160,0.8)" }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showTreatmentSelect && (
            <div className="glass-strong rounded-2xl p-3 mb-4 animate-fade-in"
              style={{ border: "1px solid rgba(45,92,53,0.2)" }}>
              <p className="text-xs font-medium mb-2 px-1" style={{ color: "rgba(150,220,160,0.5)" }}>
                ✦ Choisir un traitement
              </p>
              <div className="flex flex-col gap-0.5">
                {TREATMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddTreatment(type)}
                    disabled={adding}
                    className="text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 disabled:opacity-40"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,58,31,0.3)"; e.currentTarget.style.color = "rgba(150,220,160,0.9)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                  >
                    <span className="mr-2 opacity-30">›</span>{type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(year.treatments?.length ?? 0) === 0 ? (
            <div className="glass rounded-2xl p-10 text-center" style={{ border: "1px solid rgba(45,92,53,0.1)" }}>
              <FlaskConical className="w-10 h-10 mx-auto mb-3 animate-pulse-soft" style={{ color: "rgba(150,220,160,0.15)" }} />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucun traitement enregistré</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>Appuie sur + pour ajouter</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {year.treatments.map((treatment: Treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} onUpdate={updateTreatment} onDelete={deleteTreatment} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-10 text-center">
        <p className="text-xs" style={{ color: "rgba(201,168,76,0.15)" }}>✦ WorksVine ✦</p>
      </div>
    </div>
  );
}
