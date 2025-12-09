import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy, deleteDoc, setDoc, addDoc, where, limit } from "firebase/firestore";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Bisa HTML atau Markdown
  coverImage?: string;
  tags: string[];
  publishedAt: string; // ISO Date String
  isPublished: boolean;
}

const COLLECTION_NAME = "posts";

// Fetch All Published Posts (untuk halaman publik)
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, COLLECTION_NAME);
    const q = query(
      postsRef, 
      where("isPublished", "==", true),
      orderBy("publishedAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Fetch All Posts (untuk Admin - termasuk draft)
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, COLLECTION_NAME);
    const q = query(postsRef, orderBy("publishedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

// Get Post by Slug (untuk halaman detail)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const postsRef = collection(db, COLLECTION_NAME);
    const q = query(postsRef, where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as BlogPost;
    }
    return null;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

// Get Post by ID (untuk edit di admin)
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as BlogPost) : null;
  } catch (error) {
    return null;
  }
}

// Save/Update Post
export async function savePost(data: Partial<BlogPost>, id?: string) {
  try {
    // Generate slug otomatis jika belum ada atau judul berubah (logic sederhana)
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (id && id !== "new") {
      await setDoc(doc(db, COLLECTION_NAME, id), data, { merge: true });
    } else {
      await addDoc(collection(db, COLLECTION_NAME), data);
    }
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
}

// Delete Post
export async function deletePost(id: string) {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}