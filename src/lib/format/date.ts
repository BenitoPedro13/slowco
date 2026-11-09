// D-DATA format (docs/05-CONTENT.md §3, docs/01-BRAND-BOOK.md rule 9), always in Rio's time zone:
// "domingo, 24/08/2025, às 00h" or "sábado, 20/12/2025, às 18h30".

const TZ = "America/Sao_Paulo";

const parts = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TZ,
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatDropDate(iso: string): string {
  const p = Object.fromEntries(parts.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  const time = p.minute === "00" ? `${p.hour}h` : `${p.hour}h${p.minute}`;
  return `${p.weekday}, ${p.day}/${p.month}/${p.year}, às ${time}`;
}

/** Remaining time split for the countdown (D-CONTAGEM). Negative → zeros. */
export function splitRemaining(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}
