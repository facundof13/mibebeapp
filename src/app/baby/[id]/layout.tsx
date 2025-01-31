"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useMemo, useState, type ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/app/_components/ui/breadcrumb";
import Container from "~/app/_components/ui/Container";
import { Separator } from "~/app/_components/ui/separator";
import { LoadingSpinner } from "~/app/_components/ui/spinner";
import { BabyContext } from "~/app/context/BabyContext";
import { api } from "~/trpc/react";

export default function Layout({ children }: { children: ReactNode }) {
  const { id } = useParams();
  const pathname = usePathname();
  const [date, setDate] = useState(new Date());
  if (id == null) {
    return "ID invalid";
  }
  const { data, error, status } = api.baby.getBabyBy.useQuery({
    id: +id,
    date,
  });

  if (error) {
    return `Error loading baby by ID: ${id as string}`;
  }

  if (status === "pending") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <LoadingSpinner /> Loading...
      </div>
    );
  }
  const baby = data?.at(0);

  if (baby == null) {
    return "Baby not found";
  }

  const { name } = baby;
  const isSlashEntryPath = pathname.endsWith("/entry");
  const context = { baby, date, setDate };

  return (
    <BabyContext.Provider value={context}>
      <Container className="gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/baby">Babies</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbLink asChild>
              <Link href={`/baby/${id as string}`}>{name}</Link>
            </BreadcrumbLink>
            {isSlashEntryPath ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbLink asChild>
                  <Link href={`/baby/${id as string}/entry`}>Add Entry</Link>
                </BreadcrumbLink>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>

        <Separator />
        {children}
      </Container>
    </BabyContext.Provider>
  );
}
