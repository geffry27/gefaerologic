"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/login";
      }
    }

    checkSession();
  }, []);

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Loading GefAeroLogic...</h2>
    </main>
  );
}