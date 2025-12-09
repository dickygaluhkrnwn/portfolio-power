import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy, deleteDoc, setDoc, addDoc } from "firebase/firestore";

export interface JourneyItem {
  id: string;
  year: string;
  role: string;
  company: string;
  type: "work" | "education" | "certification";
  desc: string;
  order?: number; // Optional: untuk sorting manual jika diperlukan nanti
}

const COLLECTION_NAME = "journey";

// Fetch All Journey Items
export async function getAllJourneyItems(): Promise<JourneyItem[]> {
  try {
    const ref = collection(db, COLLECTION_NAME);
    // Kita urutkan berdasarkan tahun (descending) secara default, atau bisa disesuaikan nanti
    const q = query(ref); 
    const snapshot = await getDocs(q);
    
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as JourneyItem[];

    // Sorting manual di client side untuk fleksibilitas (misal "Present" selalu di atas)
    // Sederhana: urutkan berdasarkan field 'year' string descending
    return items.sort((a, b) => b.year.localeCompare(a.year));
  } catch (error) {
    console.error("Error fetching journey:", error);
    return [];
  }
}

// Get Single Journey Item
export async function getJourneyItemById(id: string): Promise<JourneyItem | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as JourneyItem) : null;
  } catch (error) {
    console.error("Error fetching journey item:", error);
    return null;
  }
}

// Save/Update Journey Item
export async function saveJourneyItem(data: Partial<JourneyItem>, id?: string) {
  try {
    if (id && id !== "new") {
      await setDoc(doc(db, COLLECTION_NAME, id), data, { merge: true });
    } else {
      await addDoc(collection(db, COLLECTION_NAME), data);
    }
  } catch (error) {
    console.error("Error saving journey item:", error);
    throw error;
  }
}

// Delete Journey Item
export async function deleteJourneyItem(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting journey item:", error);
    throw error;
  }
}