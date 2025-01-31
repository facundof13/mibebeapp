import { z } from "zod";

export const upsertBabySchema = z.object({
  name: z.string().nonempty("Name must not be empty"),
  date_of_birth: z.date().refine((val) => {
    return val < new Date();
  }, "Date of birth cannot be in the future"),
  id: z.number().positive().optional(),
  validated_users: z.string().refine((val) => {
    if (val === "") {
      return true;
    }
    return val
      .split("\n")
      .filter((i) => i !== "")
      .every((email) => z.string().email().safeParse(email.trim()).success);
  }, "Must be a list of valid emails separated by a new line"),
});
