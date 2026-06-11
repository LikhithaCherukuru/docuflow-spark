type Consultation = {
  id?: number;
  patient_name?: string;
  mobile_number?: string;
  age?: number;
  gender?: string;
  blood_pressure?: string;
  sugar_level?: string;
  diagnosis?: string;
  next_consultation_date?: string;
};

type ConsultationTableProps = {
  consultations: Consultation[];
  loading: boolean;
};

export default function ConsultationTable({
  consultations,
  loading,
}: ConsultationTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!consultations?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          No consultations found
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          There are currently no consultation records available.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Patient Name
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Mobile Number
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Age
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Gender
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Blood Pressure
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Sugar Level
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Diagnosis
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Next Consultation
              </th>
            </tr>
          </thead>

          <tbody>
            {consultations.map((item, index) => (
              <tr
                key={item.id ?? index}
                className="border-b border-border transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3 font-medium">
                  {item.patient_name ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {item.mobile_number ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {item.age ?? "-"}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {item.gender ?? "-"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {item.blood_pressure ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {item.sugar_level ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {item.diagnosis ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {item.next_consultation_date ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        Total Consultations: {consultations.length}
      </div>
    </div>
  );
}