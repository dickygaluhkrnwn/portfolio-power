"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { projects } from "@/app/data/projects";
import { journeyData } from "@/app/data/journey";
import { servicesData } from "@/app/data/services"; // Import services data
import { Button } from "@/components/ui/button";
import { Database, Briefcase, CheckCircle, AlertCircle, Loader2, ShoppingBag } from "lucide-react";

export default function SeedPage() {
  const [projectStatus, setProjectStatus] = useState("Idle");
  const [journeyStatus, setJourneyStatus] = useState("Idle");
  const [serviceStatus, setServiceStatus] = useState("Idle");

  const handleSeedProjects = async () => {
    setProjectStatus("Seeding...");
    try {
      const projectsRef = collection(db, "projects");
      for (const project of projects) {
        await setDoc(doc(projectsRef, String(project.id)), project, { merge: true });
      }
      setProjectStatus("Success");
    } catch (error) {
      console.error(error);
      setProjectStatus("Error");
    }
  };

  const handleSeedJourney = async () => {
    setJourneyStatus("Seeding...");
    try {
      const journeyRef = collection(db, "journey");
      for (const item of journeyData) {
        await setDoc(doc(journeyRef, item.id), item, { merge: true });
      }
      setJourneyStatus("Success");
    } catch (error) {
      console.error(error);
      setJourneyStatus("Error");
    }
  };

  const handleSeedServices = async () => {
    setServiceStatus("Seeding...");
    try {
      const servicesRef = collection(db, "services");
      for (const item of servicesData) {
        await setDoc(doc(servicesRef, item.id), item, { merge: true });
      }
      setServiceStatus("Success");
    } catch (error) {
      console.error(error);
      setServiceStatus("Error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-8 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-heading font-bold">Admin Data Seeder</h1>
        <p className="text-muted-foreground">Inject static data to Firestore Database</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Project Seeder Card */}
        <div className="p-6 border border-white/10 rounded-xl bg-secondary/5 flex flex-col gap-4 items-center text-center">
          <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
            <Database size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Seed Projects</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {projects.length} Items
            </p>
          </div>
          <Button 
            onClick={handleSeedProjects} 
            disabled={projectStatus === "Seeding..." || projectStatus === "Success"}
            className="w-full"
            variant={projectStatus === "Error" ? "destructive" : "primary"}
          >
            {projectStatus === "Seeding..." ? <Loader2 className="animate-spin"/> : "Upload"}
          </Button>
        </div>

        {/* Journey Seeder Card */}
        <div className="p-6 border border-white/10 rounded-xl bg-secondary/5 flex flex-col gap-4 items-center text-center">
          <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
            <Briefcase size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Seed Journey</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {journeyData.length} Items
            </p>
          </div>
          <Button 
            onClick={handleSeedJourney} 
            disabled={journeyStatus === "Seeding..." || journeyStatus === "Success"}
            className="w-full"
            variant={journeyStatus === "Error" ? "destructive" : "primary"}
          >
            {journeyStatus === "Seeding..." ? <Loader2 className="animate-spin"/> : "Upload"}
          </Button>
        </div>

        {/* Service Seeder Card */}
        <div className="p-6 border border-white/10 rounded-xl bg-secondary/5 flex flex-col gap-4 items-center text-center">
          <div className="p-3 rounded-full bg-green-500/10 text-green-400">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Seed Services</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {servicesData.length} Packages
            </p>
          </div>
          <Button 
            onClick={handleSeedServices} 
            disabled={serviceStatus === "Seeding..." || serviceStatus === "Success"}
            className="w-full"
            variant={serviceStatus === "Error" ? "destructive" : "primary"}
          >
            {serviceStatus === "Seeding..." ? <Loader2 className="animate-spin"/> : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}