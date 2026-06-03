import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "@tanstack/react-router";

import { prescriptionService } from "@/services/prescription.service";

interface Medicine {
  id?: string;

  medicine_name: string;

  early_morning: boolean;
  morning: boolean;
  afternoon: boolean;
  night: boolean;

  before_food: boolean;
  after_food: boolean;

  duration_days: number;

  remarks?: string;
}

interface PrescriptionForm {
  patient_mobile: string;
  doctor_name: string;
  notes?: string;
  medicines: Medicine[];
}

export default function EditPrescriptionPage() {
  const navigate = useNavigate();

  const { id } = useParams({
    from: "/_app/edit-prescription/$id",
  });

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<PrescriptionForm>({
    defaultValues: {
      patient_mobile: "",
      doctor_name: "",
      notes: "",
      medicines: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  useEffect(() => {
    loadPrescription();
  }, []);

  const loadPrescription = async () => {
    try {
      const response = await prescriptionService.getPrescriptionById(id);

      reset({
        patient_mobile: response.prescription.patient_mobile,

        doctor_name: response.prescription.doctor_name,

        notes: response.prescription.notes ?? "",

        medicines: response.medicines.length > 0 ? response.medicines : [],
      });
    } catch (error) {
      console.error(error);

      alert("Failed to load prescription");
    }
  };

  const onSubmit = async (data: PrescriptionForm) => {
    try {
      await prescriptionService.updatePrescription(id, data);

      alert("Prescription Updated Successfully");

      navigate({
        to: "/prescriptions",
      });
    } catch (error) {
      console.error(error);

      alert("Failed To Update Prescription");
    }
  };

  const handleDeleteMedicine = async (medicineId: string, index: number) => {
    const confirmed = window.confirm("Delete this medicine?");

    if (!confirmed) return;

    try {
      await prescriptionService.deleteMedicine(medicineId);

      remove(index);

      alert("Medicine removed successfully");
    } catch (error) {
      console.error(error);

      alert("Failed to delete medicine");
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold">Edit Prescription</h1>

      <p className="mb-6 text-gray-500">Update prescription information</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="mb-1 block font-medium">Patient Mobile Number</label>

          <input
            {...register("patient_mobile")}
            readOnly
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          />
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

          <textarea {...register("notes")} rows={3} className="w-full rounded border p-2" />
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="rounded border p-4">
            <h2 className="mb-4 text-xl font-semibold">Medicine #{index + 1}</h2>

            <div className="mb-4">
              <label className="block font-medium">Medicine Name</label>

              <input
                {...register(`medicines.${index}.medicine_name`, {
                  required: "Medicine name is required",
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
                    value="true"
                    checked={field.before_food}
                    {...register(`medicines.${index}.before_food`)}
                  />
                  Before Food
                </label>

                <label>
                  <input
                    type="radio"
                    value="true"
                    checked={field.after_food}
                    {...register(`medicines.${index}.after_food`)}
                  />
                  After Food
                </label>
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
                rows={2}
                {...register(`medicines.${index}.remarks`)}
                className="w-full rounded border p-2"
              />
            </div>

            <div className="flex gap-2">
              {field.id && (
                <button
                  type="button"
                  onClick={() => handleDeleteMedicine(field.id as string, index)}
                  className="rounded bg-red-600 px-4 py-2 text-white"
                >
                  Delete Medicine
                </button>
              )}

              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded bg-gray-600 px-4 py-2 text-white"
              >
                Remove Card
              </button>
            </div>
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

        <div className="flex gap-3">
          <button type="submit" className="rounded bg-blue-600 px-6 py-2 text-white">
            Save Changes
          </button>

          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/prescriptions",
              })
            }
            className="rounded bg-gray-600 px-6 py-2 text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
