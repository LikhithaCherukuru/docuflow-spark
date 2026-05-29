import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import { ProfilePage } from "@/pages/ProfilePage";

export const Route = createFileRoute("/_app/profile")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <ProfilePage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
