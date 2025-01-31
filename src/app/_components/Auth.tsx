import { authClient } from "~/lib/auth-client";
import { type ReactNode } from "react";

export function SignedIn({ children }: { children: ReactNode }) {
  const session = authClient.useSession();
  if (session.isPending || session.error || session?.data?.user == null) {
    return null;
  }
  return children;
}

export function SignedOut({ children }: { children: ReactNode }) {
  const session = authClient.useSession();

  if (!session.isPending && session.error == null && session.data == null) {
    return children;
  }

  return null;
}
