import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth");
    }
    
    if (!isLoading && user && requireAdmin && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, isLoading, requireAdmin, setLocation]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}