import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { Project } from "@/app/data/projects";

const COLLECTION_NAME = "projects";

// Fungsi mengambil semua project
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    // Kita urutkan berdasarkan ID agar urutannya konsisten 1, 2, 3...
    // Catatan: Sorting string ID "1", "10", "2" mungkin tidak sesuai harapan numerik,
    // tapi cukup konsisten untuk sekarang.
    const q = query(projectsRef); 
    const snapshot = await getDocs(q);
    
    const projects: Project[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];

    // Sorting manual di client side untuk memastikan urutan integer (1, 2, 3)
    return projects.sort((a, b) => Number(a.id) - Number(b.id));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []; 
  }
}

// Fungsi mengambil satu project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}