import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Save, Loader2 } from "lucide-react";
import DocumentManager from "./DocumentManager";
import { formatDate } from "../lib/docUtils";
import type { Work, Document } from "../types";

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

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(work.id, { startDate, endDate, notes, documents });
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
        // background: open ? "rgba(107,31,58,0.12)" : "rgba(255,255,255,0.04)",
        border: open ? "1px solid rgba(201,168,76,0.18)" : "1px solid rgba(255,255,255,0.07)",
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
              background: open ? "var(--gold)" : "rgba(201,168,76,0.4)",
              boxShadow: open ? "0 0 6px rgba(201,168,76,0.5)" : "none",
            }}
          />
          <span className="text-sm font-medium"
            style={{ color: open ? "var(--gold-light)" : "rgba(255,255,255,0.8)" }}>
            {work.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Affichage de la date en JJ/MM/AAAA */}
          {work.startDate && !open && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.15)",
                color: "rgba(201,168,76,0.6)",
              }}>
              {formatDate(work.startDate)}
            </span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4" style={{ color: "rgba(201,168,76,0.5)" }} />
            : <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
          }
        </div>
      </div>

      {/* ── Contenu déroulant ── */}
      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="divider-gold mb-4" />

          {/* Dates — le champ input reste en YYYY-MM-DD (standard HTML)
              mais l'affichage dans le header est converti en JJ/MM/AAAA */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium block mb-1.5 tracking-wide"
                style={{ color: "rgba(201,168,76,0.45)" }}>
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
              <label className="text-xs font-medium block mb-1.5 tracking-wide"
                style={{ color: "rgba(201,168,76,0.45)" }}>
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

          {/* Notes */}
          <div className="mb-3">
            <label className="text-xs font-medium block mb-1.5 tracking-wide"
              style={{ color: "rgba(201,168,76,0.45)" }}>
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

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5
                         text-sm font-medium btn-gold disabled:opacity-40 transition-all"
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
