"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Aircraft = {
  tail: string;
  manufacturer: string;
  model: string;
  category: string;
};

const STORAGE_KEY = "fleet";

export default function AircraftProfilePage() {
  const params = useParams<{ tail: string }>();
  const tail = useMemo(() => (params?.tail ? String(params.tail) : ""), [params]);

  const [aircraft, setAircraft] = useState<Aircraft | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list: Aircraft[] = stored ? JSON.parse(stored) : [];
      const found = list.find(
        (a) => a.tail.trim().toUpperCase() === tail.trim().toUpperCase()
      );
      setAircraft(found || null);
    } catch {
      setAircraft(null);
    }
  }, [tail]);

  return (
    <main className="min-h-screen bg-[#0B2340] text-white p-10">
      <Link href="/fleet" className="underline opacity-80">
        ← Back to Fleet
      </Link>

      {!aircraft ? (
        <div className="mt-10 bg-[#1E3655] p-6 rounded">
          <h1 className="text-3xl font-bold">{tail || "Unknown Tail"}</h1>
          <p className="opacity-80 mt-2">
            Aircraft not found in your fleet. Go back and add it first.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8">
            <h1 className="text-4xl font-bold">{aircraft.tail}</h1>
            <p className="text-lg opacity-90 mt-2">
              {aircraft.manufacturer} {aircraft.model}
            </p>
            <p className="opacity-70 mt-1">Category: {aircraft.category}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-[#1E3655] p-6 rounded">
              <h2 className="text-xl font-semibold">Cases</h2>
              <p className="opacity-80 mt-2">
                Troubleshooting history for this aircraft.
              </p>
              <button className="mt-4 bg-gray-700 px-4 py-2 rounded opacity-80 cursor-not-allowed">
                Coming soon
              </button>
            </div>

            <div className="bg-[#1E3655] p-6 rounded">
              <h2 className="text-xl font-semibold">Manuals</h2>
              <p className="opacity-80 mt-2">References & ATA sections.</p>
              <button className="mt-4 bg-gray-700 px-4 py-2 rounded opacity-80 cursor-not-allowed">
                Coming soon
              </button>
            </div>

            <div className="bg-[#1E3655] p-6 rounded">
              <h2 className="text-xl font-semibold">Common Faults</h2>
              <p className="opacity-80 mt-2">Known issues by system & model.</p>
              <button className="mt-4 bg-gray-700 px-4 py-2 rounded opacity-80 cursor-not-allowed">
                Coming soon
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
