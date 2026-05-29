import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Activity, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { loginSchema, type LoginValues } from "@/validations/schemas";
import { FieldInput } from "@/components/forms/FieldInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/Spinner";
import { PublicOnlyRoute } from "./-guards";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: (s.redirect as string) || "/dashboard",
  }),
  component: () => (
    <PublicOnlyRoute>
      <LoginPage />
    </PublicOnlyRoute>
  ),
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values.email, values.password, values.remember);
      toast.success("Welcome back!");
      navigate({ to: redirect || "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    }
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-aurora lg:flex">
        <div className="relative z-10 m-auto max-w-md p-12">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Activity className="size-5" />
            </span>
            <p className="font-display text-xl font-semibold">AuraMed</p>
          </Link>
          <h2 className="mt-12 font-display text-4xl font-bold tracking-tight">
            Care that's <span className="text-gradient-primary">faster, sharper, kinder.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sign in to your AuraMed workspace — patients, prescriptions, and insights in one place.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { k: "10×", v: "Faster intake" },
              { k: "99.9%", v: "Uptime" },
              { k: "HIPAA", v: "Aligned" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-2xl p-4 text-center">
                <p className="font-display text-2xl font-bold text-gradient-primary">{s.k}</p>
                <p className="text-xs text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back. Please enter your details.
            </p>
          </div>

          <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldInput
              label="Doctor email"
              type="email"
              autoComplete="email"
              placeholder="you@hospital.com"
              icon={Mail}
              error={errors.email?.message}
              {...register("email")}
            />
            <FieldInput
              label="Password"
              type="password"
              passwordToggle
              autoComplete="current-password"
              placeholder="At least 8 characters"
              icon={Lock}
              error={errors.password?.message}
              {...register("password")}
            />
            <div className="flex items-center justify-between">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 rounded border-border text-primary focus:ring-primary"
                  {...register("remember")}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => toast.info("Password reset email sent if account exists.")}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
            >
              {isSubmitting ? <Spinner /> : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to AuraMed?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
