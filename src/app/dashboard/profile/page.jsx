"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/api/admin") // make sure this endpoint returns { email, password }
      .then((res) => res.json())
      .then((data) => {
        if (data?.email) setEmail(data.email);
        if (data?.password) setPassword(data.password);
      })
      .catch((err) => console.error("Failed to fetch admin data:", err));
  }, []);

  const handleUpdate = async () => {
    const res = await fetch("/api/admin/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      toast.success("✅ Profile updated successfully!");
    } else {
      toast.error("⚠ Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex justify-center items-start py-20 ">
      <Card className="w-full max-w-md shadow-lg rounded-xl mt-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-gray-800">Admin Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex flex-col">
            <Label>Password</Label>
            <Input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
            onClick={handleUpdate}
          >
            Update Profile
          </Button>

          {/* Logout Button */}
          <div className="flex md:hidden justify-center mt-4">
            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-red-500 hover:text-red-600"
            >
              <LogOut size={22} />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
