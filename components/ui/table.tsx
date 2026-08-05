import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Table wrapper ───────────────────────────────────────────────────────── */
function Table({
  className,
  containerClassName,
  ...props
}: React.HTMLAttributes<HTMLTableElement> & { containerClassName?: string }) {
  return (
    <div
      className={cn(
        "relative w-full overflow-auto",
        "rounded-[var(--radius-lg)] border border-[var(--border)]",
        containerClassName
      )}
    >
      <table
        className={cn(
          "w-full caption-bottom text-sm border-collapse",
          className
        )}
        {...props}
      />
    </div>
  );
}
Table.displayName = "Table";

/* ─── Table Header ────────────────────────────────────────────────────────── */
function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "sticky top-0 z-10",
        "bg-[var(--surface-1)] border-b border-[var(--border)]",
        "[&_tr]:border-0",
        className
      )}
      {...props}
    />
  );
}
TableHeader.displayName = "TableHeader";

/* ─── Table Body ──────────────────────────────────────────────────────────── */
function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn(
        "divide-y divide-[var(--border)]",
        "[&_tr:last-child]:border-0",
        className
      )}
      {...props}
    />
  );
}
TableBody.displayName = "TableBody";

/* ─── Table Footer ────────────────────────────────────────────────────────── */
function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        "border-t border-[var(--border)] bg-[var(--surface-1)]",
        "font-medium text-[var(--foreground-muted)] text-xs",
        "[&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}
TableFooter.displayName = "TableFooter";

/* ─── Table Row ───────────────────────────────────────────────────────────── */
function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "group/row",
        "border-b border-[var(--border)] last:border-0",
        "bg-transparent transition-colors duration-100",
        "hover:bg-[var(--surface-1)]",
        "data-[state=selected]:bg-[var(--brand-muted)]",
        className
      )}
      {...props}
    />
  );
}
TableRow.displayName = "TableRow";

/* ─── Table Head (th) ─────────────────────────────────────────────────────── */
function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle",
        "text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-[0.06em]",
        "whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        "[&:first-child]:pl-5 [&:last-child]:pr-5",
        className
      )}
      {...props}
    />
  );
}
TableHead.displayName = "TableHead";

/* ─── Table Cell (td) ─────────────────────────────────────────────────────── */
function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle text-sm",
        "text-[var(--foreground)]",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        "[&:first-child]:pl-5 [&:last-child]:pr-5",
        className
      )}
      {...props}
    />
  );
}
TableCell.displayName = "TableCell";

/* ─── Table Caption ───────────────────────────────────────────────────────── */
function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn(
        "py-3 text-xs text-[var(--foreground-subtle)]",
        className
      )}
      {...props}
    />
  );
}
TableCaption.displayName = "TableCaption";

/* ─── Table Empty State ───────────────────────────────────────────────────── */
function TableEmpty({
  colSpan = 100,
  children,
  className,
}: {
  colSpan?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn(
          "py-16 text-center text-sm text-[var(--foreground-muted)]",
          className
        )}
      >
        {children}
      </td>
    </tr>
  );
}
TableEmpty.displayName = "TableEmpty";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmpty,
};
