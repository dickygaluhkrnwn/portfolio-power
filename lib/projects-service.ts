import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query } from "firebase/firestore";
import { Project } from "@/app/data/projects";

// Nama koleksi di Firestore
// Pastikan di Firebase Console kamu membuat collection bernama "projects"
const COLLECTION_NAME = "projects";

// Fungsi mengambil semua project
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    const q = query(projectsRef); 
    const snapshot = await getDocs(q);
    
    // Mapping data dari Firestore ke tipe Project kita
    const projects: Project[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []; // Return array kosong agar aplikasi tidak crash
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