import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1F3A] text-white p-10">
      <h1 className="text-5xl font-bold">GefAeroLogic</h1>
      <p className="mt-2 opacity-80">Engineering the Logic of Flight</p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/fleet" className="bg-[#1E2D44] p-6 rounded-xl hover:opacity-95">
          <h2 className="text-2xl font-semibold">Fleet</h2>
          <p className="opacity-70 mt-2">Manage aircraft & tail numbers</p>
        </Link>

        <div className="bg-[#1E2D44] p-6 rounded-xl opacity-70">
          <h2 className="text-2xl font-semibold">Cases</h2>
          <p className="opacity-70 mt-2">Troubleshooting & Logs</p>
        </div>

        <div className="bg-[#1E2D44] p-6 rounded-xl opacity-70">
          <h2 className="text-2xl font-semibold">Knowledge</h2>
          <p className="opacity-70 mt-2">Manual references & fault database</p>
        </div>
      </div>
    </main>
  );
}
