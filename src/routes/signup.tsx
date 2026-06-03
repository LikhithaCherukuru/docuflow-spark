import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Activity, Building2, Lock, Mail, Phone, UserRound } from "lucide-react";
import { signupSchema, type SignupValues } from "@/validations/schemas";
import { FieldInput } from "@/components/forms/FieldInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/Spinner";
import { PublicOnlyRoute } from "./-guards";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/signup")({
  component: () => (
    <PublicOnlyRoute>
      <SignupPage />
    </PublicOnlyRoute>
  ),
});

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: yupResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      hospital: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (v: SignupValues) => {
    try {
      await signup({
        fullName: v.fullName,
        hospital: v.hospital,
        email: v.email,
        phone: v.phone,
        password: v.password,
        confirmPassword: v.confirmPassword,
      });

      toast.success("Account created — welcome to AuraMed!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message || "Could not create account");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Free for clinicians. Get your team onboard in minutes.
            </p>
          </div>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldInput
              label="Full name"
              icon={UserRound}
              placeholder="Your full name"
              error={errors.fullName?.message}
              {...register("fullName")}
            />
            <FieldInput
              label="Hospital / clinic"
              icon={Building2}
              placeholder="Your hospital or clinic"
              error={errors.hospital?.message}
              {...register("hospital")}
            />
            <FieldInput
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@hospital.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <FieldInput
              label="Phone number"
              type="tel"
              icon={Phone}
              placeholder="+1 555 0123"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldInput
                label="Password"
                type="password"
                passwordToggle
                icon={Lock}
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
                hint="8+ chars, upper, lower & number"
              />
              <FieldInput
                label="Confirm password"
                type="password"
                passwordToggle
                icon={Lock}
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
            >
              {isSubmitting ? <Spinner /> : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              search={{ redirect: "/dashboard" }}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
      <div className="relative hidden overflow-hidden bg-aurora lg:flex">
        <div className="relative z-10 m-auto max-w-md p-12">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Activity className="size-5" />
            </span>
            <p className="font-display text-xl font-semibold">AuraMed</p>
          </Link>
          <h2 className="mt-12 font-display text-4xl font-bold tracking-tight">
            Built for the way{" "}
            <span className="text-gradient-primary">clinicians actually work.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            From your first patient to your thousandth, AuraMed scales with you — quietly, securely,
            beautifully.
          </p>
        </div>
      </div>
    </div>
  );
}
