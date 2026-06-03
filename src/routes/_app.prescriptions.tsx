import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import PrescriptionListPage from "@/pages/PrescriptionListPage";

export const Route = createFileRoute("/_app/prescriptions")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <PrescriptionListPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
