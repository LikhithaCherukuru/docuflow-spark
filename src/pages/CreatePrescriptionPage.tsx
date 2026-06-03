import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { prescriptionService } from "@/services/prescription.service";

interface Medicine {
  medicine_name: string;
  early_morning: boolean;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  before_food: boolean;
  after_food: boolean;
  duration_days: number;
  remarks: string;
}

interface PrescriptionForm {
  patient_mobile: string;
  doctor_name: string;
  notes: string;
  medicines: Medicine[];
}

export default function CreatePrescriptionPage() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PrescriptionForm>({
    defaultValues: {
      patient_mobile: "",
      doctor_name: "",
      notes: "",
      medicines: [
        {
          medicine_name: "",
          early_morning: false,
          morning: false,
          afternoon: false,
          night: false,
          before_food: false,
          after_food: true,
          duration_days: 1,
          remarks: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const onSubmit = async (data: PrescriptionForm) => {
    try {
      await prescriptionService.createPrescription(data);

      alert("Prescription Created Successfully");

      navigate({
        to: "/prescriptions",
      });
    } catch (error) {
      console.error(error);

      alert("Failed to create prescription");
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold">Create Prescription</h1>

      <p className="mb-6 text-gray-500">Create and manage patient medicine prescriptions</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="mb-1 block font-medium">Patient Mobile Number</label>

          <input
            {...register("patient_mobile", {
              required: "Patient Mobile is required",
            })}
            className="w-full rounded border p-2"
          />

          {errors.patient_mobile && <p className="text-red-500">{errors.patient_mobile.message}</p>}
        </div>

        <div>
          <label className="mb-1 block font-medium">Doctor Name</label>

          <input
            {...register("doctor_name", {
              required: "Doctor Name is required",
            })}
            className="w-full rounded border p-2"
          />

          {errors.doctor_name && <p className="text-red-500">{errors.doctor_name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block font-medium">Notes</label>

          <textarea {...register("notes")} className="w-full rounded border p-2" rows={3} />
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="rounded border p-4">
            <h2 className="mb-4 text-xl font-semibold">Medicine #{index + 1}</h2>

            <div className="mb-4">
              <label className="block font-medium">Medicine Name</label>

              <input
                {...register(`medicines.${index}.medicine_name`, {
                  required: "Medicine Name is required",
                })}
                className="w-full rounded border p-2"
              />
            </div>

            <div className="mb-4">
              <p className="mb-2 font-medium">Timing</p>

              <div className="flex flex-wrap gap-4">
                <label>
                  <input type="checkbox" {...register(`medicines.${index}.early_morning`)} />
                  Early Morning
                </label>

                <label>
                  <input type="checkbox" {...register(`medicines.${index}.morning`)} />
                  Morning
                </label>

                <label>
                  <input type="checkbox" {...register(`medicines.${index}.afternoon`)} />
                  Afternoon
                </label>

                <label>
                  <input type="checkbox" {...register(`medicines.${index}.night`)} />
                  Night
                </label>
              </div>
            </div>

            <div className="mb-4">
              <p className="mb-2 font-medium">Food Timing</p>

              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="before"
                    onChange={() => {
                      const before = document.getElementById(`before-${index}`) as HTMLInputElement;

                      const after = document.getElementById(`after-${index}`) as HTMLInputElement;

                      before.checked = true;
                      after.checked = false;
                    }}
                  />
                  Before Food
                </label>

                <label>
                  <input
                    type="radio"
                    value="after"
                    defaultChecked
                    onChange={() => {
                      const before = document.getElementById(`before-${index}`) as HTMLInputElement;

                      const after = document.getElementById(`after-${index}`) as HTMLInputElement;

                      before.checked = false;
                      after.checked = true;
                    }}
                  />
                  After Food
                </label>

                <input
                  id={`before-${index}`}
                  type="hidden"
                  {...register(`medicines.${index}.before_food`)}
                />

                <input
                  id={`after-${index}`}
                  type="hidden"
                  {...register(`medicines.${index}.after_food`)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-medium">Duration Days</label>

              <input
                type="number"
                min={1}
                {...register(`medicines.${index}.duration_days`, {
                  required: true,
                  valueAsNumber: true,
                })}
                className="w-full rounded border p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Remarks</label>

              <textarea
                {...register(`medicines.${index}.remarks`)}
                className="w-full rounded border p-2"
                rows={2}
              />
            </div>

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Remove Medicine
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              medicine_name: "",
              early_morning: false,
              morning: false,
              afternoon: false,
              night: false,
              before_food: false,
              after_food: true,
              duration_days: 1,
              remarks: "",
            })
          }
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          + Add Medicine
        </button>

        <div>
          <button type="submit" className="rounded bg-blue-600 px-6 py-2 text-white">
            Save Prescription
          </button>
        </div>
      </form>
    </div>
  );
}
