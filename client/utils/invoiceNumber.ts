import { invoiceType } from "@/types/types";

export default function getFilteredInvoiceNumber(
  invoice: invoiceType[],
  year: number | string
) {
  return invoice?.filter(
    (invoice) => invoice?.invoiceNumber?.slice(0, 4) === year
  );
}

export function generateInvoiceNumber(invoice: invoiceType[]) {
  return (
    `${invoice[invoice.length - 1]?.invoiceNumber.toString().slice(0, 4)}` +
    (+invoice[invoice.length - 1]?.invoiceNumber.toString().slice(4) + 1)
      .toString()
      .padStart(
        invoice[invoice.length - 1]?.invoiceNumber.toString().slice(4).length,
        "0"
      )
  );
}

export function getLocalStorage(key: string) {
  return typeof window !== "undefined" ? localStorage.getItem(key) : null;
}
