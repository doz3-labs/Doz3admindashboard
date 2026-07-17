"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPatientByAbhaAddress, type PatientRead } from "@/lib/api/patients";

export function PatientLookup() {
  const [abha, setAbha] = useState("rahul.kumar@abdm");
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<PatientRead | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFetch = async () => {
    setLoading(true);
    setError(null);
    setPatient(null);
    try {
      const p = await getPatientByAbhaAddress(abha);
      setPatient(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="text-sm font-semibold">Patient lookup</div>
        <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            value={abha}
            onChange={(e) => setAbha(e.target.value)}
            placeholder="handle@abdm"
          />
          <Button onClick={onFetch} disabled={loading}>
            {loading ? "Fetching…" : "Fetch"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Calls <span className="font-mono">GET /patients/{`{abha_address}`}</span>
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {patient ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-900 dark:bg-zinc-950">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">{patient.abha_address}</div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {patient.id}
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Address line 1" value={patient.address_line1} />
            <Field label="Address line 2" value={patient.address_line2 ?? "—"} />
            <Field label="City" value={patient.city} />
            <Field label="State" value={patient.state} />
            <Field label="Pincode" value={patient.pincode} />
            <Field label="Country" value={patient.country} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 p-3 dark:border-zinc-900">
      <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

