import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: ReactNode;
  /** require admin or owner role */
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: Props) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && requireAdmin && user && !isAdmin) {
      toast.error("Akses ditolak. Halaman ini hanya untuk Admin/Owner.");
    }
  }, [isLoading, requireAdmin, user, isAdmin]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-24 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <ShieldAlert className="h-14 w-14 mx-auto mb-4 text-destructive" />
        <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
        <p className="text-muted-foreground">
          Halaman ini hanya dapat diakses oleh Admin atau Owner.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;