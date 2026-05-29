import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/glass-card";
import { Mail, Phone, Building2, BadgeCheck } from "lucide-react";

export function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Your profile</h1>

      <GlassCard>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="grid size-20 place-items-center rounded-2xl bg-gradient-primary text-2xl font-bold text-primary-foreground shadow-glow">
            {user.fullName
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="font-display text-xl font-bold">{user.fullName}</h2>
              <BadgeCheck className="size-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Practicing physician</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Row icon={Mail} label="Email" value={user.email} />
          <Row icon={Phone} label="Phone" value={user.phone} />
          <Row icon={Building2} label="Hospital" value={user.hospital} />
          <Row icon={BadgeCheck} label="Doctor ID" value={user.id} />
        </div>
      </GlassCard>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3">
      <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
