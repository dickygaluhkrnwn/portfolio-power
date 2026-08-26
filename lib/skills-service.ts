import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, deleteDoc, setDoc, addDoc, orderBy } from "firebase/firestore";

export interface SkillProject {
  projectId?: string;
  projectName: string;
  applicationDescription: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string; // Made dynamic
  description?: string; // Mini deskripsi tentang skill ini
  projectsUsed?: SkillProject[]; // List project dimana skill ini dipakai
  
  // Advanced fields (Suggestions for selling power)
  proficiency?: "Familiar" | "Intermediate" | "Advanced" | "Expert" | "Professional";
  experienceYears?: number;
  isFeatured?: boolean; // Tampilkan paling atas / di highlight

  icon?: string; 
  color?: string; 
  hasCertificate: boolean;
  certificateUrl?: string;
  order?: number; 
}

const COLLECTION_NAME = "skills";

// Fetch All Skills
export async function getAllSkills(): Promise<SkillItem[]> {
  try {
    const ref = collection(db, COLLECTION_NAME);
    // Kita bisa menambahkan order berdasarkan 'order' jika perlu
    const q = query(ref); 
    const snapshot = await getDocs(q);
    
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SkillItem[];

    // Sorting berdasarkan order jika ada, fallback sort abjad name
    return items.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
         return a.order - b.order;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

// Get Single Skill
export async function getSkillById(id: string): Promise<SkillItem | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as SkillItem) : null;
  } catch (error) {
    console.error("Error fetching skill:", error);
    return null;
  }
}

// Save/Update Skill
export async function saveSkill(data: Partial<SkillItem>, id?: string) {
  try {
    if (id && id !== "new") {
      await setDoc(doc(db, COLLECTION_NAME, id), data, { merge: true });
    } else {
      await addDoc(collection(db, COLLECTION_NAME), data);
    }
  } catch (error) {
    console.error("Error saving skill:", error);
    throw error;
  }
}

// Delete Skill
export async function deleteSkill(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
}
