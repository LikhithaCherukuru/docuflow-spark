import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { patientSchema, type PatientValues } from "@/validations/schemas";
import { FieldInput } from "@/components/forms/FieldInput";
import { FieldSelect } from "@/components/forms/FieldSelect";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { toast } from "sonner";
import { patientsService } from "@/services/patients.service";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/common/Spinner";
import { useNavigate } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => ({
  label: b,
  value: b,
}));

export function AddPatientPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientValues>({
    resolver: yupResolver(patientSchema),
    mode: "onTouched",
  });

  const onSubmit = async (v: PatientValues) => {
    try {
      const p = await patientsService.create(v);
      toast.success(`Patient ${p.name} registered`);
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      reset();
      navigate({ to: "/patients/search", search: { q: p.mobile } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not register patient";
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <UserPlus className="size-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Register a patient</h1>
          <p className="text-sm text-muted-foreground">
            All fields marked required must be filled.
          </p>
        </div>
      </div>

      <GlassCard>
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Section title="Personal information">
            <FieldInput
              label="Patient name"
              placeholder="Full name"
              error={errors.name?.message}
              {...register("name")}
            />
            <FieldInput
              label="Mobile number"
              type="tel"
              placeholder="+1 555 0100"
              error={errors.mobile?.message}
              {...register("mobile")}
            />
            <FieldInput
              label="Age"
              type="number"
              inputMode="numeric"
              placeholder="0–130"
              error={errors.age?.message}
              {...register("age")}
            />

            {/* 🔥 FIXED: Gender Select */}
            <FieldSelect
              label="Gender"
              options={genderOptions}
              placeholder="Select…"
              error={errors.gender?.message}
              {...register("gender")}
              className="
                dark:bg-background/40 
                dark:text-white 
                dark:border-white/10
                dark:focus:ring-white/20
              "
            />
          </Section>

          <Section title="Vitals">
            <FieldInput
              label="Blood pressure"
              placeholder="e.g. 120/80"
              error={errors.bp?.message}
              {...register("bp")}
            />
            <FieldInput
              label="Sugar level"
              placeholder="mg/dL"
              error={errors.sugar?.message}
              {...register("sugar")}
            />
            <FieldInput
              label="Weight"
              placeholder="e.g. 72 kg"
              error={errors.weight?.message}
              {...register("weight")}
            />
            <FieldInput
              label="Height"
              placeholder="e.g. 175 cm"
              error={errors.height?.message}
              {...register("height")}
            />

            {/* 🔥 FIXED: Blood Group Select */}
            <FieldSelect
              label="Blood group"
              options={bloodGroups}
              placeholder="Select…"
              error={errors.bloodGroup?.message}
              {...register("bloodGroup")}
              className="
                dark:bg-background/40 
                dark:text-white 
                dark:border-white/10
                dark:focus:ring-white/20
              "
            />
          </Section>

          <Section title="Clinical">
            <div className="sm:col-span-2">
              <FieldInput
                label="Symptoms"
                placeholder="Patient-reported symptoms"
                error={errors.symptoms?.message}
                {...register("symptoms")}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldInput
                label="Diagnosis"
                placeholder="Working diagnosis"
                error={errors.diagnosis?.message}
                {...register("diagnosis")}
              />
            </div>
            <FieldInput
              label="Allergies"
              placeholder="None / list"
              error={errors.allergies?.message}
              {...register("allergies")}
            />
            <FieldInput
              label="Address"
              placeholder="Optional"
              error={errors.address?.message}
              {...register("address")}
            />
          </Section>

          <div className="flex flex-wrap justify-end gap-3 border-t border-border/60 pt-5">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-primary text-primary-foreground shadow-glow"
            >
              {isSubmitting ? <Spinner /> : "Save patient"}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
