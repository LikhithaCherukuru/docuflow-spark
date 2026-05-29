import { useMemo, useState, useEffect } from "react";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { patientsService, type Patient } from "@/services/patients.service";
import { useDebounce } from "@/hooks/useDebounce";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton-block";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { FieldInput } from "@/components/forms/FieldInput";
import { Button } from "@/components/ui/button";
import {
  Search,
  PhoneCall,
  Activity,
  Droplets,
  Weight,
  Ruler,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const PAGE_SIZE = 5;

export function PatientSearchPage() {
  const navigate = useNavigate();
  const search = useSearch({
    from: "/_app/patients/search",
  }) as { q?: string };

  const [query, setQuery] = useState(search.q || "");

  const debounced = useDebounce(query.trim(), 350);

  useEffect(() => {
    navigate({
      to: "/patients/search",
      search: {
        q: debounced || undefined,
      },
      replace: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const enabled = debounced.length >= 2;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["patient-search", debounced],
    queryFn: () => patientsService.search(debounced),
    enabled,
    retry: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Patient search</h1>

        <p className="text-sm text-muted-foreground">
          Find patients by name, mobile number, diagnosis, symptoms, or prescription history.
        </p>
      </div>

      <GlassCard>
        <FieldInput
          label="Search patients and records"
          icon={Search}
          placeholder="Search name, mobile, diagnosis, prescriptions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          hint={
            !enabled
              ? "Enter at least 2 characters to search"
              : isFetching
                ? "Searching..."
                : undefined
          }
        />
      </GlassCard>

      {!enabled && (
        <EmptyState
          icon={Search}
          title="Start typing to search"
          description="Patient records load as you type."
        />
      )}

      {enabled && isLoading && <PatientSkeleton />}

      {enabled && isError && (
        <ErrorState
          title="Search failed"
          message={
            error instanceof Error ? error.message : "We couldn't search patient records right now."
          }
          onRetry={() => refetch()}
        />
      )}

      {enabled && data && data.length === 0 && (
        <EmptyState
          icon={Search}
          title="No patients found"
          description="Try a different name, mobile number, diagnosis, or prescription term."
        />
      )}

      {enabled && data && data.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {data.length} matching {data.length === 1 ? "record" : "records"}
          </p>

          {data.map((patient) => (
            <PatientDetails key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
}

function PatientSkeleton() {
  return (
    <div className="space-y-4">
      <GlassCard>
        <Skeleton className="h-28 w-full" />
      </GlassCard>

      <GlassCard>
        <Skeleton className="h-40 w-full" />
      </GlassCard>
    </div>
  );
}

function PatientDetails({ patient }: { patient: Patient }) {
  const [page, setPage] = useState(1);

  const pages = Math.max(1, Math.ceil(patient.prescriptions.length / PAGE_SIZE));

  const slice = useMemo(
    () => patient.prescriptions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [patient, page],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <GlassCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-gradient-primary text-lg font-semibold text-primary-foreground shadow-glow">
              {patient.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">{patient.name}</h2>

              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <PhoneCall className="size-3.5" />
                  {patient.mobile}
                </span>

                <span>•</span>

                <span>
                  {patient.age} yrs · {patient.gender}
                </span>

                <span>•</span>

                <span>Blood {patient.bloodGroup}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link
                to="/patients/$patientId/prescriptions/new"
                params={{
                  patientId: patient.id,
                }}
              >
                <FileText className="mr-2 size-4" />
                New prescription
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Vital icon={Activity} label="Blood pressure" value={patient.bp} accent="text-chart-1" />

          <Vital
            icon={Droplets}
            label="Sugar"
            value={`${patient.sugar} mg/dL`}
            accent="text-chart-3"
          />

          <Vital icon={Weight} label="Weight" value={patient.weight} accent="text-chart-2" />

          <Vital icon={Ruler} label="Height" value={patient.height} accent="text-chart-4" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Info label="Symptoms" value={patient.symptoms} />

          <Info label="Diagnosis" value={patient.diagnosis} />

          <Info label="Allergies" value={patient.allergies} />
        </div>
      </GlassCard>

      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Prescription history</h3>

            <p className="text-xs text-muted-foreground">
              {patient.prescriptions.length} records on file
            </p>
          </div>
        </div>

        {patient.prescriptions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No prescriptions yet"
            description="When this patient receives a prescription, it will appear here."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Date</th>

                    <th className="py-2 pr-3 font-medium">Diagnosis</th>

                    <th className="py-2 pr-3 font-medium">Medication</th>

                    <th className="py-2 pr-3 font-medium">Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {slice.map((rx) => (
                    <tr
                      key={rx.id}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/40"
                    >
                      <td className="py-3 pr-3">{new Date(rx.date).toLocaleDateString()}</td>

                      <td className="py-3 pr-3">{rx.diagnosis}</td>

                      <td className="whitespace-pre-line py-3 pr-3">{rx.medication}</td>

                      <td className="py-3 pr-3 text-muted-foreground">{rx.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pages > 1 && (
              <nav className="mt-4 flex items-center justify-end gap-2" aria-label="Pagination">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="size-4" />
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page {page} of {pages}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </nav>
            )}
          </>
        )}
      </GlassCard>
    </motion.div>
  );
}

function Vital({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-3">
      <div
        className={`mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-muted ${accent}`}
      >
        <Icon className="size-4" />
      </div>

      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>

      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
