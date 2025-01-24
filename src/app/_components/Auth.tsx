import { authClient } from "~/app/lib/auth";
import { type ReactNode } from "react";

export function SignedIn({ children }: { children: ReactNode }) {
  const session = authClient.useSession();
  if (session.isPending || session.error || !session?.data?.user == null) {
    return null;
  }
  return children;
}

export function SignedOut({ children }: { children: ReactNode }) {
  return children;
}

export function SignOutButton() {
  return <div></div>;
}
