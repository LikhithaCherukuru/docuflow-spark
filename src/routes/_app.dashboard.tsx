import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";

export const Route = createFileRoute("/_app/dashboard")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
