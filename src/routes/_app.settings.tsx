import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import { SettingsPage } from "@/pages/SettingsPage";

export const Route = createFileRoute("/_app/settings")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <SettingsPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
