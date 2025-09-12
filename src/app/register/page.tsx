"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [redirect, setRedirect] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rd = search.get("redirect");
    if (rd) setRedirect(rd);
  }, [search]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName || !email || !password) {
      setError("Please fill all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Mock register then sign-in
    const token = "fake-token";
    const auth = { token, email, role: "teacher", fullName, department, employeeId };
    localStorage.setItem("auth", JSON.stringify(auth));

    if (redirect) router.push(redirect);
    else router.push(`/teacher/dashboard`);
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Register (Teacher)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {error && <p className="text-sm text-red-600">{error}</p>}

              <label className="text-sm">Full name</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />

              <label className="text-sm">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

              <label className="text-sm">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <label className="text-sm">Confirm password</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

              <label className="text-sm">Department</label>
              <Input placeholder="e.g., CSE" value={department} onChange={(e) => setDepartment(e.target.value)} />

              <label className="text-sm">Employee ID</label>
              <Input placeholder="e.g., EMP-123" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />

              <Button type="submit" className="mt-2">Create account</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
