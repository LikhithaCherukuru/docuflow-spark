import { api } from "@/lib/api";

export type Patient = {
  id: string;

  patient_name: string;
  mobile_number: string;
  age: number;
  gender: string;

  blood_pressure: string;
  sugar_level: string;
  weight: string;
  height: string;
  blood_group: string;

  symptoms: string;
  diagnosis: string;
  allergies: string;
  address: string;

  created_at: string;
};

export type CreatePatientPayload = {
  patient_name: string;
  mobile_number: string;
  age: number;
  gender: string;

  blood_pressure: string;
  sugar_level: string;
  weight: string;
  height: string;
  blood_group: string;

  symptoms: string;
  diagnosis: string;
  allergies: string;
  address: string;
};

export const patientsService = {
  async list(): Promise<Patient[]> {
    console.log("BASE URL:", api.defaults.baseURL);
    console.log("GET:", "/patients/");

    const { data } = await api.get<Patient[]>("/patients/");

    return data;
  },

  async create(payload: CreatePatientPayload): Promise<Patient> {
    console.log("BASE URL:", api.defaults.baseURL);
    console.log("POST:", "/patients/");
    console.log("PAYLOAD:", payload);

    const { data } = await api.post<Patient>(
      "/patients/",
      payload
    );

    return data;
  },

  async search(query: string): Promise<Patient[]> {
    const patients = await this.list();

    const q = query.toLowerCase().trim();

    return patients.filter(
      (patient) =>
        patient.patient_name.toLowerCase().includes(q) ||
        patient.mobile_number.includes(q) ||
        patient.diagnosis.toLowerCase().includes(q) ||
        patient.symptoms.toLowerCase().includes(q) ||
        patient.blood_group.toLowerCase().includes(q)
    );
  },

  async findByMobile(mobile: string): Promise<Patient> {
    const patients = await this.list();

    const patient = patients.find(
      (p) => p.mobile_number === mobile
    );

    if (!patient) {
      throw new Error("Patient not found");
    }

    return patient;
  },

  async findById(id: string): Promise<Patient> {
    const patients = await this.list();

    const patient = patients.find(
      (p) => p.id === id
    );

    if (!patient) {
      throw new Error("Patient not found");
    }

    return patient;
  },

  async getByMobile(mobile: string): Promise<Patient> {
    console.log("BASE URL:", api.defaults.baseURL);
    console.log("GET:", `/patients/${mobile}`);

    const { data } = await api.get<Patient>(
      `/patients/${mobile}`
    );

    return data;
  },


  async delete(mobileNumber: string) {
  const { data } = await api.delete(
    `/patients/${mobileNumber}`
  );

  return data;
},

async update(payload: any) {
  const { data } = await api.put(
    `/patients/${payload.mobile_number}`,
    payload
  );

  return data;
},


};