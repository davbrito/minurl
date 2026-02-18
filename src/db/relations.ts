import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (t) => ({
  links: {
    analytics: t.many.analytics()
  },
  analytics: {
    link: t.one.links()
  }
  // links:( ({ many }) => ({
  //   analytics: many(analytics)
  // }));
  // export const analyticsRelations = relations(analytics, ({ one }) => ({
  //   link: one(links, {
  //     fields: [analytics.slug],
  //     references: [links.slug]
  //   })
  // }));
}));
