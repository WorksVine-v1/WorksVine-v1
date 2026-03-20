import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Grape,
  Loader2,
  Shovel,
  FlaskConical,
  BarChart2,
} from "lucide-react";
import { useYear } from "../hooks/useYear";
import WorkCard from "../components/WorkCard";
import TreatmentCard from "../components/TreatmentCard";
import type { WorkType, TreatmentType, Work, Treatment } from "../types";

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

// Couleurs pour chaque type de travail
const WORK_COLORS: Record<string, string> = {
  Taille: "#05848f",
  Liage: "#EBEBA5",
  "Baisse des fils": "#7ab8bc",
  "Remonter les fils": "#c8c870",
  "Pré-palissage": "#4da8b0",
  Palissage: "#a8d870",
  Vendanges: "#d4a84b",
};

const TREATMENT_COLORS: Record<string, string> = {
  Engrais: "#05848f",
  "Chélate de fer": "#EBEBA5",
  Désherbage: "#7ab8bc",
};

// Composant barre de progression
function StatBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 12, color: "rgba(235,235,165,0.65)" }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(235,235,165,0.5)",
          }}
        >
          {count}
        </span>
      </div>
      <div
        style={{
          height: 5,
          borderRadius: 99,
          background: "rgba(235,235,165,0.07)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 99,
            background: color,
            transition: "width 0.6s ease",
            boxShadow: `0 0 6px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}

// Composant carte stat chiffrée
function StatCard({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 14,
        padding: "12px 10px",
        textAlign: "center",
        background: "rgba(235,235,165,0.03)",
        border: "1px solid rgba(235,235,165,0.08)",
      }}
    >
      <p
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color,
          margin: 0,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: 10,
          color: "rgba(235,235,165,0.35)",
          marginTop: 5,
          lineHeight: 1.3,
        }}
      >
        {label}
      </p>
    </div>
  );
}

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

  const [activeTab, setActiveTab] = useState<"works" | "treatments" | "stats">(
    "works",
  );
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
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "var(--teal-light)" }}
          />
          <p className="text-xs" style={{ color: "rgba(235,235,165,0.35)" }}>
            Chargement…
          </p>
        </div>
      </div>
    );
  }

  if (!year) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: "rgba(235,235,165,0.3)" }}>
          Année introuvable
        </p>
      </div>
    );
  }

  // ── Calculs statistiques ──
  const works = year.works ?? [];
  const treatments = year.treatments ?? [];

  // Comptage par type de travail
  const workCounts = WORK_TYPES.reduce<Record<string, number>>((acc, t) => {
    acc[t] = works.filter((w: Work) => w.type === t).length;
    return acc;
  }, {});
  const workTypesUsed = WORK_TYPES.filter((t) => workCounts[t] > 0);

  // Comptage par type de traitement
  const treatCounts = TREATMENT_TYPES.reduce<Record<string, number>>(
    (acc, t) => {
      acc[t] = treatments.filter((tr: Treatment) => tr.type === t).length;
      return acc;
    },
    {},
  );
  const treatTypesUsed = TREATMENT_TYPES.filter((t) => treatCounts[t] > 0);

  // Statuts travaux
  const workDone = works.filter((w: Work) => w.status === "terminé").length;
  const workInProg = works.filter((w: Work) => w.status === "en cours").length;
  const workTodo = works.filter(
    (w: Work) => !w.status || w.status === "à faire",
  ).length;

  // Statuts traitements
  const treatDone = treatments.filter(
    (t: Treatment) => t.status === "terminé",
  ).length;
  const treatInProg = treatments.filter(
    (t: Treatment) => t.status === "en cours",
  ).length;

  // Documents totaux
  const totalDocs =
    works.reduce((s: number, w: Work) => s + (w.documents?.length ?? 0), 0) +
    treatments.reduce(
      (s: number, t: Treatment) => s + (t.documents?.length ?? 0),
      0,
    );

  return (
    <div className="min-h-screen p-4 pb-10 max-w-md mx-auto">
      {/* ── Header ── */}
      <div className="animate-fade-in-up pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center
                       transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              color: "rgba(235,235,165,0.5)",
              border: "1px solid rgba(235,235,165,0.1)",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Grape className="w-5 h-5" style={{ color: "var(--teal-light)" }} />
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--cream)", letterSpacing: "-0.02em" }}
            >
              {year.year}
            </h1>
          </div>
        </div>
        <div className="divider-gold" />
      </div>

      {/* ── Tabs (3 onglets) ── */}
      <div
        className="glass rounded-2xl p-1 flex gap-1 mb-6 animate-fade-in-up delay-1"
        style={{ border: "1px solid rgba(235,235,165,0.08)" }}
      >
        <button
          onClick={() => setActiveTab("works")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                     text-sm font-medium transition-all duration-200"
          style={
            activeTab === "works"
              ? {
                  background: "rgba(4,101,110,0.3)",
                  border: "1px solid rgba(4,101,110,0.5)",
                  color: "var(--cream)",
                }
              : {
                  color: "rgba(235,235,165,0.3)",
                  border: "1px solid transparent",
                }
          }
        >
          <Shovel className="w-3.5 h-3.5" />
          Travaux
          <span className="text-xs opacity-60">({works.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("treatments")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                     text-sm font-medium transition-all duration-200"
          style={
            activeTab === "treatments"
              ? {
                  background: "rgba(235,235,165,0.08)",
                  border: "1px solid rgba(235,235,165,0.18)",
                  color: "var(--cream)",
                }
              : {
                  color: "rgba(235,235,165,0.3)",
                  border: "1px solid transparent",
                }
          }
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Soins
          <span className="text-xs opacity-60">({treatments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                     text-sm font-medium transition-all duration-200"
          style={
            activeTab === "stats"
              ? {
                  background: "rgba(235,235,165,0.08)",
                  border: "1px solid rgba(235,235,165,0.18)",
                  color: "var(--cream)",
                }
              : {
                  color: "rgba(235,235,165,0.3)",
                  border: "1px solid transparent",
                }
          }
        >
          <BarChart2 className="w-3.5 h-3.5" />
          Stats
        </button>
      </div>

      {/* ══ TRAVAUX ══ */}
      {activeTab === "works" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span
              className="ornament-line text-xs tracking-widest uppercase font-medium flex-1 mr-3"
              style={{ color: "rgba(235,235,165,0.4)" }}
            >
              Travaux
            </span>
            <button
              onClick={() => setShowWorkSelect(!showWorkSelect)}
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

          {showWorkSelect && (
            <div
              className="glass-strong rounded-2xl p-3 mb-4 animate-fade-in"
              style={{ border: "1px solid rgba(4,101,110,0.2)" }}
            >
              <p
                className="text-xs font-medium mb-2 px-1"
                style={{ color: "rgba(235,235,165,0.4)" }}
              >
                ✦ Choisir un travail
              </p>
              <div className="flex flex-col gap-0.5">
                {WORK_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddWork(type)}
                    disabled={adding}
                    className="text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 disabled:opacity-40"
                    style={{ color: "rgba(235,235,165,0.7)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(4,101,110,0.15)";
                      e.currentTarget.style.color = "var(--cream)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(235,235,165,0.7)";
                    }}
                  >
                    {adding ? (
                      <Loader2 className="w-3 h-3 animate-spin inline mr-2 opacity-60" />
                    ) : (
                      <span className="mr-2 opacity-30">›</span>
                    )}
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {works.length === 0 ? (
            <div
              className="glass rounded-2xl p-10 text-center"
              style={{ border: "1px solid rgba(235,235,165,0.06)" }}
            >
              <Shovel
                className="w-10 h-10 mx-auto mb-3 animate-pulse-soft"
                style={{ color: "rgba(235,235,165,0.15)" }}
              />
              <p className="text-sm" style={{ color: "rgba(235,235,165,0.3)" }}>
                Aucun travail enregistré
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(235,235,165,0.15)" }}
              >
                Appuie sur + pour ajouter
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {works.map((work: Work) => (
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

      {/* ══ TRAITEMENTS ══ */}
      {activeTab === "treatments" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span
              className="ornament-line text-xs tracking-widest uppercase font-medium flex-1 mr-3"
              style={{ color: "rgba(235,235,165,0.4)" }}
            >
              Traitements
            </span>
            <button
              onClick={() => setShowTreatmentSelect(!showTreatmentSelect)}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center
                         transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                border: "1px solid rgba(235,235,165,0.15)",
                color: "rgba(235,235,165,0.6)",
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showTreatmentSelect && (
            <div
              className="glass-strong rounded-2xl p-3 mb-4 animate-fade-in"
              style={{ border: "1px solid rgba(235,235,165,0.1)" }}
            >
              <p
                className="text-xs font-medium mb-2 px-1"
                style={{ color: "rgba(235,235,165,0.4)" }}
              >
                ✦ Choisir un traitement
              </p>
              <div className="flex flex-col gap-0.5">
                {TREATMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddTreatment(type)}
                    disabled={adding}
                    className="text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 disabled:opacity-40"
                    style={{ color: "rgba(235,235,165,0.7)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(235,235,165,0.06)";
                      e.currentTarget.style.color = "var(--cream)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(235,235,165,0.7)";
                    }}
                  >
                    <span className="mr-2 opacity-30">›</span>
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {treatments.length === 0 ? (
            <div
              className="glass rounded-2xl p-10 text-center"
              style={{ border: "1px solid rgba(235,235,165,0.06)" }}
            >
              <FlaskConical
                className="w-10 h-10 mx-auto mb-3 animate-pulse-soft"
                style={{ color: "rgba(235,235,165,0.15)" }}
              />
              <p className="text-sm" style={{ color: "rgba(235,235,165,0.3)" }}>
                Aucun traitement enregistré
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(235,235,165,0.15)" }}
              >
                Appuie sur + pour ajouter
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {treatments.map((treatment: Treatment) => (
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

      {/* ══ STATISTIQUES ══ */}
      {activeTab === "stats" && (
        <div className="animate-fade-in flex flex-col gap-4">
          {/* Chiffres clés */}
          <div style={{ display: "flex", gap: 8 }}>
            <StatCard
              value={works.length}
              label="Travaux total"
              color="var(--teal-light)"
            />
            <StatCard
              value={treatments.length}
              label="Traitements total"
              color="var(--cream)"
            />
            <StatCard
              value={totalDocs}
              label="Documents joints"
              color="rgba(235,235,165,0.55)"
            />
          </div>

          {/* Avancement travaux */}
          {works.length > 0 && (
            <div
              className="glass-strong rounded-2xl p-4"
              style={{ border: "1px solid rgba(235,235,165,0.1)" }}
            >
              <p
                className="text-xs font-medium tracking-widest uppercase mb-3"
                style={{ color: "rgba(235,235,165,0.4)" }}
              >
                Avancement travaux
              </p>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[
                  {
                    label: "Terminés",
                    val: workDone,
                    color: "rgba(120,200,120,0.9)",
                  },
                  {
                    label: "En cours",
                    val: workInProg,
                    color: "var(--teal-light)",
                  },
                  {
                    label: "À faire",
                    val: workTodo,
                    color: "rgba(235,235,165,0.35)",
                  },
                ].map((s) => (
                  <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: s.color,
                        margin: 0,
                      }}
                    >
                      {s.val}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "rgba(235,235,165,0.3)",
                        marginTop: 2,
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              {/* Barre de progression globale */}
              <div
                style={{
                  height: 6,
                  borderRadius: 99,
                  background: "rgba(235,235,165,0.07)",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: `${works.length > 0 ? (workDone / works.length) * 100 : 0}%`,
                    background: "rgba(120,200,120,0.7)",
                    transition: "width 0.6s ease",
                  }}
                />
                <div
                  style={{
                    width: `${works.length > 0 ? (workInProg / works.length) * 100 : 0}%`,
                    background: "var(--teal-light)",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(235,235,165,0.25)",
                  marginTop: 6,
                  textAlign: "right",
                }}
              >
                {works.length > 0
                  ? Math.round((workDone / works.length) * 100)
                  : 0}
                % terminé
              </p>
            </div>
          )}

          {/* Répartition par type de travail */}
          {workTypesUsed.length > 0 && (
            <div
              className="glass-strong rounded-2xl p-4"
              style={{ border: "1px solid rgba(235,235,165,0.1)" }}
            >
              <p
                className="text-xs font-medium tracking-widest uppercase mb-3"
                style={{ color: "rgba(235,235,165,0.4)" }}
              >
                Types de travaux
              </p>
              {workTypesUsed.map((type) => (
                <StatBar
                  key={type}
                  label={type}
                  count={workCounts[type]}
                  total={works.length}
                  color={WORK_COLORS[type] ?? "var(--teal-light)"}
                />
              ))}
            </div>
          )}

          {/* Avancement traitements */}
          {treatments.length > 0 && (
            <div
              className="glass-strong rounded-2xl p-4"
              style={{ border: "1px solid rgba(235,235,165,0.1)" }}
            >
              <p
                className="text-xs font-medium tracking-widest uppercase mb-3"
                style={{ color: "rgba(235,235,165,0.4)" }}
              >
                Traitements
              </p>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[
                  {
                    label: "Terminés",
                    val: treatDone,
                    color: "rgba(120,200,120,0.9)",
                  },
                  {
                    label: "En cours",
                    val: treatInProg,
                    color: "var(--teal-light)",
                  },
                  {
                    label: "À faire",
                    val: treatments.length - treatDone - treatInProg,
                    color: "rgba(235,235,165,0.35)",
                  },
                ].map((s) => (
                  <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: s.color,
                        margin: 0,
                      }}
                    >
                      {s.val}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "rgba(235,235,165,0.3)",
                        marginTop: 2,
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              {treatTypesUsed.map((type) => (
                <StatBar
                  key={type}
                  label={type}
                  count={treatCounts[type]}
                  total={treatments.length}
                  color={TREATMENT_COLORS[type] ?? "var(--cream)"}
                />
              ))}
            </div>
          )}

          {/* Aucune donnée */}
          {works.length === 0 && treatments.length === 0 && (
            <div
              className="glass rounded-2xl p-10 text-center"
              style={{ border: "1px solid rgba(235,235,165,0.06)" }}
            >
              <BarChart2
                className="w-10 h-10 mx-auto mb-3 animate-pulse-soft"
                style={{ color: "rgba(235,235,165,0.15)" }}
              />
              <p className="text-sm" style={{ color: "rgba(235,235,165,0.3)" }}>
                Pas encore de données
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(235,235,165,0.15)" }}
              >
                Ajoute des travaux et traitements pour voir les stats
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 text-center">
        <p className="text-xs" style={{ color: "rgba(235,235,165,0.12)" }}>
          ✦ WorksVine ✦
        </p>
      </div>
    </div>
  );
}
