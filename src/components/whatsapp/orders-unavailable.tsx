import { strings } from "@/content/strings";

/** Shared missing-number state; configuration details are only shown in development. */
export function OrdersUnavailable() {
  return (
    <div className="type-label min-w-0 border border-content p-4">
      <p>{strings["B-SEM-NUMERO"]}</p>
      {process.env.NODE_ENV !== "production" ? (
        <p className="mt-3 wrap-anywhere">{strings["DEV-WHATSAPP"]}</p>
      ) : null}
    </div>
  );
}
