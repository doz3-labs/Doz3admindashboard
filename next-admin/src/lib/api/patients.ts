import { getJson } from "./client";

export type PatientRead = {
  id: string;
  // The backend's PatientRead includes full_name; it was missing here, so the
  // patient's name was never available to the UI.
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  abha_address: string;
};

export async function getPatientByAbhaAddress(abhaAddress: string): Promise<PatientRead> {
  const normalized = abhaAddress.trim().toLowerCase();
  return getJson<PatientRead>(
    `/patients/${encodeURIComponent(normalized)}`,
    "GET /patients/{abha_address}"
  );
}

/** Search patients by name or ABHA address. The backend param is `q`. */
export async function searchPatients(query?: string): Promise<PatientRead[]> {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  return getJson<PatientRead[]>(`/patients/${qs}`, "GET /patients/");
}
