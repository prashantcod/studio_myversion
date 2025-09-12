"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    const rd = search.get("redirect");
    if (rd) setRedirect(rd);
  }, [search]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = "fake-token";
    const auth = { token, email, role: "teacher" };
    localStorage.setItem("auth", JSON.stringify(auth));
    if (redirect) router.push(redirect);
    else router.push(`/teacher/dashboard`);
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="text-sm">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              <label className="text-sm">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <Button type="submit" className="mt-4">Sign in</Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link className="underline" href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}>Register</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
