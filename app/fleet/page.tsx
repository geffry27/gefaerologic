"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Aircraft = {
  tail: string;
  manufacturer: string;
  model: string;
  category: string; // GA / Jet / Experimental / Airplane (etc)
};

const STORAGE_KEY = "fleet";
const UPDATED_KEY = "fleet_last_updated";

function normalizeCat(input: string) {
  const v = (input || "").trim().toLowerCase();

  // Normalizaciones comunes (puedes ajustar luego)
  if (v.includes("ga") || v.includes("general")) return "GA";
  if (v.includes("jet")) return "Jet";
  if (v.includes("exp") || v.includes("experimental")) return "Experimental";
  if (v.includes("airplane") || v.includes("aeroplane")) return "Airplane";

  // Si el usuario escribe cualquier cosa, lo dejamos “Other”
  if (!v) return "Other";
  return "Other";
}

function formatUpdated(ts: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function FleetPage() {
  const [aircraftList, setAircraftList] = useState<Aircraft[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [tail, setTail] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load fleet on entry
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const updated = localStorage.getItem(UPDATED_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Aircraft[];
        if (Array.isArray(parsed)) setAircraftList(parsed);
      } catch {
        // ignore parse errors
      }
    }
    if (updated) setLastUpdated(updated);
  }, []);

  // Mini dashboard stats (Embraer-style summary)
  const stats = useMemo(() => {
    const total = aircraftList.length;

    let ga = 0;
    let jet = 0;
    let exp = 0;
    let airplane = 0;
    let other = 0;

    for (const a of aircraftList) {
      const c = normalizeCat(a.category);
      if (c === "GA") ga++;
      else if (c === "Jet") jet++;
      else if (c === "Experimental") exp++;
      else if (c === "Airplane") airplane++;
      else other++;
    }

    return { total, ga, jet, exp, airplane, other };
  }, [aircraftList]);

  function persist(next: Aircraft[]) {
    setAircraftList(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    const now = new Date().toISOString();
    localStorage.setItem(UPDATED_KEY, now);
    setLastUpdated(now);
  }

  function resetForm() {
    setTail("");
    setManufacturer("");
    setModel("");
    setCategory("");
  }

  function saveAircraft() {
    const t = tail.trim().toUpperCase();
    const mfg = manufacturer.trim();
    const mdl = model.trim();
    const cat = category.trim();

    if (!t) return;

    const newAircraft: Aircraft = {
      tail: t,
      manufacturer: mfg || "—",
      model: mdl || "—",
      category: cat || "Other",
    };

    // Remove duplicates by tail
    const filtered = aircraftList.filter((a) => a.tail !== t);

    // Add newest first
    const next = [newAircraft, ...filtered];

    persist(next);
    resetForm();
    setShowForm(false);
  }

  function deleteAircraft(tailToDelete: string) {
    const next = aircraftList.filter((a) => a.tail !== tailToDelete);
    persist(next);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#071a33] to-[#051325] text-white px-8 py-10">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-white/60 mt-2">
            GefAeroLogic
          </p>
        </div>

        <Link
          href="/"
          className="text-white/70 hover:text-white underline underline-offset-4"
        >
          Dashboard
        </Link>
      </div>

      {/* MINI DASHBOARD (Embraer style) */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
          <p className="text-white/60 text-sm">Total Aircraft</p>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
          <p className="text-white/50 text-xs mt-2">Fleet size</p>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
          <p className="text-white/60 text-sm">GA</p>
          <p className="text-3xl font-bold mt-2">{stats.ga}</p>
          <p className="text-white/50 text-xs mt-2">General Aviation</p>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
          <p className="text-white/60 text-sm">Jet</p>
          <p className="text-3xl font-bold mt-2">{stats.jet}</p>
          <p className="text-white/50 text-xs mt-2">Turbine fleet</p>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
          <p className="text-white/60 text-sm">Experimental</p>
          <p className="text-3xl font-bold mt-2">{stats.exp}</p>
          <p className="text-white/50 text-xs mt-2">Homebuilt / kit</p>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
          <p className="text-white/60 text-sm">Last Updated</p>
          <p className="text-base font-semibold mt-2">
            {formatUpdated(lastUpdated)}
          </p>
          <p className="text-white/50 text-xs mt-2">Local save timestamp</p>
        </div>
      </section>

      {/* Actions */}
      <div className="mt-8">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2"
        >
          + Add Aircraft
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mt-6 rounded-2xl bg-white/10 border border-white/10 p-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={tail}
              onChange={(e) => setTail(e.target.value)}
              placeholder="Tail Number (ex: N289HG)"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            />
            <input
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="Manufacturer (ex: Piper)"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            />
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model (ex: PA-28)"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (GA / Jet / Experimental / Airplane)"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={saveAircraft}
              className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2"
            >
              Save Aircraft
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <section className="mt-8 space-y-4 max-w-6xl">
        {aircraftList.length === 0 ? (
          <div className="rounded-2xl bg-white/10 border border-white/10 p-6 text-white/70">
            No aircraft registered yet.
          </div>
        ) : (
          aircraftList.map((aircraft) => (
            <div
              key={aircraft.tail}
              className="rounded-2xl bg-white/10 border border-white/10 p-6"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <Link
                    href={`/aircraft/${aircraft.tail}`}
                    className="text-2xl font-bold underline underline-offset-4 hover:text-white/90"
                  >
                    {aircraft.tail}
                  </Link>
                  <p className="mt-1 text-white/80 uppercase">
                    {aircraft.manufacturer} {aircraft.model}
                  </p>
                  <p className="text-white/60 mt-1">
                    Category: {normalizeCat(aircraft.category)}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/aircraft/${aircraft.tail}`}
                    className="rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold px-4 py-2"
                  >
                    Open
                  </Link>

                  <button
                    onClick={() => deleteAircraft(aircraft.tail)}
                    className="rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
