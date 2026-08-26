import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { servicesData } from "../app/data/services";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function seed() {
  console.log("Seeding services to Firebase...");
  try {
    for (const service of servicesData) {
      console.log(`Saving ${service.id}...`);
      await setDoc(doc(db, "services", service.id), service, { merge: true });
    }
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding services:", err);
    process.exit(1);
  }
}

seed();
