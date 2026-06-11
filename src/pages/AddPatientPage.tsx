import { useForm, Controller } from "react-hook-form";
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
import { useEffect } from "react";
import { Route } from "@/routes/_app.add-patient";

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

  const search = Route.useSearch();

  const isEdit = search.edit === "true";

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientValues>({
    resolver: yupResolver(patientSchema),
    mode: "onTouched",
    defaultValues: {
  gender: "",
  bloodGroup: "",
  nextConsultationDate: "",
},
  });

  const loadPatient = async () => {
    try {
      const patient = await patientsService.getByMobile(search.mobile);

      const p = Array.isArray(patient) ? patient[0] : patient;

      reset({
  name: p.patient_name,
  mobile: p.mobile_number,
  age: String(p.age),
  gender: p.gender,
  bp: p.blood_pressure,
  sugar: p.sugar_level,
  weight: p.weight,
  height: p.height,
  bloodGroup: p.blood_group,
  symptoms: p.symptoms,
  diagnosis: p.diagnosis,
  allergies: p.allergies,
  address: p.address,
  nextConsultationDate: p.next_consultation_date || "",
});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isEdit || !search.mobile) return;

    loadPatient();
  }, [isEdit, search.mobile]);

  const onSubmit = async (v: PatientValues) => {
    console.log("FORM DATA:", v);

    const payload = {
  patient_name: v.name,
  mobile_number: v.mobile,
  age: Number(v.age),
  gender: v.gender,
  blood_pressure: v.bp,
  sugar_level: v.sugar,
  weight: v.weight,
  height: v.height,
  blood_group: v.bloodGroup,
  symptoms: v.symptoms,
  diagnosis: v.diagnosis,
  allergies: v.allergies,
  address: v.address,

  next_consultation_date:
  v.nextConsultationDate
    ? new Date(v.nextConsultationDate)
        .toISOString()
        .split("T")[0]
    : null,
};

    console.log("BACKEND PAYLOAD:", payload);

    try {
      const p = isEdit
        ? await patientsService.update(payload)
        : await patientsService.create(payload);

      toast.success(`Patient ${p.patient_name ?? payload.patient_name} registered`);

      await qc.invalidateQueries({
        queryKey: ["dashboard"],
      });

      reset();

      navigate({
  to: "/create-prescription",
  search: {
    mobile: p.mobile_number,
  },
});
    } catch (err: unknown) {
      console.error("API ERROR:", err);

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
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            {isEdit ? "Update Patient" : "Register a patient"}
          </h1>

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
              disabled={isEdit}
            />

            <FieldInput
              label="Age"
              type="number"
              inputMode="numeric"
              placeholder="0–130"
              error={errors.age?.message}
              {...register("age")}
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FieldSelect
                  label="Gender"
                  options={genderOptions}
                  placeholder="Select Gender"
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.gender?.message}
                />
              )}
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

            <Controller
              name="bloodGroup"
              control={control}
              render={({ field }) => (
                <FieldSelect
                  label="Blood Group"
                  options={bloodGroups}
                  placeholder="Select Blood Group"
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.bloodGroup?.message}
                />
              )}
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

            <div>
  <label className="mb-2 block text-sm font-medium">
    Next Consultation Date
  </label>

  <input
    type="date"
    {...register("nextConsultationDate")}
    className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
  />

  {errors.nextConsultationDate?.message && (
    <p className="mt-1 text-sm text-destructive">
      {errors.nextConsultationDate.message}
    </p>
  )}
</div>

          </Section>

          <div className="flex flex-wrap justify-end gap-3 border-t border-border/60 pt-5">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate({
                  to: "/create-prescription",
                  search: {
                    mobile: search.mobile ?? "",
                  },
                })
              }
            >
              Add Prescription
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-primary text-primary-foreground shadow-glow"
            >
              {isSubmitting ? <Spinner /> : isEdit ? "Update Patient" : "Save Patient"}
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
