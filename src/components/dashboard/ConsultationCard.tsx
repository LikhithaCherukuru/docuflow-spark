import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type ConsultationCardProps = {
  title: string;
  count: number;
  badge: string;
  badgeColor: string;
  onView: () => void;
  loading: boolean;
};

export default function ConsultationCard({
  title,
  count,
  badge,
  badgeColor,
  onView,
  loading,
}: ConsultationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">
          {title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="h-10 w-20 animate-pulse rounded bg-muted" />
        ) : (
          <h2 className="text-4xl font-bold text-primary">
            {count}
          </h2>
        )}
      </div>

      <Button
        className="mt-5 w-full"
        onClick={onView}
      >
        View Patients
      </Button>
    </motion.div>
  );
}