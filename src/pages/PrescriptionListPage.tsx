import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { prescriptionService } from "@/services/prescription.service";

interface Prescription {
  id: string;
  patient_mobile: string;
  doctor_name: string;
  notes?: string;
  created_at?: string;
}

export default function PrescriptionListPage() {
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const loadPrescriptions = async () => {
    try {
      setLoading(true);

      const data = await prescriptionService.getAllPrescriptions();

      setPrescriptions(data);
      setMessage("");
    } catch (error) {
      console.error(error);

      setPrescriptions([]);
      setMessage("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const handleView = (id: string) => {
    navigate({
      to: "/view-prescription/$id",
      params: { id },
    });
  };

  const handleEdit = (id: string) => {
    navigate({
      to: "/edit-prescription/$id",
      params: { id },
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this prescription?");

    if (!confirmed) return;

    try {
      await prescriptionService.deletePrescription(id);

      setPrescriptions((prev) => prev.filter((p) => p.id !== id));

      alert("Prescription deleted successfully");
    } catch (error) {
      console.error(error);

      alert("Failed to delete prescription");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions</h1>

          <p className="text-gray-500">Manage patient prescriptions and medicines</p>
        </div>

        <button
          onClick={() => {
            console.log("CREATE CLICKED");

            navigate({
              to: "/create-prescription",
            });
          }}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          + Create Prescription
        </button>
      </div>

      {loading && <div className="mb-4">Loading prescriptions...</div>}

      {message && <div className="mb-4 text-red-500">{message}</div>}

      {!loading && prescriptions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2">Prescription ID</th>

                <th className="border p-2">Patient Mobile</th>

                <th className="border p-2">Doctor Name</th>

                <th className="border p-2">Notes</th>

                <th className="border p-2">Created Date</th>

                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td className="border p-2">{prescription.id}</td>

                  <td className="border p-2">{prescription.patient_mobile}</td>

                  <td className="border p-2">{prescription.doctor_name}</td>

                  <td className="border p-2">{prescription.notes}</td>

                  <td className="border p-2">
                    {prescription.created_at
                      ? new Date(prescription.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="border p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(prescription.id)}
                        className="rounded bg-green-600 px-3 py-1 text-white"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleEdit(prescription.id)}
                        className="rounded bg-blue-600 px-3 py-1 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(prescription.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && prescriptions.length === 0 && !message && (
        <div className="rounded border p-4 text-center text-gray-500">No prescriptions found</div>
      )}
    </div>
  );
}
