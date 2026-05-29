import { api } from "@/lib/api";
import type { Patient } from "@/services/patients.service";

export type DashboardAppointment = {
  id: string;
  patient: string;
  time: string;
  reason: string;
  status: string;
};

export type DashboardData = {
  stats: {
    totalPatients: number;
    todaysAppointments: number;
    activePrescriptions: number;
    pendingReminders: number;
  };
  recentPatients: Patient[];
  appointments: DashboardAppointment[];
};

export const dashboardService = {
  async get(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>("/dashboard");
    return data;
  },
};
