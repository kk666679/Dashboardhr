import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <p className="text-sm font-medium text-muted-foreground">403</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Forbidden</h1>
      <p className="mt-3 text-muted-foreground">
        You do not have permission to access this resource. Contact your
        administrator if you believe this is an error.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/dashboard/help"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
