"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  allowedRole?: string;
  redirectTo?: string;
};

export default function AuthGuard({
  children,
  allowedRole,
  redirectTo = "/login",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const goLogin = () => {
      const params = new URLSearchParams();
      if (allowedRole) params.set("role", allowedRole);
      params.set("redirect", pathname);
      router.replace(`${redirectTo}?${params.toString()}`);
    };

    const authRaw =
      typeof window !== "undefined" ? localStorage.getItem("auth") : null;
    if (!authRaw) {
      goLogin();
      return;
    }

    try {
      const auth = JSON.parse(authRaw);
      if (allowedRole && auth.role !== allowedRole) {
        // clear stale auth and go to login for the required role
        localStorage.removeItem("auth");
        goLogin();
        return;
      }
      setReady(true);
    } catch (e) {
      localStorage.removeItem("auth");
      goLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!ready) return null;
  return <>{children}</>;
}
