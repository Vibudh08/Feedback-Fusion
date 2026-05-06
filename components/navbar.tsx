
import Link from "next/link";
import { Sparkle, MessageSquare, Map, Shield } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";
import { syncCurrentUser } from "@/lib/sync-user";
import MobileNavMenu from "./mobile-nav-menu";

const Navbar = async() => {
  const user = await syncCurrentUser();
  return (
    <header className="border-b">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-r from-blue-500 to-purple-500">
                <Sparkle className="h-4 w-4 text-white" />
              </div>
              <span className="truncate text-lg font-bold sm:text-xl">
                Feedback Fusion
              </span>
            </div>
          </Link>

          <Link
            href="/roadmap"
            className="hidden text-sm hover:text-primary sm:flex items-center gap-1"
          >
            <Map className="h-4 w-4" />
            Roadmap
          </Link>

          <Link
            href="/feedback"
            className="hidden text-sm hover:text-primary sm:flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Link>

          {user?.role == "admin" && (
            <Link
              href="/admin"
              className="hidden text-sm hover:text-primary sm:flex items-center gap-1"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-4">
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
          <MobileNavMenu isAdmin={user?.role == "admin"} />
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
