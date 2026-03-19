import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Save, Loader2 } from "lucide-react";
import DocumentManager from "./DocumentManager";
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
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header carte */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-white font-medium text-sm">{work.type}</span>
        </div>
        <div className="flex items-center gap-2">
          {work.startDate && (
            <span className="text-white/30 text-xs">{work.startDate}</span>
          )}
          {open ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </div>
      </div>

      {/* Contenu déroulant */}
      {open && (
        <div className="px-4 pb-4 border-t border-white/10 pt-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-white/40 text-xs mb-1 block">
                Date début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl
                           px-3 py-2 text-white text-sm focus:outline-none
                           focus:border-purple-400/50"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">
                Date fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl
                           px-3 py-2 text-white text-sm focus:outline-none
                           focus:border-purple-400/50"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label className="text-white/40 text-xs mb-1 block">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ajouter des notes..."
              className="w-full bg-white/10 border border-white/20 rounded-xl
                         px-3 py-2 text-white text-sm placeholder-white/20
                         focus:outline-none focus:border-purple-400/50 resize-none"
            />
          </div>

          {/* Documents */}
          <DocumentManager documents={documents} onChange={setDocuments} />

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2
                         bg-purple-500/30 hover:bg-purple-500/50
                         border border-purple-400/30 rounded-xl py-2.5
                         text-purple-300 text-sm font-medium transition-colors
                         disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-11 flex items-center justify-center
                         bg-red-500/10 hover:bg-red-500/30
                         border border-red-400/20 rounded-xl
                         text-red-400 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
