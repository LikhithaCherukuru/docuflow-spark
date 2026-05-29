import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService, type DashboardAppointment } from "@/services/dashboard.service";
import type { Patient } from "@/services/patients.service";

import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton-block";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";

import {
  Activity,
  CalendarDays,
  FileText,
  BellRing,
  UserPlus,
  Search,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const statMeta = [
  {
    key: "totalPatients",
    label: "Total Patients",
    icon: Activity,
    accent: "from-primary to-primary-glow",
  },
  {
    key: "todaysAppointments",
    label: "Today's Appointments",
    icon: CalendarDays,
    accent: "from-chart-2 to-success",
  },
  {
    key: "activePrescriptions",
    label: "Active Prescriptions",
    icon: FileText,
    accent: "from-chart-3 to-warning",
  },
  {
    key: "pendingReminders",
    label: "Pending Reminders",
    icon: BellRing,
    accent: "from-chart-4 to-chart-5",
  },
] as const;

export function DashboardPage() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.get,
  });

  const filteredPatients = useMemo(() => {
    if (!data?.recentPatients) return [];

    if (!search.trim()) {
      return data.recentPatients;
    }

    return data.recentPatients.filter((p: Patient) => p.mobile?.includes(search.trim()));
  }, [data?.recentPatients, search]);

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Failed to load dashboard"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Overview</p>

          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Good {greeting()},{user?.fullName ? ` ${user.fullName}` : ""}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/patients/search">
              <Search className="mr-2 size-4" />
              Find patient
            </Link>
          </Button>

          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Link to="/patients/new">
              <UserPlus className="mr-2 size-4" />
              Add patient
            </Link>
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statMeta.map((m, i) => {
          const Icon = m.icon;

          const stat = data?.stats?.[m.key] ?? 0;

          return (
            <GlassCard key={m.key} delay={i * 0.05} className="relative overflow-hidden">
              <div
                className={`pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br ${m.accent} opacity-20 blur-2xl`}
              />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </p>

                  {isLoading ? (
                    <Skeleton className="mt-3 h-8 w-20" />
                  ) : (
                    <p className="mt-2 font-display text-3xl font-bold">{stat}</p>
                  )}
                </div>

                <div
                  className={`grid size-11 place-items-center rounded-xl bg-gradient-to-br ${m.accent} text-primary-foreground shadow-glow`}
                >
                  <Icon className="size-5" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* RECENT PATIENTS */}
      <GlassCard>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Recent patients</h3>

            <p className="text-xs text-muted-foreground">Search patients using mobile number</p>
          </div>

          <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-border bg-card/60 px-3">
            <Search className="size-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search by mobile number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Patient</th>

                <th className="py-2 pr-3 font-medium">Age</th>

                <th className="py-2 pr-3 font-medium">Diagnosis</th>

                <th className="py-2 pr-3 font-medium">BP</th>

                <th className="py-2 pr-3 font-medium">Sugar</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td colSpan={5} className="py-3">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((p: Patient) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/40"
                  >
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                          {p.name
                            ?.split(" ")
                            ?.map((s) => s[0])
                            ?.slice(0, 2)
                            ?.join("")}
                        </div>

                        <div>
                          <p className="font-medium">{p.name}</p>

                          <p className="text-xs text-muted-foreground">{p.mobile}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 pr-3">{p.age}</td>

                    <td className="py-3 pr-3">{p.diagnosis}</td>

                    <td className="py-3 pr-3">{p.bp}</td>

                    <td className="py-3 pr-3">{p.sugar}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted-foreground">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* APPOINTMENTS */}
      <GlassCard>
        <div className="mb-4">
          <h3 className="font-semibold">Today's appointments</h3>

          <p className="text-xs text-muted-foreground">Live appointments from database</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : (data?.appointments?.length ?? 0) > 0 ? (
            data?.appointments.map((a: DashboardAppointment) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3"
              >
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Stethoscope className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.patient}</p>

                  <p className="truncate text-xs text-muted-foreground">{a.reason}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold">{a.time}</p>

                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      a.status === "confirmed"
                        ? "bg-success/15 text-success"
                        : a.status === "pending"
                          ? "bg-warning/15 text-warning"
                          : "bg-primary/15 text-primary"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-10 text-center text-sm text-muted-foreground">
              No appointments found
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();

  if (h < 12) return "morning";

  if (h < 18) return "afternoon";

  return "evening";
}
