import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (t) => ({
  links: {
    analytics: t.many.analytics()
  },
  analytics: {
    link: t.one.links({
      from: t.analytics.slug,
      to: t.links.slug,
      optional: false
    })
  }
}));
