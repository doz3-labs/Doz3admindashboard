import { ArrowLeft, User, Mail, Building2, Calendar, Shield } from 'lucide-react';

type ProfilePageProps = {
  onBack: () => void;
};

export function ProfilePage({ onBack }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500">Manage your account</p>
          </div>
        </div>
      </header>
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Dr. Priya Sharma</h2>
                <p className="text-blue-100">Head Pharmacist</p>
                <p className="text-sm text-blue-200 mt-1">Indiranagar Hub</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900">sharma@doz3.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Building2 className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="font-medium text-gray-900">Head Pharmacist</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Member since</p>
                <p className="font-medium text-gray-900">January 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Permissions</p>
                <p className="font-medium text-gray-900">Full access — Prescription verification, QC, Dispatch, Finance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
