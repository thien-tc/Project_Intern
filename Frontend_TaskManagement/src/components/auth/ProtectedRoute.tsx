import { se } from "date-fns/locale";
import type { ReactNode } from "react";
import { use, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    //check authentication status
    const token = localStorage.getItem('token');
    const authStatus = localStorage.getItem('isAuthenticated');

    setIsAuthenticated(!!token && authStatus === 'true');

  }, []);
  // show loading while checking auth status
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mx-auto mb-4">
            TM
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  // Redirect to landing page if not aithenticated
  if(!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
