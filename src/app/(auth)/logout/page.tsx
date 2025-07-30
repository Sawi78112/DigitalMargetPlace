"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/mutations";
import { toast } from "sonner";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        toast.success("Logged out successfully");
        router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
        router.push("/login");
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl">Logging out...</h1>
      </div>
    </div>
  );
}
