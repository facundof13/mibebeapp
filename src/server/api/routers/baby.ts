import { z } from "zod";

import { createTRPCRouter, authedProcedure } from "~/server/api/trpc";
import { upsertBabySchema } from "~/types/baby";

export const babyRouter = createTRPCRouter({
  getBabyBy: authedProcedure
    .input(
      z
        .object({
          id: z
            .union([z.number().positive(), z.string()])
            .optional()
            .nullable(),
          date: z.date().optional(),
        })
        .optional(),
    )
    .query(
      async ({
        ctx: {
          db,
          session: { user },
        },
        input,
      }) => {
        const whereBabyIdIfIncluded =
          input != null ? { id: Number(input.id) } : undefined;
        const whereDateIfIncluded =
          input?.date != null
            ? {
                started_at: {
                  gte: input.date,
                },
              }
            : undefined;
        return await db.baby.findMany({
          include: {
            baby_user: true,
            event: {
              where: { ...whereDateIfIncluded },
              include: {
                diaper_note: true,
                feeding_note: true,
              },
            },
          },
          where: {
            OR: [
              { creator_id: user.id },
              {
                baby_user: {
                  some: {
                    user_email: user.email,
                    ...(whereBabyIdIfIncluded != null
                      ? { baby_id: whereBabyIdIfIncluded.id }
                      : {}),
                  },
                },
              },
            ],
            ...whereBabyIdIfIncluded,
          },
        });
      },
    ),
  upsertBaby: authedProcedure.input(upsertBabySchema).mutation(
    async ({
      ctx: {
        db,
        session: { user },
      },
      input,
    }) => {
      const { id, validated_users, ...rest } = input;
      const { id: upsertedID } = await db.baby.upsert({
        where: { id: id ?? 0 },
        create: {
          ...rest,
          creator_id: user.id,
        },
        update: rest,
      });

      const validatedUsers = validated_users
        .split("\n")
        .filter((i) => i !== "")
        .map((email) => email.trim());

      // delete from baby_user those users who have a baby ID of above
      // and are not in the list
      await db.baby_user.deleteMany({
        where: {
          user_email: {
            in: validatedUsers,
          },
          baby_id: upsertedID,
        },
      });

      // insert the new users into baby_user
      await db.baby_user.createMany({
        data: validatedUsers.map((user_email) => ({
          user_email,
          baby_id: upsertedID,
        })),
      });

      return upsertedID;
    },
  ),
  deleteBaby: authedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx: { db }, input: id }) => {
      const { id: deletedID } = await db.baby.delete({ where: { id } });
      return deletedID;
    }),
});
