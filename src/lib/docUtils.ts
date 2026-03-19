// Formate une date ISO (YYYY-MM-DD) en JJ/MM/AAAA pour l'affichage
export function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// Ouvre un document Cloudinary correctement selon son type
// Les PDF nécessitent une URL de prévisualisation spéciale
export function openDocument(url: string, type: "image" | "pdf"): void {
  if (type === "pdf") {
    // Cloudinary : transforme l'URL pour forcer l'affichage PDF dans le navigateur
    // Remplace /upload/ par /upload/fl_attachment:false/ pour forcer l'ouverture
    const pdfUrl = url.replace("/upload/", "/upload/fl_inline/");
    window.open(pdfUrl, "_blank");
  } else {
    window.open(url, "_blank");
  }
}

// Ouvre une fenêtre d'impression pour un document
export function printDocument(url: string, type: "image" | "pdf"): void {
  if (type === "pdf") {
    const pdfUrl = url.replace("/upload/", "/upload/fl_inline/");
    const win = window.open(pdfUrl, "_blank");
    win?.addEventListener("load", () => win.print());
  } else {
    const win = window.open(url, "_blank");
    win?.addEventListener("load", () => win.print());
  }
}
