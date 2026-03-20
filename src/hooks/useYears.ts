import { useState, useEffect } from "react";
import {
  collection, onSnapshot, addDoc,
  deleteDoc, doc, orderBy, query, where,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import type { Year } from "../types";

export function useYears() {
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, "years"),
      where("userId", "==", uid),
      orderBy("year", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Year[];
      setYears(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addYear = async (year: number) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return { error: "Non connecté" };
    const exists = years.find((y: Year) => y.year === year);
    if (exists) return { error: "Cette année existe déjà !" };
    await addDoc(collection(db, "years"), {
      year,
      works: [],
      treatments: [],
      userId: uid,
    });
    return { error: null };
  };

  const deleteYear = async (id: string) => {
    await deleteDoc(doc(db, "years", id));
  };

  return { years, loading, addYear, deleteYear };
}