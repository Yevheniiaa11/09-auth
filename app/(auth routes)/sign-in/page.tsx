"use client";

import { useRouter } from "next/navigation";
import { getMe, login, LoginRequest } from "../../../lib/api/clientApi";
import css from "./SignInPage.module.css";
import { useState } from "react";
import { useAuthStore } from "../../../lib/store/authStore";
const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { setIsAuthenticated, setUser } = useAuthStore.getState();

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues: LoginRequest = {
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      };
      await login(formValues);

      setIsAuthenticated(true);
      const user = await getMe();
      setUser(user);
      router.push("/profile");
    } catch (err) {
      console.error("error", err);
      setError("Invalid email or password");
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
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
