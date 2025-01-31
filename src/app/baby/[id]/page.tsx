"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import Link from "next/link";
import { useContext } from "react";
import { Button } from "~/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "~/app/_components/ui/card";
import TextPairing from "~/app/_components/ui/TextPairing";
import { Baby, BabyContext } from "~/app/context/BabyContext";
import { RouterOutputs } from "~/trpc/react";

export default function Page({
  params: _params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { baby, date, setDate } = useContext(BabyContext);

  if (baby == null) {
    return "Baby Not Found";
  }

  const { name, id, event: events } = baby;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <TextPairing label={name} />
        <Link href={`/baby/${id}/entry`}>
          <Button variant="outline">
            <PlusCircledIcon /> Add Entry
          </Button>
        </Link>
      </div>
      <div className="my-10 flex flex-row items-center justify-center gap-3">
        <ArrowLeftIcon />
        {format(new Date(), "MMMM do, yyyy")}
        <ArrowRightIcon />
      </div>
      <EventCards events={events} />
    </div>
  );
}

function EventCards({ events }: { events: Baby["event"] }) {
  const { wet: wetCount, dirty: dirtyCount } = events
    .filter((e) => e.diaper_note != null)
    .reduce(
      (prev, curr) => ({
        wet: prev.wet + Number(curr?.diaper_note?.is_wet ?? false),
        dirty: prev.dirty + Number(curr?.diaper_note?.is_dirty ?? false),
      }),
      { wet: 0, dirty: 0 },
    );

  return (
    <div className="grid sm:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="text-lg">Diapers</div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div>{wetCount} wet diapers</div>
            <div>{dirtyCount} dirty diapers</div>{" "}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
