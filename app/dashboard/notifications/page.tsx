import { NotificationCenter } from "@/components/features/notifications/notification-center";

export default function NotificationsPage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <NotificationCenter />
    </div>
  );
}
