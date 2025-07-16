"use client";

import { useRouter } from "next/navigation";
import { login } from "../../../lib/api/clientApi";
import css from "./SignInPage.module.css";
import { useState } from "react";
import axios from "axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login({ email, password });
      if (response.ok) {
        if (response.data && response.data.token) {
          router.push("/notes");
        } else {
          setError(
            "Login succeeded, but no authentication token was received."
          );
        }
      } else {
        setError(
          response.error || "Login failed. Please check your credentials."
        );
      }
    } catch (error: unknown) {
      console.error("Login error (caught):", error);

      if (axios.isAxiosError(error)) {
        const apiErrorMessage = error.response?.data?.message || error.message;
        setError(`API Error: ${apiErrorMessage || "Unknown API error."}`);
      } else if (error instanceof Error) {
        setError(`Application Error: ${error.message}`);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && (
          <div className={css.error}>
            <span>{error}</span>
          </div>
        )}
      </form>
    </main>
  );
};

export default SignIn;
