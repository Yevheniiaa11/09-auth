"use client";
import Link from "next/link";
import css from "./AuthNavigation.module.css";
import { useAuthStore } from "../../lib/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AuthNavigation = () => {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log("AuthNavigation: isAuthenticated =", isAuthenticated);
    console.log("AuthNavigation: user =", user);
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      clearUser();
      setIsAuthenticated(false);
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return isAuthenticated ? (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>

      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button className={css.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </li>
    </>
  ) : (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
};
