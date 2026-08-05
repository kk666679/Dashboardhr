"use client";

import Image from "next/image";

export default function LiveTrackingDisplay() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-600 text-white">
          <h2 className="text-xl font-semibold">Live Worker Tracking</h2>
          <p className="text-blue-100">Real-time location monitoring</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="relative aspect-video">
            <Image
              src="https://2cadwi9oq4lsp8bt.public.blob.vercel-storage.com/de6784b3-1078-4ac1-914a-cf3d81761799-8OG6i9TrWTC1GQV0A291wPXGVHhAbf.jpg"
              alt="Live Worker Tracking Map View 1"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <div className="relative aspect-video">
            <Image
              src="https://2cadwi9oq4lsp8bt.public.blob.vercel-storage.com/8cc0ac95-7680-438e-8c12-759676818e1c-Mg5jS7DmZGw71g3Py4ZfKI53WM3SDx.jpg"
              alt="Live Worker Tracking Map View 2"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>🟢 Active Workers: 12</span>
            <span>📍 Locations Updated: Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
