export type PatientRead = {
  id: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  abha_address: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8000";

export async function getPatientByAbhaAddress(abhaAddress: string): Promise<PatientRead> {
  const normalized = abhaAddress.trim().toLowerCase();
  const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(normalized)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch patient (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as PatientRead;
}

