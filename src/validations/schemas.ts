import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().trim().required("Email is required").email("Enter a valid email"),
  password: yup.string().required("Password is required").min(8, "At least 8 characters"),
  remember: yup.boolean().default(false),
});
export type LoginValues = yup.InferType<typeof loginSchema>;

export const signupSchema = yup.object({
  fullName: yup.string().trim().required("Full name is required").min(2).max(80),
  hospital: yup.string().trim().required("Hospital name is required").min(2).max(120),
  email: yup.string().trim().required("Email is required").email("Enter a valid email"),
  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^[+\d][\d\s\-()]{6,18}$/, "Enter a valid phone number"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "One uppercase letter")
    .matches(/[a-z]/, "One lowercase letter")
    .matches(/\d/, "One number"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
export type SignupValues = yup.InferType<typeof signupSchema>;

export const patientSchema = yup.object({
  name: yup.string().trim().required("Patient name is required").min(2).max(80),

  mobile: yup
    .string()
    .trim()
    .required("Mobile number is required")
    .matches(/^[+\d][\d\s\-()]{6,18}$/, "Enter a valid mobile number"),

  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .integer("Whole number")
    .min(0, "Invalid age")
    .max(130, "Invalid age"),

  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"])
    .required("Select gender"),

  bp: yup.string().trim().required("Blood pressure required"),

  sugar: yup.string().trim().required("Sugar level required"),

  weight: yup.string().trim().required("Weight required"),

  height: yup.string().trim().required("Height required"),

  bloodGroup: yup.string().trim().required("Blood group required"),

  symptoms: yup
    .string()
    .trim()
    .required("Symptoms required")
    .max(500),

  diagnosis: yup
    .string()
    .trim()
    .required("Diagnosis required")
    .max(500),

  allergies: yup
    .string()
    .trim()
    .max(300)
    .default(""),

  address: yup
    .string()
    .trim()
    .max(300)
    .default(""),

  // OPTIONAL FIELD
  nextConsultationDate: yup
    .string()
    .nullable()
    .notRequired(),
});
export type PatientValues = yup.InferType<typeof patientSchema>;

export const prescriptionSchema = yup.object({
  diagnosis: yup.string().trim().required("Diagnosis is required").max(500),
  medication: yup.string().trim().required("Medication is required").max(1000),
  notes: yup.string().trim().max(1000).default(""),
});
export type PrescriptionValues = yup.InferType<typeof prescriptionSchema>;
