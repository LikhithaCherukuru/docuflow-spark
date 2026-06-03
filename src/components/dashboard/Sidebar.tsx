import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  LayoutDashboard,
  UserPlus,
  Search,
  Bell,
  Settings,
  User as UserIcon,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add-patient", label: "Add Patient", icon: UserPlus },
  { to: "/patients/search", label: "Patient Search", icon: Search },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: UserIcon },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { logout, user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
          "transition-opacity",
        )}
        onClick={onClose}
        aria-hidden
      />
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar p-5",
          "transition-transform lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between">
       <Link to="/dashboard" className="flex items-center gap-3">
  <img
    src={logo}
    alt="SmartCure"
    className="h-20 w-20 object-contain shrink-0"
  />

  <div className="leading-tight">
    <p className="font-display text-xl font-bold text-foreground">
      SmartCure
    </p>

    <p className="text-xs font-medium tracking-wide text-muted-foreground">
      Smart Reminders, Healthier Lives
    </p>
  </div>
</Link>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-y-1.5 left-0 w-1 rounded-r bg-primary"
                  />
                )}
                <Icon
                  className={cn("size-4.5", active ? "text-primary" : "text-muted-foreground")}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-3">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
              {user?.fullName
                ?.split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("") || "DR"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.hospital}</p>
            </div>
            <button
              onClick={logout}
              className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
