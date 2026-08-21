"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/lib/supabase/types";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  location: string;
}

const INITIAL: FormValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "farmer",
  location: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (values.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(values.phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        // Copied into public.users by the handle_new_user trigger (see supabase/schema.sql).
        data: {
          name: values.name,
          phone: values.phone,
          role: values.role,
          location: values.location,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If email confirmation is enabled on the Supabase project, there's no
    // session yet — show a "check your inbox" message instead of redirecting.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <span className="text-4xl">📩</span>
        <h1 className="mt-4 text-2xl font-semibold">Check your email</h1>
        <p className="mt-2 text-field-600">
          We&apos;ve sent a confirmation link to <strong>{values.email}</strong>. Confirm your
          email to finish creating your AgriShare account, then log in.
        </p>
        <Link href="/login" className="kl-btn-primary mt-6">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <span className="kl-section-eyebrow text-field-700">Join AgriShare</span>
      <h1 className="mt-2 text-3xl font-semibold">Create your account</h1>
      <p className="mt-2 text-field-600">
        List machinery, find crop residue, and connect with farmers nearby.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="kl-label">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className="kl-input"
            placeholder="e.g. Ramesh Chaudhary"
          />
        </div>

        <div>
          <label htmlFor="email" className="kl-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className="kl-input"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="kl-label">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            required
            value={values.phone}
            onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="kl-input"
            placeholder="10-digit mobile number"
          />
        </div>

        <div>
          <label htmlFor="location" className="kl-label">
            Village / District, State
          </label>
          <input
            id="location"
            type="text"
            required
            value={values.location}
            onChange={(e) => update("location", e.target.value)}
            className="kl-input"
            placeholder="e.g. Kishangarh, Ajmer, Rajasthan"
          />
        </div>

        <div>
          <label htmlFor="role" className="kl-label">
            I am a
          </label>
          <select
            id="role"
            value={values.role}
            onChange={(e) => update("role", e.target.value as UserRole)}
            className="kl-input"
          >
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer / Business</option>
          </select>
        </div>

        <div>
          <label htmlFor="password" className="kl-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={6}
            value={values.password}
            onChange={(e) => update("password", e.target.value)}
            className="kl-input"
            placeholder="At least 6 characters"
          />
        </div>

        <button type="submit" disabled={loading} className="kl-btn-primary w-full">
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-field-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-field-800 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
