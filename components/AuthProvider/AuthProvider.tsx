"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../lib/store/authStore";
import { getMe } from "../../lib/api/clientApi";
import { AxiosError } from "axios";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setUser(user);
        setIsAuthenticated(true);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          await fetch("/auth/refresh");
          try {
            const user = await getMe();
            setUser(user);
            setIsAuthenticated(true);
          } catch {
            clearUser();
            setIsAuthenticated(false);
          }
        } else {
          clearUser();
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setUser, clearUser, setIsAuthenticated, setIsLoading]);

  return <>{children}</>;
};

export default AuthProvider;
