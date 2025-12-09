import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy, deleteDoc, setDoc, addDoc } from "firebase/firestore";

export interface SocialLink {
  id: string;
  platform: string; // e.g., "GitHub", "LinkedIn"
  url: string;
  category: "professional" | "social" | "creative" | "other";
  icon?: string; // Kita akan mapping icon di frontend berdasarkan nama platform
  active: boolean;
}

const COLLECTION_NAME = "socials";

// Fetch All Links
export async function getAllSocials(): Promise<SocialLink[]> {
  try {
    const socialsRef = collection(db, COLLECTION_NAME);
    const q = query(socialsRef); // Bisa tambah orderBy("platform") nanti
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SocialLink[];
  } catch (error) {
    console.error("Error fetching socials:", error);
    return [];
  }
}

// Get Single Link
export async function getSocialById(id: string): Promise<SocialLink | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as SocialLink) : null;
  } catch (error) {
    console.error("Error fetching social:", error);
    return null;
  }
}

// Save/Update Link
export async function saveSocial(data: Partial<SocialLink>, id?: string) {
  try {
    if (id && id !== "new") {
      await setDoc(doc(db, COLLECTION_NAME, id), data, { merge: true });
    } else {
      await addDoc(collection(db, COLLECTION_NAME), data);
    }
  } catch (error) {
    console.error("Error saving social:", error);
    throw error;
  }
}

// Delete Link
export async function deleteSocial(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting social:", error);
    throw error;
  }
}