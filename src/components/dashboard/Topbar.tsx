import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu, Moon, Search, Sun, LogOut, User as UserIcon, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications.service";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: notifs } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsService.list,
    refetchOnWindowFocus: false,
  });
  const unread = (notifs || []).filter((n) => !n.read).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = search.trim();
    navigate({
      to: "/patients/search",
      search: { q: q || undefined } as any,
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onMenu}
          className="grid size-10 place-items-center rounded-xl border border-border hover:bg-muted lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        <form onSubmit={onSearch} className="relative hidden flex-1 max-w-xl md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search patients, prescriptions, records..."
            aria-label="Search"
            className="w-full rounded-xl border border-border bg-card pl-10 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
          />
        </form>
        <div className="flex-1 md:hidden" />

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="grid size-10 place-items-center rounded-xl border border-border hover:bg-muted"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            className="relative grid size-10 place-items-center rounded-xl border border-border hover:bg-muted"
          >
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 grid min-w-5 h-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-popover shadow-elevated"
                role="menu"
              >
                <div className="flex items-center justify-between border-b border-border p-3">
                  <p className="text-sm font-semibold">Notifications</p>
                  <Link
                    to="/notifications"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setNotifOpen(false)}
                  >
                    View all
                  </Link>
                </div>
                <ul className="max-h-80 overflow-auto">
                  {(notifs || []).slice(0, 5).map((n) => (
                    <li
                      key={n.id}
                      className={cn(
                        "border-b border-border/60 p-3 text-sm last:border-0",
                        !n.read && "bg-primary/5",
                      )}
                    >
                      <p className="font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                    </li>
                  ))}
                  {(!notifs || notifs.length === 0) && (
                    <li className="p-6 text-center text-sm text-muted-foreground">
                      No notifications
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            aria-label="Profile menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 pl-1.5 pr-3 hover:bg-muted"
          >
            <div className="grid size-7 place-items-center rounded-lg bg-gradient-primary text-xs font-semibold text-primary-foreground">
              {user?.fullName
                ?.split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("") || "DR"}
            </div>
            <span className="hidden text-sm font-medium sm:inline">
              {user?.fullName?.split(" ")[0]}
            </span>
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-popover shadow-elevated"
                role="menu"
              >
                <div className="border-b border-border p-3">
                  <p className="text-sm font-semibold">{user?.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <UserIcon className="size-4 text-muted-foreground" /> Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Settings className="size-4 text-muted-foreground" /> Settings
                </Link>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
