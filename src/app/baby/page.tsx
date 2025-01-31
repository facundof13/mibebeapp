"use client";

import Link from "next/link";
import { Breadcrumb, BreadcrumbList } from "../_components/ui/breadcrumb";
import Container from "../_components/ui/Container";
import TextPairing from "../_components/ui/TextPairing";
import { Button } from "../_components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Separator } from "../_components/ui/separator";
import { format } from "date-fns";
import { Card, CardHeader } from "../_components/ui/card";
import { Avatar, AvatarFallback } from "../_components/ui/avatar";
import { LoadingSpinner } from "../_components/ui/spinner";
import { api } from "~/trpc/react";

export default function Page() {
  const output = api.baby.getBabyBy.useQuery();
  if (output.isLoading) {
    return <LoadingSpinner />;
  }

  if (output.error || output.data == null) {
    return output.error?.message ?? "Unexpected error";
  }

  return (
    <Container className="gap-3">
      <Breadcrumb>
        <BreadcrumbList></BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-row justify-between">
        <TextPairing label="My babies" sublabel="View your babies here" />
        <Link href="/baby/add">
          <Button variant="outline">
            <PlusCircledIcon />
            Add baby
          </Button>
        </Link>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {(output.data ?? []).map((baby) => {
          const formattedDate = format(baby.date_of_birth, "yyyy");
          return (
            <Link
              key={baby.id}
              href={`/baby/${baby.id}`}
              // params={{ id: String(baby.id) }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{baby.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <TextPairing
                    label={baby.name}
                    sublabel={`Born ${formattedDate}`}
                    sublabelClassName="text-xs"
                  />
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
