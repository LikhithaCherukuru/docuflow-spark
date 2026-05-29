import { GlassCard } from "@/components/ui/glass-card";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Shield, LogOut } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const { logout } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Settings</h1>

      {/* APPEARANCE */}
      <GlassCard>
        <h3 className="font-semibold">Appearance</h3>

        <p className="text-sm text-muted-foreground">Choose how AuraMed looks on your device.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ThemeOption
            active={theme === "light"}
            icon={Sun}
            label="Light"
            onClick={() => setTheme("light")}
          />

          <ThemeOption
            active={theme === "dark"}
            icon={Moon}
            label="Dark"
            onClick={() => setTheme("dark")}
          />
        </div>
      </GlassCard>

      {/* NOTIFICATIONS */}

      {/*
      <GlassCard>
        <h3 className="font-semibold">
          Notifications
        </h3>

        <p className="text-sm text-muted-foreground">
          Control which alerts reach you.
        </p>

        <div className="mt-4 space-y-3">
          {[
            "Appointment reminders",
            "Lab results",
            "Prescription refills",
            "System announcements",
          ].map((label) => (
            <label
              key={label}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-border/70 bg-card/60 p-3"
            >
              <span className="inline-flex items-center gap-3 text-sm">
                <Bell className="size-4 text-muted-foreground" />
                {label}
              </span>

              <input
                type="checkbox"
                defaultChecked
                className="size-4 rounded border-border text-primary focus:ring-primary"
              />
            </label>
          ))}
        </div>
      </GlassCard>
      */}

      {/* SECURITY */}
      <GlassCard>
        <h3 className="font-semibold">Security</h3>

        <p className="text-sm text-muted-foreground">Manage your session and account access.</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline">
            <Shield className="mr-2 size-4" />
            Change password
          </Button>

          <Button variant="destructive" onClick={logout}>
            <LogOut className="mr-2 size-4" />
            Sign out
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}

function ThemeOption({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
        active
          ? "border-primary bg-primary/5 shadow-glow"
          : "border-border bg-card/60 hover:border-primary/50"
      }`}
    >
      <span
        className={`grid size-10 place-items-center rounded-lg ${
          active ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="size-5" />
      </span>

      <span className="font-medium">{label}</span>
    </button>
  );
}
