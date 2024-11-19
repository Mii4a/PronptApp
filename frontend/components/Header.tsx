import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User } from 'lucide-react';

interface HeaderProps {
  user: { id:number; name:string } | null;
}

export default function Header({ user }: HeaderProps) {
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

          {user ? (
            <Button variant="ghost" asChild>
              <Link href="/profile">
                <User className="h-5 w-5 mr-2" />
                {user.name}
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
