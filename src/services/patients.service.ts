import { api } from "@/lib/api";

export type Patient = {
  id: string;
  name: string;
  mobile: string;
  age: number;
  gender: string;
  bp: string;
  sugar: string;
  weight: string;
  height: string;
  bloodGroup: string;
  symptoms: string;
  diagnosis: string;
  allergies: string;
  address: string;
  createdAt: string;
  prescriptions: {
    id: string;
    date: string;
    diagnosis: string;
    medication: string;
    notes: string;
  }[];
};

export type PrescriptionPayload = {
  diagnosis: string;
  medication: string;
  notes: string;
};

function includes(value: unknown, term: string) {
  return String(value ?? "")
    .toLowerCase()
    .includes(term);
}

export const patientsService = {
  async list(): Promise<Patient[]> {
    const { data } = await api.get<{ patients: Patient[] }>("/patients");
    return data.patients;
  },
  async search(query: string): Promise<Patient[]> {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const patients = await this.list();
    return patients.filter((patient) => {
      const prescriptionMatch = patient.prescriptions.some((rx) =>
        [rx.diagnosis, rx.medication, rx.notes, rx.date].some((value) => includes(value, term)),
      );

      return (
        [
          patient.name,
          patient.mobile,
          patient.age,
          patient.gender,
          patient.bp,
          patient.sugar,
          patient.weight,
          patient.height,
          patient.bloodGroup,
          patient.symptoms,
          patient.diagnosis,
          patient.allergies,
          patient.address,
        ].some((value) => includes(value, term)) || prescriptionMatch
      );
    });
  },
  async create(payload: Omit<Patient, "id" | "createdAt" | "prescriptions">) {
    const { data } = await api.post<{ patient: Patient }>("/patients", payload);
    return data.patient;
  },
  async findByMobile(mobile: string): Promise<Patient> {
    const { data } = await api.get<{ patient: Patient }>(`/patients/${encodeURIComponent(mobile)}`);
    return data.patient;
  },
  async findById(id: string): Promise<Patient> {
    const { data } = await api.get<{ patient: Patient }>(`/patients/${encodeURIComponent(id)}`);
    return data.patient;
  },
  async addPrescription(patientId: string, payload: PrescriptionPayload): Promise<Patient> {
    const { data } = await api.post<{ patient: Patient }>(
      `/patients/${encodeURIComponent(patientId)}/prescriptions`,
      payload,
    );
    return data.patient;
  },
};
