import { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Year, Work, Treatment } from "../types";

export function useYear(yearId: string) {
  const [year, setYear] = useState<Year | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!yearId) return;
    const unsubscribe = onSnapshot(doc(db, "years", yearId), (snap) => {
      if (snap.exists()) {
        setYear({ id: snap.id, ...snap.data() } as Year);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [yearId]);

  const addWork = async (work: Omit<Work, "id" | "createdAt">) => {
    if (!year) return;
    const newWork: Work = {
      ...work,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await updateDoc(doc(db, "years", yearId), {
      works: [...(year.works ?? []), newWork],
    });
  };

  const updateWork = async (workId: string, updated: Partial<Work>) => {
    if (!year) return;
    const works = (year.works ?? []).map((w: Work) =>
      w.id === workId ? { ...w, ...updated } : w
    );
    await updateDoc(doc(db, "years", yearId), { works });
  };

  const deleteWork = async (workId: string) => {
    if (!year) return;
    const works = (year.works ?? []).filter((w: Work) => w.id !== workId);
    await updateDoc(doc(db, "years", yearId), { works });
  };

  const addTreatment = async (treatment: Omit<Treatment, "id" | "createdAt">) => {
    if (!year) return;
    const newTreatment: Treatment = {
      ...treatment,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await updateDoc(doc(db, "years", yearId), {
      treatments: [...(year.treatments ?? []), newTreatment],
    });
  };

  const updateTreatment = async (treatmentId: string, updated: Partial<Treatment>) => {
    if (!year) return;
    const treatments = (year.treatments ?? []).map((t: Treatment) =>
      t.id === treatmentId ? { ...t, ...updated } : t
    );
    await updateDoc(doc(db, "years", yearId), { treatments });
  };

  const deleteTreatment = async (treatmentId: string) => {
    if (!year) return;
    const treatments = (year.treatments ?? []).filter(
      (t: Treatment) => t.id !== treatmentId
    );
    await updateDoc(doc(db, "years", yearId), { treatments });
  };

  return {
    year,
    loading,
    addWork,
    updateWork,
    deleteWork,
    addTreatment,
    updateTreatment,
    deleteTreatment,
  };
}
