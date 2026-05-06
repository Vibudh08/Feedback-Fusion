
import Link from "next/link";
import { Sparkle, MessageSquare, Map, Shield } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";
import { syncCurrentUser } from "@/lib/sync-user";

const Navbar = async() => {
  const user = await syncCurrentUser();
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 ">
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkle className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">Feedback Fusion</span>
            </div>
          </Link>

          <Link
            href="/roadmap"
            className="text-sm hover:text-primary flex items-center gap-1"
          >
            <Map className="h-4 w-4" />
            Roadmap
          </Link>

          <Link
            href="/feedback"
            className="text-sm hover:text-primary flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Link>

          {user?.role == "admin" && (
            <Link
              href="/admin"
              className="text-sm hover:text-primary flex items-center gap-1"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
