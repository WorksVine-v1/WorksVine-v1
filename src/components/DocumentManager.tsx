import { useRef } from "react";
import { Paperclip, X, FileText, Image, Loader2, Printer } from "lucide-react";
import { useUpload } from "../hooks/useUpload";
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

  const printDoc = (url: string) => {
    const win = window.open(url, "_blank");
    win?.print();
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">
          Documents ({documents.length})
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Paperclip className="w-3.5 h-3.5" />
          )}
          {uploading ? "Envoi..." : "Ajouter"}
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
              className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10"
            >
              {doc.type === "pdf" ? (
                <FileText className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Image className="w-4 h-4 text-blue-400 shrink-0" />
              )}
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-xs text-white/70 hover:text-white truncate transition-colors"
              >
                {doc.name}
              </a>
              <button
                type="button"
                onClick={() => printDoc(doc.url)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeDoc(doc.id)}
                className="text-white/30 hover:text-red-400 transition-colors"
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
