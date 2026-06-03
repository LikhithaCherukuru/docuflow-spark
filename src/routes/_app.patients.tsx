import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import PatientsPage from "@/pages/PatientsPage";

export const Route = createFileRoute("/_app/patients")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <PatientsPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});
