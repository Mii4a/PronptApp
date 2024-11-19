import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User } from 'lucide-react';

// セッションの型定義
interface UserSession {
    user: {
      id: number;
      name: string;
      role?: string;
    };
  }
  

export const Header: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      try {
        const response = await axios.get(`${apiUrl}/api/auth/session`, { withCredentials: true });
        setSession(response.data); // セッションデータを保存
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">AppPromptMarket</Link>
        
        <div className="hidden md:flex items-center space-x-4 flex-grow justify-center">
          <div className="relative">
            <input
              type="search"
              placeholder="Search apps and prompts..."
              className="pl-10 pr-4 py-2 w-64 border rounded"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {session ? (
            <Button variant="ghost" asChild>
              <Link href="/profile">
                <User className="h-5 w-5 mr-2" />
                {session.user.name}
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/login">
                <User className="h-5 w-5 mr-2" />
                Log in
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}