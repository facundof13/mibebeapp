"use client";

import clsx from "clsx";
import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { SignedIn, SignedOut } from "./Auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "~/app/_components/ui/button";
import Link from "next/link";
import { ModeToggle } from "./ui/mode-toggle";
import { usePathname } from "next/navigation";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <div className="flex flex-row justify-between border-b p-2">
        {/* left */}
        <div className="flex flex-row items-center gap-2">
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="sm:hidden"
              onClick={() => setIsOpen(true)}
            >
              <HamburgerMenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>
                <div className="flex flex-row items-center justify-start">
                  Mi bebe
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="flex w-full flex-col items-center justify-center">
              <Buttons setIsOpen={setIsOpen} />
            </div>
          </SheetContent>
          <div className="hidden sm:block">Mi bebe</div>
        </div>
        {/* center */}
        <div className="hidden gap-1 sm:flex">
          <Buttons setIsOpen={setIsOpen} />
        </div>
        <div className="flex items-center justify-center sm:hidden">
          Mi bebe
        </div>
        {/* right */}
        <div className="flex gap-1">
          <a href="https://github.com/facundof13/mibebeapp" target="_blank">
            <Button variant="ghost" size="icon">
              <GitHubLogoIcon />
            </Button>
          </a>
          <ModeToggle />
        </div>
      </div>
    </Sheet>
  );
}

function NavButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="link"
      className={clsx({ underline: isActive })}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function Buttons({ setIsOpen }: { setIsOpen: (arg0: boolean) => void }) {
  const closeSheet = () => setIsOpen(false);
  const pathname = usePathname();
  const router = useRouter();
  const signOut = async () => {
    closeSheet();
    await authClient.signOut();
    router.push("/");
  };

  return (
    <>
      <Link href="/">
        <NavButton
          label="Home"
          isActive={pathname === "/"}
          onClick={closeSheet}
        />
      </Link>
      <SignedOut>
        <Link href="/login">
          <NavButton
            label="Login"
            isActive={pathname === "/login"}
            onClick={closeSheet}
          />
        </Link>
      </SignedOut>
      <SignedIn>
        <Link href="/baby">
          <NavButton
            label="My Entries"
            isActive={pathname === "/baby"}
            onClick={closeSheet}
          />
        </Link>

        <NavButton label="Sign Out" onClick={signOut} />
      </SignedIn>
    </>
  );
}
