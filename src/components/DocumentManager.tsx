import { useRef } from "react";
import { Paperclip, X, FileText, Image, Loader2, Printer, ExternalLink } from "lucide-react";
import { useUpload } from "../hooks/useUpload";
import { openDocument, printDocument } from "../lib/docUtils";
import type { Document } from "../types";

interface Props {
  documents: Document[];
  onChange: (docs: Document[]) => void;
}

export default function DocumentManager({ documents, onChange }: Props) {
  const { uploadFile, uploading } = useUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const doc = await uploadFile(file);
      if (doc) onChange([...documents, doc]);
    }
    e.target.value = "";
  };

  const removeDoc = (id: string) => {
    onChange(documents.filter((d) => d.id !== id));
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: "rgba(235,235,165,0.3)" }}>
          Documents ({documents.length})
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40"
          style={{ color: "var(--teal-light)" }}
        >
          {uploading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Paperclip className="w-3.5 h-3.5" />
          }
          {uploading ? "Envoi…" : "Ajouter"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {documents.length > 0 && (
        <div className="flex flex-col gap-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{
                background: "rgba(235,235,165,0.03)",
                border: "1px solid rgba(235,235,165,0.08)",
              }}
            >
              {doc.type === "pdf"
                ? <FileText className="w-4 h-4 shrink-0" style={{ color: "rgba(220,100,100,0.7)" }} />
                : <Image className="w-4 h-4 shrink-0" style={{ color: "var(--teal-light)" }} />
              }

              <button
                type="button"
                onClick={() => openDocument(doc.url, doc.type)}
                className="flex-1 text-xs text-left truncate transition-colors"
                style={{ color: "rgba(235,235,165,0.55)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--cream)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(235,235,165,0.55)")}
              >
                {doc.name}
              </button>

              <button
                type="button"
                onClick={() => openDocument(doc.url, doc.type)}
                className="transition-colors"
                style={{ color: "rgba(235,235,165,0.18)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--teal-light)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(235,235,165,0.18)")}
                title="Ouvrir"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => printDocument(doc.url, doc.type)}
                className="transition-colors"
                style={{ color: "rgba(235,235,165,0.18)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--teal-light)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(235,235,165,0.18)")}
                title="Imprimer"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => removeDoc(doc.id)}
                className="transition-colors"
                style={{ color: "rgba(235,235,165,0.18)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(220,80,80,0.8)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(235,235,165,0.18)")}
                title="Supprimer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
