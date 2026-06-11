import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import CreatePrescriptionPage from "@/pages/CreatePrescriptionPage";

export const Route = createFileRoute("/_app/create-prescription")({
  validateSearch: (search: Record<string, unknown>) => ({
    mobile: String(search.mobile ?? ""),
  }),

  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <CreatePrescriptionPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});