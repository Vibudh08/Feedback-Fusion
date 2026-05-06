"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, MessageSquare, Map, Shield } from "lucide-react";

interface MobileNavMenuProps {
  isAdmin: boolean;
}

export default function MobileNavMenu({ isAdmin }: MobileNavMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-50 w-40 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md">
          <Link
            href="/roadmap"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Map className="h-4 w-4" />
            Roadmap
          </Link>
          <Link
            href="/feedback"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
