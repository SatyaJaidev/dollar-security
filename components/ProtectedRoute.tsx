"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // 👈 redirect to login if not logged in
    }
  }, [user, router]);

  if (!user) return null; // ⏳ wait until we confirm user

  return <>{children}</>;
};

export default ProtectedRoute;
