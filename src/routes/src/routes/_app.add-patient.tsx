import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "./-guards";
import { AppLayout } from "@/layouts/AppLayout";
import { AddPatientPage } from "@/pages/AddPatientPage";

export const Route = createFileRoute("/src/routes/_app/add-patient")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <AddPatientPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});