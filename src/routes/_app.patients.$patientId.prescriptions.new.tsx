import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import { AddPrescriptionPage } from "@/pages/AddPrescriptionPage";

export const Route = createFileRoute("/_app/patients/$patientId/prescriptions/new")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <AddPrescriptionPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
