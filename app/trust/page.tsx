"use client";

import { useEffect, useState } from "react";
import { incidents, Incident } from "@/lib/mock-data";
import { IncidentCard } from "@/components/incidents/IncidentCard";

export default function IncidentsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="space-y-6 p-8">
      <header>
        <h1 className="text-xl font-semibold">Incidents</h1>
        <p className="text-sm text-slate-500">
          Detection-rule triggered incidents and response actions
        </p>
      </header>

      <section className="space-y-4">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg bg-slate-200"
              />
            ))
          : incidents.map((incident: Incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
              />
            ))}
      </section>
    </main>
  );
}
