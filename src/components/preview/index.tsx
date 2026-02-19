import type { Link } from "@features/shortener/links";
import { Form } from "react-router";
import {
  BarChart3,
  Copy,
  Globe,
  Link2,
  Lock,
  Pencil,
  QrCode,
  Settings,
  Trash2
} from "lucide-react";
import { useState } from "react";

type AnalyticsRow = {
  id: number;
  country: string | null;
  city: string | null;
  browser: string | null;
  device: string | null;
  referer: string | null;
  timestamp: string | number | Date;
};

interface PreviewProps {
  id?: string;
  data: Link | undefined;
  analytics?: AnalyticsRow[];
  shortUrl: string;
}

function toHost(value: string | null) {
  if (!value) return "Direct / Email";
  try {
    return new URL(value).hostname.replace(/^www\./, "") || "Direct / Email";
  } catch {
    return value;
  }
}

function toDisplayName(host: string) {
  if (host === "x.com" || host.includes("twitter")) return "Twitter / X";
  if (host.includes("linkedin")) return "LinkedIn";
  if (host.includes("facebook")) return "Facebook";
  if (host === "Direct / Email") return "Direct / Email";
  return host;
}

function formatDate(value: string | number | Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function Preview({ id, data, shortUrl, analytics }: PreviewProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopySuccess("Copied to clipboard!");
      setTimeout(() => setCopySuccess(null), 2000);
    } catch {
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  if (!id) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 shadow">
        <p>Error: Missing URL id.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 shadow">
        <p>No URL found for id: {id}</p>
      </div>
    );
  }

  const rows = analytics ?? [];
  const totalClicks = data.visitCount ?? rows.length;

  const uniqueVisitors = new Set(
    rows.map((row) =>
      [row.country, row.city, row.browser, row.device].filter(Boolean).join("|")
    )
  ).size;

  const sourceCounts = rows.reduce<Record<string, number>>((acc, row) => {
    const host = toHost(row.referer);
    acc[host] = (acc[host] ?? 0) + 1;
    return acc;
  }, {});

  const locationCounts = rows.reduce<Record<string, number>>((acc, row) => {
    const key = row.country || "Unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const sortedSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const sortedLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const sourceRows: [string, number][] =
    sortedSources.length > 0 ? sortedSources : [["Direct / Email", 0]];

  const locationRows: [string, number][] =
    sortedLocations.length > 0 ? sortedLocations : [["Unknown", 0]];

  const topSource = sortedSources[0];

  const now = new Date();
  const weekdayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const clicksByDay = weekdayKeys.map(() => 0);
  rows.forEach((row) => {
    const date = new Date(row.timestamp);
    const diff = now.getTime() - date.getTime();
    if (diff <= 7 * 24 * 60 * 60 * 1000) {
      const jsDay = date.getDay();
      const idx = jsDay === 0 ? 6 : jsDay - 1;
      clicksByDay[idx] += 1;
    }
  });

  const maxDayClicks = Math.max(...clicksByDay, 1);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <nav className="space-y-1 text-sm">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700"
          >
            <BarChart3 size={14} /> Analytics
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50"
          >
            <QrCode size={14} /> QR Code
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50"
          >
            <Settings size={14} /> Settings
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50"
          >
            <Lock size={14} /> Security
          </button>
        </nav>

        <div className="mt-6 rounded-xl bg-blue-700 p-4 text-white">
          <h3 className="text-sm font-bold">Upgrade to Pro</h3>
          <p className="mt-1 text-xs text-blue-100">
            Get advanced analytics and custom domains.
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-md bg-blue-500 px-3 py-2 text-xs font-semibold"
          >
            Upgrade Now
          </button>
        </div>
      </aside>

      <section className="space-y-5">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-3xl font-extrabold text-slate-900">{id}</h2>
              <p className="text-xs text-slate-500">
                Created on {formatDate(data.createdAt)}
              </p>
              <p className="mt-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Original destination
              </p>
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm break-all text-slate-700 hover:text-blue-600"
              >
                {data.url}
              </a>
              <p className="mt-2 text-xs text-slate-500">
                Short URL: {shortUrl}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={12} /> Edit
              </button>
              <Form method="delete" action={`/minified/${id}`}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </Form>
              <button
                type="button"
                onClick={handleCopy}
                className="grid size-8 place-items-center rounded-md bg-blue-600 text-white"
              >
                <Copy size={12} />
              </button>
              {copySuccess ? (
                <p className="mt-2 text-xs text-green-600">{copySuccess}</p>
              ) : null}
            </div>
          </div>
        </article>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Total Clicks</p>
            <p className="mt-1 text-4xl font-extrabold text-slate-900">
              {totalClicks}
            </p>
            <p className="mt-1 text-xs text-emerald-600">↗ +12.5% this week</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Unique Visitors</p>
            <p className="mt-1 text-4xl font-extrabold text-slate-900">
              {uniqueVisitors}
            </p>
            <p className="mt-1 text-xs text-emerald-600">↗ +5.2% this week</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Top Source</p>
            <p className="mt-1 text-4xl font-extrabold text-slate-900">
              {topSource ? toDisplayName(topSource[0]) : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {topSource
                ? `${Math.round((topSource[1] / Math.max(totalClicks, 1)) * 100)}% of traffic`
                : "No traffic yet"}
            </p>
          </article>
        </div>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              Clicks Over Time
            </h3>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600"
            >
              Last 7 Days
            </button>
          </div>

          <div className="grid h-52 grid-cols-7 items-end gap-3 rounded-lg bg-slate-50 p-4">
            {clicksByDay.map((value, index) => (
              <div
                key={weekdayKeys[index]}
                className="flex h-full flex-col justify-end gap-2"
              >
                <div
                  className="rounded bg-blue-500/80"
                  style={{
                    height: `${Math.max((value / maxDayClicks) * 100, value > 0 ? 8 : 2)}%`
                  }}
                />
                <span className="text-center text-[11px] text-slate-500">
                  {weekdayKeys[index]}
                </span>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-slate-900">
              Top Referrers
            </h3>
            <div className="space-y-3">
              {sourceRows.map(([source, count]) => (
                <div
                  key={source}
                  className="grid grid-cols-[minmax(0,1fr)_80px] items-center gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2 text-sm text-slate-700">
                    <Link2 size={14} className="shrink-0 text-slate-400" />
                    <span className="truncate">{toDisplayName(source)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 grow rounded bg-slate-200">
                      <div
                        className="h-2 rounded bg-blue-600"
                        style={{
                          width: `${Math.max((count / Math.max(totalClicks, 1)) * 100, 8)}%`
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-slate-600">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-slate-900">
              Top Locations
            </h3>
            <div className="space-y-3">
              {locationRows.map(([location, count]) => {
                const pct = Math.round(
                  (count / Math.max(totalClicks, 1)) * 100
                );
                return (
                  <div
                    key={location}
                    className="grid grid-cols-[minmax(0,1fr)_80px] items-center gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-700">
                      <Globe size={14} className="shrink-0 text-slate-400" />
                      <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 grow rounded bg-slate-200">
                        <div
                          className="h-2 rounded bg-indigo-500"
                          style={{ width: `${Math.max(pct, 8)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs text-slate-600">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Preview;
