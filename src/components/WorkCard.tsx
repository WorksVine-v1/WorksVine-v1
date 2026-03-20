import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Save, Loader2 } from "lucide-react";
import DocumentManager from "./DocumentManager";
import { formatDate } from "../lib/docUtils";
import type { Work, Document } from "../types";

type Status = "à faire" | "en cours" | "terminé";

const STATUS_CONFIG: Record<Status, { label: string; bg: string; border: string; color: string; dot: string }> = {
  "à faire": {
    label: "À faire",
    bg: "rgba(235,235,165,0.06)",
    border: "rgba(235,235,165,0.15)",
    color: "rgba(235,235,165,0.5)",
    dot: "rgba(235,235,165,0.3)",
  },
  "en cours": {
    label: "En cours",
    bg: "rgba(4,101,110,0.15)",
    border: "rgba(4,101,110,0.4)",
    color: "rgba(5,132,143,0.95)",
    dot: "#05848f",
  },
  "terminé": {
    label: "Terminé",
    bg: "rgba(100,180,100,0.1)",
    border: "rgba(100,180,100,0.3)",
    color: "rgba(120,200,120,0.9)",
    dot: "rgba(120,200,120,0.85)",
  },
};

const NEXT_STATUS: Record<Status, Status> = {
  "à faire": "en cours",
  "en cours": "terminé",
  "terminé": "à faire",
};

interface Props {
  work: Work;
  onUpdate: (id: string, updated: Partial<Work>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function WorkCard({ work, onUpdate, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [startDate, setStartDate] = useState(work.startDate ?? "");
  const [endDate, setEndDate] = useState(work.endDate ?? "");
  const [notes, setNotes] = useState(work.notes ?? "");
  const [documents, setDocuments] = useState<Document[]>(work.documents ?? []);
  const [status, setStatus] = useState<Status>(work.status ?? "à faire");

  const cfg = STATUS_CONFIG[status];

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = NEXT_STATUS[status];
    setStatus(next);
    await onUpdate(work.id, { status: next });
  };

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(work.id, { startDate, endDate, notes, documents, status });
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${work.type}" ?`)) return;
    setDeleting(true);
    await onDelete(work.id);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: open
          ? "1px solid rgba(4,101,110,0.4)"
          : "1px solid rgba(235,235,165,0.08)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Point coloré selon statut */}
          <div
            className="w-2 h-2 rounded-full shrink-0 transition-all duration-300"
            style={{
              background: cfg.dot,
              boxShadow: status !== "à faire" ? `0 0 6px ${cfg.dot}` : "none",
            }}
          />
          <span
            className="text-sm font-medium truncate"
            style={{ color: open ? "var(--cream)" : "rgba(235,235,165,0.75)" }}
          >
            {work.type}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Date si carte fermée */}
          {work.startDate && !open && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(4,101,110,0.12)",
                border: "1px solid rgba(4,101,110,0.22)",
                color: "rgba(235,235,165,0.45)",
              }}
            >
              {formatDate(work.startDate)}
            </span>
          )}

          {/* Badge statut — cliquable */}
          <button
            onClick={handleToggleStatus}
            className="text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              color: cfg.color,
            }}
            title="Changer le statut"
          >
            {cfg.label}
          </button>

          {open
            ? <ChevronUp className="w-4 h-4" style={{ color: "rgba(235,235,165,0.35)" }} />
            : <ChevronDown className="w-4 h-4" style={{ color: "rgba(235,235,165,0.2)" }} />
          }
        </div>
      </div>

      {/* ── Contenu déroulant ── */}
      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="divider-gold mb-4" />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label
                className="text-xs font-medium block mb-1.5 tracking-wide"
                style={{ color: "rgba(235,235,165,0.4)" }}
              >
                Date début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm input-dark"
              />
            </div>
            <div>
              <label
                className="text-xs font-medium block mb-1.5 tracking-wide"
                style={{ color: "rgba(235,235,165,0.4)" }}
              >
                Date fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm input-dark"
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              className="text-xs font-medium block mb-1.5 tracking-wide"
              style={{ color: "rgba(235,235,165,0.4)" }}
            >
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Observations, remarques…"
              className="w-full rounded-xl px-3 py-2 text-sm resize-none input-dark"
            />
          </div>

          <DocumentManager documents={documents} onChange={setDocuments} />

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5
                         text-sm font-medium btn-gold disabled:opacity-40 transition-all"
            >
              {saving
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Save className="w-4 h-4" />
              }
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-11 flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-40"
              style={{
                background: "rgba(220,50,50,0.06)",
                border: "1px solid rgba(220,50,50,0.15)",
                color: "rgba(220,80,80,0.6)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(220,50,50,0.15)";
                e.currentTarget.style.color = "rgba(220,80,80,0.9)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(220,50,50,0.06)";
                e.currentTarget.style.color = "rgba(220,80,80,0.6)";
              }}
            >
              {deleting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Trash2 className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
