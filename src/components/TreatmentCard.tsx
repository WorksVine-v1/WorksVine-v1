import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Save, Loader2 } from "lucide-react";
import DocumentManager from "./DocumentManager";
import { formatDate } from "../lib/docUtils";
import type { Treatment, Document } from "../types";

interface Props {
  treatment: Treatment;
  onUpdate: (id: string, updated: Partial<Treatment>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TreatmentCard({ treatment, onUpdate, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [date, setDate] = useState(treatment.date ?? "");
  const [notes, setNotes] = useState(treatment.notes ?? "");
  const [documents, setDocuments] = useState<Document[]>(treatment.documents ?? []);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(treatment.id, { date, notes, documents });
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${treatment.type}" ?`)) return;
    setDeleting(true);
    await onDelete(treatment.id);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        // background: open ? "rgba(26,58,31,0.15)" : "rgba(255,255,255,0.04)",
        border: open ? "1px solid rgba(45,92,53,0.35)" : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full shrink-0 transition-all duration-200"
            style={{
              background: open ? "rgba(150,220,160,0.9)" : "rgba(45,92,53,0.6)",
              boxShadow: open ? "0 0 6px rgba(150,220,160,0.4)" : "none",
            }}
          />
          <span className="text-sm font-medium"
            style={{ color: open ? "rgba(150,220,160,0.95)" : "rgba(255,255,255,0.8)" }}>
            {treatment.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Affichage de la date en JJ/MM/AAAA */}
          {treatment.date && !open && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(26,58,31,0.2)",
                border: "1px solid rgba(45,92,53,0.3)",
                color: "rgba(150,220,160,0.6)",
              }}>
              {formatDate(treatment.date)}
            </span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4" style={{ color: "rgba(150,220,160,0.4)" }} />
            : <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
          }
        </div>
      </div>

      {/* ── Contenu déroulant ── */}
      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="mb-4" style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(45,92,53,0.4), transparent)",
          }} />

          {/* Date — champ input en YYYY-MM-DD, affiché en JJ/MM/AAAA dans le header */}
          <div className="mb-3">
            <label className="text-xs font-medium block mb-1.5 tracking-wide"
              style={{ color: "rgba(150,220,160,0.45)" }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm input-dark"
              style={{ borderColor: "rgba(45,92,53,0.3)" }}
            />
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label className="text-xs font-medium block mb-1.5 tracking-wide"
              style={{ color: "rgba(150,220,160,0.45)" }}>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Observations, doses utilisées…"
              className="w-full rounded-xl px-3 py-2 text-sm resize-none input-dark"
              style={{ borderColor: "rgba(45,92,53,0.25)" }}
            />
          </div>

          <DocumentManager documents={documents} onChange={setDocuments} />

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5
                         text-sm font-medium transition-all duration-200 disabled:opacity-40"
              style={{ background: "rgba(26,58,31,0.3)", border: "1px solid rgba(45,92,53,0.4)", color: "rgba(150,220,160,0.9)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,58,31,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(26,58,31,0.3)"; }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-11 flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-40"
              style={{ background: "rgba(220,50,50,0.06)", border: "1px solid rgba(220,50,50,0.15)", color: "rgba(220,80,80,0.6)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,50,50,0.15)"; e.currentTarget.style.color = "rgba(220,80,80,0.9)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,50,50,0.06)"; e.currentTarget.style.color = "rgba(220,80,80,0.6)"; }}
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
