import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { Loader2 } from "lucide-react";

export default function Logout() {
  useEffect(() => {
    const logout = async () => {
      await fine.auth.signOut();
    };
    logout();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4">Logging out...</p>
      </div>
      <Navigate to="/" />
    </div>
  );
}