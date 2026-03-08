"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Account created successfully");
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Create Account</h1>

      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Create account
        </button>
      </form>

      <p>{message}</p>
    </main>
  );
}