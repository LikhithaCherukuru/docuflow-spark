import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import CreatePrescriptionPage from "@/pages/CreatePrescriptionPage";

export const Route = createFileRoute("/_app/create-prescription")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <CreatePrescriptionPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
