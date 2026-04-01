import { PatientLookup } from "./patient-lookup";

export default function PatientsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Patients</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Look up patients by ABHA address.
        </p>
      </div>
      <PatientLookup />
    </div>
  );
}

