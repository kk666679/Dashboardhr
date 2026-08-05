import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <p className="text-sm font-medium text-muted-foreground">401</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Unauthorized</h1>
      <p className="mt-3 text-muted-foreground">
        You must be signed in to access this resource.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/login"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Sign in
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
