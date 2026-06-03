import { api } from "@/lib/api";

export interface PrescriptionMedicine {
  id?: string;
  prescription_id?: string;

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

export interface Prescription {
  id?: string;

  patient_mobile: string;
  doctor_name: string;
  notes?: string;

  created_at?: string;

  medicines: PrescriptionMedicine[];
}

export interface PrescriptionDetailsResponse {
  prescription: {
    id: string;
    patient_mobile: string;
    doctor_name: string;
    notes?: string;
    created_at?: string;
  };
  medicines: PrescriptionMedicine[];
}

export const prescriptionService = {
  /**
   * Get all prescriptions
   */
  async getAllPrescriptions() {
    const response = await api.get("/prescriptions/");
    return response.data;
  },

  /**
   * Get prescription by id
   */
  async getPrescriptionById(id: string): Promise<PrescriptionDetailsResponse> {
    const response = await api.get(`/prescriptions/${id}`);

    return response.data;
  },

  /**
   * Create prescription
   */
  async createPrescription(data: Prescription) {
    const response = await api.post("/prescriptions/", data);

    return response.data;
  },

  /**
   * Update prescription
   */
  async updatePrescription(id: string, data: Prescription) {
    const response = await api.put(`/prescriptions/${id}`, data);

    return response.data;
  },

  /**
   * Delete prescription
   */
  async deletePrescription(id: string) {
    const response = await api.delete(`/prescriptions/${id}`);

    return response.data;
  },

  /**
   * Delete individual medicine
   */
  async deleteMedicine(itemId: string) {
    const response = await api.delete(`/prescriptions/medicine/${itemId}`);

    return response.data;
  },
};
