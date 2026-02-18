import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// TABLA PRINCIPAL: Enlaces
// Optimizada para lecturas rápidas (Redirección)
export const links = sqliteTable("links", {
  // El slug es la Primary Key.
  // Búsqueda O(1) inmediata. Ejemplo: 'mi-link'
  slug: text("slug").primaryKey(),

  // La URL de destino. No puede ser nula.
  url: text("url").notNull(),

  // Metadatos útiles
  description: text("description"), // Opcional: para tu dashboard

  // Contador simple (Caché de conteo)
  // Incrementamos esto +1 en cada visita para no tener que hacer
  // un COUNT(*) costoso en la tabla de analytics cada vez.
  visitCount: integer("visit_count").default(0).notNull(),

  // Fechas (SQLite usa unix epoch para timestamps)
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),

  lastClickedAt: integer("last_clicked_at", { mode: "timestamp" })
});

// TABLA SECUNDARIA: Analíticas (Logs)
// Optimizada para escritura (Insert Only)
export const analytics = sqliteTable(
  "analytics",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    // Relación con el link
    slug: text("slug")
      .notNull()
      .references(() => links.slug, { onDelete: "cascade" }),

    // Datos del visitante (Cloudflare te da esto en los headers)
    country: text("country"), // Header: cf-ipcountry
    city: text("city"), // Header: cf-ipcity
    device: text("device"), // User-Agent parseado (Mobile/Desktop)
    browser: text("browser"), // Chrome, Safari, etc.
    referer: text("referer"), // De dónde viene (Twitter, LinkedIn)

    // Fecha exacta del click
    timestamp: integer("timestamp", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull()
  },
  (table) => [
    // ÍNDICES: Vitales para que tus gráficas carguen rápido
    index("analytics_slug_idx").on(table.slug), // "Dame todos los clicks de este link"
    index("analytics_time_idx").on(table.timestamp) // "Dame los clicks de la última semana"
  ]
);
