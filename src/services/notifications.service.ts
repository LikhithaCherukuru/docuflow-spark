import { api } from "@/lib/api";

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
};

export const notificationsService = {
  async list(): Promise<Notification[]> {
    const { data } = await api.get<{ notifications: Notification[] }>("/notifications");
    return data.notifications;
  },
  async markAllRead() {
    await api.post("/notifications/read-all");
  },
};
