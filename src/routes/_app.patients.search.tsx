import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import { PatientSearchPage } from "@/pages/PatientSearchPage";

export const Route = createFileRoute("/_app/patients/search")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <PatientSearchPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
