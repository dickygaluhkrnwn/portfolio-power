import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy, deleteDoc, setDoc, addDoc } from "firebase/firestore";
import { ServicePackage } from "@/app/data/services";

const COLLECTION_NAME = "services";

// Fetch All Services
export async function getAllServices(): Promise<ServicePackage[]> {
  try {
    const ref = collection(db, COLLECTION_NAME);
    // Urutkan berdasarkan harga atau bisa ditambah field 'order' nanti
    const q = query(ref); 
    const snapshot = await getDocs(q);
    
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ServicePackage[];

    // Sort manual: taruh yang recommended di tengah atau urutkan harga
    // Disini kita urutkan berdasarkan ID saja dulu agar sesuai urutan seed
    return items.sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

// Get Single Service
export async function getServiceById(id: string): Promise<ServicePackage | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as ServicePackage) : null;
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}

// Save/Update Service
export async function saveService(data: Partial<ServicePackage>, id?: string) {
  try {
    if (id && id !== "new") {
      await setDoc(doc(db, COLLECTION_NAME, id), data, { merge: true });
    } else {
      await addDoc(collection(db, COLLECTION_NAME), data);
    }
  } catch (error) {
    console.error("Error saving service:", error);
    throw error;
  }
}

// Delete Service
export async function deleteService(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}