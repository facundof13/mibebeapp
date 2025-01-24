import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  type ReferenceConfig,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const cascade: ReferenceConfig["actions"] = {
  onDelete: "cascade",
  onUpdate: "cascade",
};

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const baby = pgTable("baby", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  creator_id: text().notNull(),
  date_of_birth: timestamp("date_of_birth").notNull(),
  created_on: timestamp("created_on").defaultNow().notNull(),
  updated_on: timestamp("updated_on")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const babyToEmail = pgTable(
  "baby_user",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    baby_id: integer()
      .references(() => baby.id, cascade)
      .notNull(),
    user_email: text().notNull(),
  },
  (table) => {
    return [index("baby_user_").on(table.id, table.user_email)];
  },
);

export const event = pgTable(
  "event",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    owner_id: text().notNull(),
    started_at: timestamp().notNull().defaultNow(),
    ended_at: timestamp().notNull().defaultNow(),
    baby_id: integer()
      .references(() => baby.id, cascade)
      .notNull(),
  },
  (table) => {
    return [index("event_owner_idx").on(table.id, table.owner_id)];
  },
);

export const feedingUnit = pgEnum("feeding_unit", ["oz", "ml"]);

export const feedingNote = pgTable("feeding_note", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  event_id: integer()
    .references(() => event.id, cascade)
    .notNull()
    .unique(),
  amount: integer().notNull(),
  is_bottle_breast: boolean().notNull().default(false),
  is_bottle_formula: boolean().notNull().default(false),
  is_breast: boolean().notNull().default(false),
});

export const diaperNote = pgTable("diaper_note", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  event_id: integer()
    .references(() => event.id, cascade)
    .notNull()
    .unique(),
  is_dirty: boolean().notNull().default(false),
  is_wet: boolean().notNull().default(false),
});
