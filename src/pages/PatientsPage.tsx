import { useState } from "react";
import { patientsService, type Patient } from "@/services/patients.service";
import { useNavigate } from "@tanstack/react-router";

export default function PatientsPage() {
  const [mobile, setMobile] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
 const searchPatient = async () => {
  if (!/^\d{10}$/.test(mobile)) {
    setMessage("Please enter a valid 10 digit mobile number");
    return;
  }

  try {
    setLoading(true);

    const patient =
      await patientsService.getByMobile(mobile);

    console.log("SEARCH PATIENT:", patient);

    if (Array.isArray(patient)) {
      setPatients(patient);
    } else {
      setPatients([patient]);
    }

    setMessage("");
  } catch (error) {
    console.error(error);

    setPatients([]);
    setMessage("Patient not found");
  } finally {
    setLoading(false);
  }
};

  const showAllPatients = async () => {
    try {
      setLoading(true);

      const data = await patientsService.list();

      setPatients(data);
      setMessage("");
    } catch (error) {
      console.error(error);

      setPatients([]);
      setMessage("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setMobile("");
    setPatients([]);
    setMessage("");
  };

const handleUpdate = (patient: Patient) => {
  navigate({
    to: "/add-patient",
    search: {
      edit: "true",
      mobile: patient.mobile_number,
    },
  });
};



const handleDelete = async (patient: Patient) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${patient.patient_name}?`
  );

  if (!confirmed) return;

  try {
    await patientsService.delete(patient.mobile_number);

    setPatients((prev) =>
      prev.filter(
        (p) =>
          p.mobile_number !== patient.mobile_number
      )
    );

    alert("Patient deleted successfully");
 } catch (error) {
  console.error(error);
  alert("Failed to delete patient");
}

}

 


  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Patient Search
      </h1>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          maxLength={10}
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, ""))
          }
          placeholder="Enter 10 digit mobile number"
          className="w-80 rounded border px-3 py-2"
        />

        <button
          onClick={searchPatient}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Search Patient
        </button>

        <button
          onClick={showAllPatients}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Show All Patients
        </button>

        <button
          onClick={clearData}
          className="rounded bg-gray-600 px-4 py-2 text-white"
        >
          Clear
        </button>
      </div>

      {message && (
        <div className="mb-4 text-red-500">
          {message}
        </div>
      )}

      {loading && (
        <div className="mb-4">
          Loading...
        </div>
      )}

      {!loading && patients.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Mobile</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">Gender</th>
                <th className="border p-2">Blood Group</th>
                <th className="border p-2">BP</th>
                <th className="border p-2">Sugar</th>
                <th className="border p-2">Weight</th>
                <th className="border p-2">Height</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.id ?? index}>
                  <td className="border p-2">
                    {patient.patient_name}
                  </td>

                  <td className="border p-2">
                    {patient.mobile_number}
                  </td>

                  <td className="border p-2">
                    {patient.age}
                  </td>

                  <td className="border p-2">
                    {patient.gender}
                  </td>

                  <td className="border p-2">
                    {patient.blood_group}
                  </td>

                  <td className="border p-2">
                    {patient.blood_pressure}
                  </td>

                  <td className="border p-2">
                    {patient.sugar_level}
                  </td>

                  <td className="border p-2">
                    {patient.weight}
                  </td>

                  <td className="border p-2">
                    {patient.height}
                  </td>
                  <td className="border p-2">
  <div className="flex gap-2">
    <button
      onClick={() => handleUpdate(patient)}
      className="rounded bg-blue-600 px-3 py-1 text-white"
    >
      Update
    </button>

    <button
      onClick={() => handleDelete(patient)}
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

      {!loading &&
        patients.length === 0 &&
        !message && (
          <div className="rounded border p-4 text-center text-gray-500">
            Enter a mobile number and click
            <strong> Search Patient </strong>
            <br />
            OR
            <br />
            Click
            <strong> Show All Patients </strong>
          </div>
        )}
    </div>
  );
}
