import { ArrowLeft, Book, MessageCircle, FileText, ExternalLink } from 'lucide-react';

type HelpPageProps = {
  onBack: () => void;
};

const faqs = [
  { q: 'How do I verify a prescription?', a: 'Open the order from Prescription Review, check the prescription image and medication list, then click Approve or Request Clarification.' },
  { q: 'What if QC photos don’t match?', a: 'Use Reject & Repack to send the order back. Add a reason so the packaging team can correct it.' },
  { q: 'How do I assign a courier?', a: 'In Dispatch view, select an order and choose a delivery partner. Book the slot; the rider will be notified.' },
  { q: 'Where do I see low stock alerts?', a: 'Inventory Status on the Operations dashboard shows stock levels. Use Request Refill for items below minimum.' },
];

export function HelpPage({ onBack }: HelpPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-sm text-gray-500">Guides and contact</p>
          </div>
        </div>
      </header>
      <div className="px-6 py-8 max-w-2xl mx-auto space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <a href="#" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Documentation</h3>
              <p className="text-xs text-gray-500">Guides and workflows</p>
            </div>
          </a>
          <a href="#" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Contact support</h3>
              <p className="text-xs text-gray-500">Chat or email</p>
            </div>
          </a>
        </div>
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i} className="px-6 py-4">
                <h3 className="font-medium text-gray-900 text-sm">{faq.q}</h3>
                <p className="text-sm text-gray-600 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-900">Need more help?</p>
            <p className="text-sm text-blue-700">Email support@doz3.com or call +91 80 1234 5678</p>
          </div>
        </div>
      </div>
    </div>
  );
}
