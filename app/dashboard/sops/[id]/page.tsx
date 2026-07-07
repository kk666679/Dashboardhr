export default function SopDetailPage({ params }: { params: { id: string } }) {
  // Placeholder detail page.
  return (
    <div className="w-full p-4">
      <h1 className="text-xl font-semibold">SOP Detail</h1>
      <p className="text-sm opacity-70">ID: {params.id}</p>
    </div>
  );
}

