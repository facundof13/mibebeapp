"use client";

import { use } from "react";
import { api } from "~/trpc/react";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; entryID: string | undefined }>;
}) {
  const { id, entryID } = use(params);
  const { data: baby, status } = api.baby.getBabyBy.useQuery({ id: +id });

  if (status === "error" || status === "pending") {
    return "Not found";
  }
}
