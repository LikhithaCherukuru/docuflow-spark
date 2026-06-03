import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import EditPrescriptionPage from "@/pages/EditPrescriptionPage";

export const Route = createFileRoute("/_app/prescriptions/edit/$id")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <EditPrescriptionPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
