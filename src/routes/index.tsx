import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Brain, Shield, Stethoscope, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/dashboard" });
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-aurora">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Activity className="size-5" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold leading-none">AuraMed</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Smart Hospital AI
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login" search={{ redirect: "/dashboard" }}>
              Sign in
            </Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
          >
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          <Sparkles className="size-3.5 text-primary" /> AI-assisted clinical workflows
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          Hospital management, <span className="text-gradient-primary">reimagined</span> for modern
          clinicians.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          A unified workspace for patient records, smart prescriptions, real-time analytics, and
          AI-driven insights — built for speed, security, and care.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
          >
            <Link to="/signup">
              Create a free account <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login" search={{ redirect: "/dashboard" }}>
              Sign in
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: Stethoscope,
              title: "Clinical-first",
              desc: "Designed with practicing physicians for daily clinical workflows.",
            },
            {
              icon: Brain,
              title: "AI insights",
              desc: "Pattern detection, prescription assistance, anomaly alerts.",
            },
            {
              icon: Shield,
              title: "Secure by design",
              desc: "Encrypted records, role-based access, audit-ready.",
            },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-5 text-left">
              <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </div>
              <p className="font-semibold">{f.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
