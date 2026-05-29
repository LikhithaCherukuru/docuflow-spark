import { api, TOKEN_KEY, USER_KEY } from "@/lib/api";

export type DoctorUser = {
  id: string;
  fullName: string;
  hospital: string;
  email: string;
  phone: string;
  avatar?: string;
};

export const authService = {
  async login(payload: {
    email: string;
    password: string;
    remember?: boolean;
  }) {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      token: string;
    }>("/auth/login", payload);

    localStorage.setItem(TOKEN_KEY, data.token);

    return data;
  },

async signup(payload: {
  fullName: string;
  hospital: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}) {
  const { data } = await api.post("/auth/signup", {
    full_name: payload.fullName,
    hospital_name: payload.hospital,
    email: payload.email,
    phone_number: payload.phone,
    password: payload.password,
    confirm_password: payload.confirmPassword,
  });

  return data;
},

  async me() {
    const { data } = await api.get<{ user: DoctorUser }>("/auth/me");

    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return data.user;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredUser(): DoctorUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
};