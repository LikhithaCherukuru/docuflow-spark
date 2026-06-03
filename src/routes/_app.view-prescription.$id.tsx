import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import ViewPrescriptionPage from "@/pages/ViewPrescriptionPage";

export const Route = createFileRoute("/_app/view-prescription/$id")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <ViewPrescriptionPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
