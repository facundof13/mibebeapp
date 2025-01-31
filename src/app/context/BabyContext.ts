import { createContext } from "react";
import { type RouterOutputs } from "~/trpc/react";

export type Baby = RouterOutputs["baby"]["getBabyBy"][number];
export const BabyContext = createContext<{
  baby: RouterOutputs["baby"]["getBabyBy"][number] | null;
  date: Date;
  setDate: (arg0: Date) => void;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ baby: null, date: new Date(), setDate: () => {} });
