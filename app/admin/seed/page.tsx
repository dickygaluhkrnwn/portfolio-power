"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { projects } from "@/app/data/projects";
import { Button } from "@/components/ui/button";

export default function SeedPage() {
  const [status, setStatus] = useState("Idle");

  const handleSeed = async () => {
    setStatus("Seeding...");
    try {
      const projectsRef = collection(db, "projects");
      
      for (const project of projects) {
        // Gunakan setDoc dengan merge: true agar tidak menimpa data yang sudah ada (jika ID sama)
        // Kita gunakan ID dari project sebagai ID dokumen di Firestore
        await setDoc(doc(projectsRef, String(project.id)), project, { merge: true });
        console.log(`Uploaded: ${project.title}`);
      }
      
      setStatus("Success! All projects uploaded.");
    } catch (error) {
      console.error(error);
      setStatus("Error! Check console.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
      <h1 className="text-2xl font-bold">Admin Data Seeder</h1>
      <p className="text-gray-400">Upload data from <code>app/data/projects.ts</code> to Firestore.</p>
      
      <div className="p-4 border border-white/20 rounded bg-white/5">
        <pre className="text-xs text-green-400 mb-4">
          Total Projects to Upload: {projects.length}
        </pre>
        <Button onClick={handleSeed} disabled={status === "Seeding..."}>
          {status === "Seeding..." ? "Uploading..." : "Start Seeding"}
        </Button>
      </div>

      <p className="font-mono text-yellow-400">{status}</p>
    </div>
  );
}