export default function DashboardSopsPage() {
  // MVP: list page not yet wired to backend.
  // Return a minimal placeholder to avoid Next.js import/type issues in this environment.
  return (
    <div className="w-full p-4">
      <h1 className="text-xl font-semibold">SOPs</h1>
      <p className="text-sm opacity-70">SOP list is not wired yet. Use the SOP wizard to create a new draft.</p>
      <a className="text-sm text-blue-600 underline" href="/dashboard/sops/new">
        Go to SOP wizard
      </a>
    </div>
  );
}

