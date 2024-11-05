import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">AppPromptMarket</Link>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Input
                type="search"
                placeholder="Search apps and prompts..."
                className="pl-10 pr-4 py-2 w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User account</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to AppPromptMarket</h1>
            <p className="text-xl mb-8">Discover amazing web apps and prompt collections</p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/apps">Explore Apps</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/prompts">Discover Prompts</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <CardHeader>
                    <CardTitle>Featured {item % 2 === 0 ? 'App' : 'Prompt Collection'}</CardTitle>
                    <CardDescription>By Creator Name</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {item % 2 === 0
                        ? 'An amazing web application that solves real-world problems.'
                        : 'A collection of powerful prompts to boost your productivity.'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="font-bold">${(9.99 * item).toFixed(2)}</span>
                    <Button>View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Selling Today</h2>
            <p className="text-xl mb-8">Share your web apps and prompt collections with the world</p>
            <Button asChild size="lg">
              <Link href="/sell">Become a Seller</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AppPromptMarket</h3>
              <p className="text-muted-foreground">Your marketplace for web apps and prompt collections.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4">Stay updated with our latest offerings</p>
              <div className="flex">
                <Input type="email" placeholder="Enter your email" className="rounded-r-none" />
                <Button className="rounded-l-none">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-muted-foreground">
            <p>&copy; 2023 AppPromptMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}