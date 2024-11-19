import React from 'react';
import { Button } from "@/components/ui/button"

export const GoogleOAuthButton: React.FC = () => {
  const handleGoogleOAuth = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    // Google認証ページへリダイレクト
    window.location.href = `${backendUrl}/api/auth/google`;
  };
  return(
    <Button onClick={handleGoogleOAuth} variant="outline" className="w-full">
      Continue with Google
    </Button>
  );
};