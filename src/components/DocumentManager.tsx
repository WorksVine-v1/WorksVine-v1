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
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
          Documents ({documents.length})
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40"
          style={{ color: "var(--gold)" }}
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
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Icône selon le type */}
              {doc.type === "pdf"
                ? <FileText className="w-4 h-4 shrink-0" style={{ color: "rgba(220,100,100,0.8)" }} />
                : <Image className="w-4 h-4 shrink-0" style={{ color: "rgba(100,160,220,0.8)" }} />
              }

              {/* Nom du fichier cliquable */}
              <button
                type="button"
                onClick={() => openDocument(doc.url, doc.type)}
                className="flex-1 text-xs text-left truncate transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                {doc.name}
              </button>

              {/* Ouvrir dans nouvel onglet */}
              <button
                type="button"
                onClick={() => openDocument(doc.url, doc.type)}
                className="transition-colors"
                style={{ color: "rgba(255,255,255,0.2)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(201,168,76,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                title="Ouvrir"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {/* Imprimer */}
              <button
                type="button"
                onClick={() => printDocument(doc.url, doc.type)}
                className="transition-colors"
                style={{ color: "rgba(255,255,255,0.2)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(201,168,76,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                title="Imprimer"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              {/* Supprimer */}
              <button
                type="button"
                onClick={() => removeDoc(doc.id)}
                className="transition-colors"
                style={{ color: "rgba(255,255,255,0.2)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(220,80,80,0.8)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
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
