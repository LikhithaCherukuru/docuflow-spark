import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { prescriptionService } from "@/services/prescription.service";

interface Medicine {
  id: string;
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

interface PrescriptionDetails {
  prescription: {
    id: string;
    patient_mobile: string;
    doctor_name: string;
    notes?: string;
    created_at?: string;
  };
  medicines: Medicine[];
}

export default function ViewPrescriptionPage() {
  const { id } = useParams({
    from: "/_app/view-prescription/$id",
  });

  const navigate = useNavigate();

  const [data, setData] = useState<PrescriptionDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadPrescription = async () => {
    try {
      setLoading(true);

      const response = await prescriptionService.getPrescriptionById(id);

      setData(response);

      setError("");
    } catch (err) {
      console.error(err);

      setError("Unable to load prescription details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescription();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this prescription?");

    if (!confirmed) return;

    try {
      await prescriptionService.deletePrescription(id);

      alert("Prescription deleted successfully");

      navigate({
        to: "/prescriptions",
      });
    } catch (error) {
      console.error(error);

      alert("Failed to delete prescription");
    }
  };

  const handleDeleteMedicine = async (medicineId: string) => {
    const confirmed = window.confirm("Delete this medicine?");

    if (!confirmed) return;

    try {
      await prescriptionService.deleteMedicine(medicineId);

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          medicines: prev.medicines.filter((m) => m.id !== medicineId),
        };
      });

      alert("Medicine removed successfully");
    } catch (error) {
      console.error(error);

      alert("Failed to delete medicine");
    }
  };

  if (loading) {
    return <div className="p-6">Loading prescription...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="rounded border border-red-300 bg-red-50 p-4">
          <h2 className="text-lg font-bold text-red-600">Prescription Not Found</h2>

          <p className="mt-2">Unable to load prescription details</p>

          <button
            onClick={() =>
              navigate({
                to: "/prescriptions",
              })
            }
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
          >
            Back To Prescriptions
          </button>
        </div>
      </div>
    );
  }

  const { prescription, medicines } = data;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Prescription Details</h1>

        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate({
                to: "/edit-prescription/$id",
                params: {
                  id: prescription.id,
                },
              })
            }
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Edit Prescription
          </button>

          <button onClick={handleDelete} className="rounded bg-red-600 px-4 py-2 text-white">
            Delete Prescription
          </button>

          <button
            onClick={() =>
              navigate({
                to: "/prescriptions",
              })
            }
            className="rounded bg-gray-600 px-4 py-2 text-white"
          >
            Back
          </button>
        </div>
      </div>

      <div className="mb-6 rounded border p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <strong>Patient Mobile</strong>
            <p>{prescription.patient_mobile}</p>
          </div>

          <div>
            <strong>Doctor Name</strong>
            <p>{prescription.doctor_name}</p>
          </div>

          <div>
            <strong>Created Date</strong>
            <p>
              {prescription.created_at
                ? new Date(prescription.created_at).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div className="md:col-span-2">
            <strong>Notes</strong>

            <p>{prescription.notes || "No notes"}</p>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-semibold">Medicines</h2>

      {medicines.length === 0 ? (
        <div className="rounded border p-4 text-gray-500">No medicines found</div>
      ) : (
        <div className="space-y-4">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="rounded border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{medicine.medicine_name}</h3>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {medicine.early_morning && <span>Early Morning ✔</span>}

                    {medicine.morning && <span>Morning ✔</span>}

                    {medicine.afternoon && <span>Afternoon ✔</span>}

                    {medicine.night && <span>Night ✔</span>}
                  </div>

                  <div className="mt-2">{medicine.before_food ? "Before Food" : "After Food"}</div>

                  <div className="mt-2">Duration: {medicine.duration_days} days</div>

                  {medicine.remarks && <div className="mt-2">Remarks: {medicine.remarks}</div>}
                </div>

                <button
                  onClick={() => handleDeleteMedicine(medicine.id)}
                  className="rounded bg-red-600 px-3 py-1 text-white"
                >
                  Delete Medicine
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
