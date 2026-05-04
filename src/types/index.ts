export type WorkType =
  | "Taille"
  | "Liage"
  | "Baisse des fils"
  | "Remonter les fils"
  | "Pré-palissage"
  | "Palissage"
  | "Vendanges";

export type TreatmentType =
  | "Engrais"
  | "Chélate de fer"
  | "Désherbage"
  | "Phytosanitaire";

export interface Document {
  id: string;
  name: string;
  url: string;
  type: "image" | "pdf";
}

export interface Work {
  id: string;
  type: WorkType;
  startDate: string;
  endDate: string;
  notes: string;
  documents: Document[];
  createdAt: string;
  status?: "à faire" | "en cours" | "terminé";
}

export interface Treatment {
  id: string;
  type: TreatmentType;
  date: string;
  notes: string;
  documents: Document[];
  createdAt: string;
  status?: "à faire" | "en cours" | "terminé";
}

export interface Year {
  id: string;
  year: number;
  works: Work[];
  treatments: Treatment[];
}
