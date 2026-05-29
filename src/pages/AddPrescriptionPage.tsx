import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { ArrowLeft, FileText, Pill } from "lucide-react";

import { ErrorState } from "@/components/common/ErrorState";
import { Spinner } from "@/components/common/Spinner";
import { FieldInput } from "@/components/forms/FieldInput";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton-block";
import { patientsService } from "@/services/patients.service";

import { prescriptionSchema, type PrescriptionValues } from "@/validations/schemas";

export function AddPrescriptionPage() {
  const { patientId } = useParams({
    from: "/_app/patients/$patientId/prescriptions/new",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: patient,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientsService.findById(patientId),
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrescriptionValues>({
    resolver: yupResolver(prescriptionSchema),
    mode: "onTouched",
    defaultValues: {
      diagnosis: "",
      medication: "",
      notes: "",
    },
  });

  const onSubmit = async (values: PrescriptionValues) => {
    try {
      const updatedPatient = await patientsService.addPrescription(patientId, values);

      toast.success("Prescription added");

      queryClient.invalidateQueries({
        queryKey: ["patient", patientId],
      });

      queryClient.invalidateQueries({
        queryKey: ["patient-search"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      navigate({
        to: "/patients/search",
        search: {
          q: updatedPatient.mobile,
        } as any,
      });
    } catch (err: any) {
      toast.error(err?.message || "Could not add prescription");
    }
  };

  if (isError) {
    return (
      <ErrorState
        title="Patient not found"
        message={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost" className="px-0">
        <Link to="/patients/search" search={{ q: patient?.mobile } as any}>
          <ArrowLeft className="mr-2 size-4" />
          Back to patient records
        </Link>
      </Button>

      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <FileText className="size-5" />
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Add prescription</h1>

          {isLoading ? (
            <Skeleton className="mt-2 h-5 w-56" />
          ) : (
            <p className="text-sm text-muted-foreground">
              {patient?.name} · {patient?.mobile}
            </p>
          )}
        </div>
      </div>

      <GlassCard>
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Diagnosis */}
          <FieldInput
            label="Diagnosis"
            icon={FileText}
            placeholder="Working diagnosis"
            error={errors.diagnosis?.message}
            {...register("diagnosis")}
          />

          {/* Medication MULTILINE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Medication</label>

            <div className="relative">
              <Pill className="absolute left-3 top-3 size-4 text-muted-foreground" />

              <textarea
                rows={6}
                placeholder={`Penicillin V 500mg - 1 tablet twice daily for 5 days

Paracetamol 650mg - After food if fever

Vitamin C - Once daily`}
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                {...register("medication")}
              />
            </div>

            {errors.medication?.message && (
              <p className="text-sm text-destructive">{errors.medication.message}</p>
            )}
          </div>

          {/* Notes MULTILINE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>

            <textarea
              rows={4}
              placeholder={`Take medicines after food

Drink plenty of water

Follow up after 5 days`}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...register("notes")}
            />

            {errors.notes?.message && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-border/60 pt-5">
            <Button asChild type="button" variant="outline">
              <Link
                to="/patients/search"
                search={
                  {
                    q: patient?.mobile,
                  } as any
                }
              >
                Cancel
              </Link>
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="bg-gradient-primary text-primary-foreground shadow-glow"
            >
              {isSubmitting ? <Spinner /> : "Save prescription"}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
