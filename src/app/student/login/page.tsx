
'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useDataStore } from '@/lib/data-store';
import { useRouter } from 'next/navigation';

export default function StudentLoginPage() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerRollNumber, setRegisterRollNumber] = useState('');
    const { toast } = useToast();
    const { addStudentToGroup } = useDataStore();
    const router = useRouter();


    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login - in a real app, you'd validate against a database
        if (loginEmail && loginPassword) {
            toast({
                title: "Login Successful",
                description: "Redirecting to your dashboard...",
            });
            router.push('/student/dashboard');
        } else {
            toast({
                variant: 'destructive',
                title: "Login Failed",
                description: "Please enter your email and password.",
            });
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (registerName && registerEmail && registerPassword && registerRollNumber) {
            
            const newStudent = {
                name: registerName,
                rollNumber: registerRollNumber,
            };

            // Add student to the first group for demo purposes
            addStudentToGroup('CSE_YEAR_1', newStudent);

            toast({
                title: "Registration Successful",
                description: "You can now log in with your new account.",
            });
            
            // For demo purposes, redirect to dashboard. In a real app you might want to auto-login.
            router.push('/student/dashboard');
        } else {
             toast({
                variant: 'destructive',
                title: "Registration Failed",
                description: "Please fill out all fields.",
            });
        }
    };

  return (
     <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <Card>
              <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="student@university.edu" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Sign In</Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={handleRegister}>
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Create a new student account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input id="register-name" placeholder="John Smith" value={registerName} onChange={e => setRegisterName(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="register-roll">Roll Number</Label>
                  <Input id="register-roll" placeholder="e.g. CSE1Y021" value={registerRollNumber} onChange={e => setRegisterRollNumber(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" placeholder="john.smith@university.edu" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input id="register-password" type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Create Account</Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
