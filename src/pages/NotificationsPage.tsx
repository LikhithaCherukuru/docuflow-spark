import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications.service";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton-block";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function NotificationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsService.list,
  });

  const markAll = async () => {
    await notificationsService.markAllRead();
    qc.invalidateQueries({ queryKey: ["notifications"] });
    toast.success("All notifications marked as read");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay on top of your patient and system alerts.
          </p>
        </div>
        <Button variant="outline" onClick={markAll}>
          <CheckCheck className="mr-2 size-4" /> Mark all read
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="No new notifications right now."
        />
      ) : (
        <GlassCard className="p-0">
          <ul className="divide-y divide-border">
            {data.map((n) => {
              const Icon =
                n.type === "success" ? CheckCircle2 : n.type === "warning" ? AlertCircle : Info;
              return (
                <li
                  key={n.id}
                  className={cn("flex items-start gap-4 p-4", !n.read && "bg-primary/5")}
                >
                  <div
                    className={cn(
                      "grid size-10 place-items-center rounded-xl",
                      n.type === "success"
                        ? "bg-success/15 text-success"
                        : n.type === "warning"
                          ? "bg-warning/15 text-warning"
                          : "bg-primary/15 text-primary",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{n.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(n.time).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
