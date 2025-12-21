"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Root page - redirects to /studio
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/studio");
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Redirecting to Studio...</p>
      </div>
    </div>
  );
}
