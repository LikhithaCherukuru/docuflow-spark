import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import { NotificationsPage } from "@/pages/NotificationsPage";

export const Route = createFileRoute("/_app/notifications")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <NotificationsPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
