/**
 * Lightweight in-browser mock backend used when VITE_API_BASE_URL is not set.
 * Persists in localStorage. Swap by setting the env var.
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const DB_KEY = "ahms_db_v2";

type Doctor = {
  id: string;
  fullName: string;
  hospital: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
};
type Patient = {
  id: string;
  name: string;
  mobile: string;
  age: number;
  gender: "Male" | "Female" | "Other";
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
  prescriptions: Prescription[];
};
type Prescription = {
  id: string;
  date: string;
  diagnosis: string;
  medication: string;
  notes: string;
};
type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
};

type DB = {
  doctors: Doctor[];
  patients: Patient[];
  notifications: Notification[];
  tokens: Record<string, string>; // token -> doctorId
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function seed(): DB {
  return { doctors: [], patients: [], notifications: [], tokens: {} };
}

function load(): DB {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(DB_KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw);
  } catch {
    const s = seed();
    localStorage.setItem(DB_KEY, JSON.stringify(s));
    return s;
  }
}
function save(db: DB) {
  if (typeof window !== "undefined") localStorage.setItem(DB_KEY, JSON.stringify(db));
}

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

function ok<T>(data: T, config: AxiosRequestConfig, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: "OK",
    headers: {},
    config: config as any,
  } as AxiosResponse<T>;
}
function fail(message: string, status: number, config: AxiosRequestConfig) {
  return Promise.reject({
    response: { data: { message }, status, statusText: "Error", headers: {}, config },
    message,
    isAxiosError: true,
  });
}

function getDoctorFromAuth(db: DB, config: AxiosRequestConfig): Doctor | null {
  const auth = (config.headers as any)?.Authorization || (config.headers as any)?.authorization;
  if (!auth) return null;
  const token = String(auth).replace(/^Bearer\s+/i, "");
  const drId = db.tokens[token];
  return db.doctors.find((d) => d.id === drId) || null;
}

export async function mockAdapter(config: AxiosRequestConfig): Promise<AxiosResponse> {
  await delay(350 + Math.random() * 300);
  const db = load();
  const url = (config.url || "").replace(/^\/?api\/?/, "/").replace(/^\/+/, "/");
  const method = (config.method || "get").toLowerCase();
  const body = config.data
    ? typeof config.data === "string"
      ? JSON.parse(config.data)
      : config.data
    : {};

  // AUTH
  if (url === "/login" && method === "post") {
    const doctor = db.doctors.find(
      (d) => d.email.toLowerCase() === String(body.email || "").toLowerCase(),
    );
    if (!doctor || doctor.password !== body.password)
      return fail("Invalid email or password", 401, config);
    const token = uid() + uid();
    db.tokens[token] = doctor.id;
    save(db);
    const { password, ...safe } = doctor;
    return ok({ token, user: safe }, config);
  }
  if (url === "/signup" && method === "post") {
    if (db.doctors.some((d) => d.email.toLowerCase() === String(body.email).toLowerCase()))
      return fail("Email already registered", 409, config);
    const doctor: Doctor = {
      id: uid(),
      fullName: body.fullName,
      hospital: body.hospital,
      email: body.email,
      phone: body.phone,
      password: body.password,
    };
    db.doctors.push(doctor);
    const token = uid() + uid();
    db.tokens[token] = doctor.id;
    save(db);
    const { password, ...safe } = doctor;
    return ok({ token, user: safe }, config, 201);
  }
  if (url === "/me" && method === "get") {
    const d = getDoctorFromAuth(db, config);
    if (!d) return fail("Unauthorized", 401, config);
    const { password, ...safe } = d;
    return ok({ user: safe }, config);
  }

  // Everything below requires auth
  const doctor = getDoctorFromAuth(db, config);
  if (!doctor) return fail("Unauthorized", 401, config);

  if (url === "/dashboard" && method === "get") {
    const totalPatients = db.patients.length;
    const activeRx = db.patients.reduce((a, p) => a + p.prescriptions.length, 0);
    const pendingReminders = db.notifications.filter((n) => !n.read).length;
    const recent = [...db.patients]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 5);

    return ok(
      {
        stats: {
          totalPatients,
          todaysAppointments: 0,
          activePrescriptions: activeRx,
          pendingReminders,
        },
        recentPatients: recent,
        appointments: [],
      },
      config,
    );
  }
  if (url === "/patients" && method === "get") {
    return ok({ patients: db.patients }, config);
  }
  if (url === "/patients" && method === "post") {
    if (db.patients.some((p) => p.mobile === body.mobile))
      return fail("Mobile number already registered", 409, config);
    const p: Patient = {
      id: uid(),
      name: body.name,
      mobile: body.mobile,
      age: Number(body.age),
      gender: body.gender,
      bp: body.bp,
      sugar: body.sugar,
      weight: body.weight,
      height: body.height,
      bloodGroup: body.bloodGroup,
      symptoms: body.symptoms,
      diagnosis: body.diagnosis,
      allergies: body.allergies || "None",
      address: body.address || "",
      createdAt: new Date().toISOString(),
      prescriptions: [],
    };
    db.patients.unshift(p);
    save(db);
    return ok({ patient: p }, config, 201);
  }

  const prescriptionMatch = url.match(/^\/patients\/([^/]+)\/prescriptions$/);
  if (prescriptionMatch && method === "post") {
    const key = decodeURIComponent(prescriptionMatch[1]);
    const p = db.patients.find((x) => x.mobile === key || x.id === key);
    if (!p) return fail("Patient not found", 404, config);

    p.prescriptions.unshift({
      id: uid(),
      date: new Date().toISOString(),
      diagnosis: body.diagnosis,
      medication: body.medication,
      notes: body.notes || "",
    });
    save(db);
    return ok({ patient: p }, config, 201);
  }

  const patientMatch = url.match(/^\/patients\/(.+)$/);
  if (patientMatch && method === "get") {
    const key = decodeURIComponent(patientMatch[1]);
    const p = db.patients.find((x) => x.mobile === key || x.id === key);
    if (!p) return fail("Patient not found", 404, config);
    return ok({ patient: p }, config);
  }

  if (url === "/notifications" && method === "get") {
    return ok({ notifications: db.notifications }, config);
  }
  if (url === "/notifications/read-all" && method === "post") {
    db.notifications = db.notifications.map((n) => ({ ...n, read: true }));
    save(db);
    return ok({ ok: true }, config);
  }

  return fail(`Mock route not implemented: ${method.toUpperCase()} ${url}`, 404, config);
}
