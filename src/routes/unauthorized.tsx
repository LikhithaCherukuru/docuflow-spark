import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unauthorized")({
  component: () => (
    <div className="grid min-h-screen place-items-center bg-aurora px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center shadow-elevated">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldOff className="size-7" />
        </div>
        <h1 className="font-display text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have permission to view this page. If you think this is a mistake, contact your
          administrator.
        </p>
        <Button asChild className="mt-6 bg-gradient-primary text-primary-foreground shadow-glow">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  ),
});
