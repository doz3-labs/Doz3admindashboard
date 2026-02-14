import { ArrowLeft, MapPin, Clock, IndianRupee, Bike, Truck, Building2, Package, Phone, User, Star, Navigation, Route, AlertCircle, CheckCircle2, Copy, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Order } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

type DispatchViewProps = {
  order: Order;
  onBack: () => void;
};

type Aggregator = {
  id: string;
  name: string;
  price: number;
  eta: string;
  icon: 'bike' | 'truck' | 'building';
  color: string;
  bgColor: string;
  rating: number;
  totalDeliveries: number;
  successRate: number;
  riderName?: string;
  riderPhone?: string;
  riderRating?: number;
};

const aggregators: Aggregator[] = [
  {
    id: 'dunzo',
    name: 'Dunzo',
    price: 45,
    eta: '10 mins',
    icon: 'bike',
    color: 'border-blue-500',
    bgColor: 'bg-blue-50',
    rating: 4.8,
    totalDeliveries: 1240,
    successRate: 98.5,
    riderName: 'Rajesh Kumar',
    riderPhone: '+91 98765 12345',
    riderRating: 4.9,
  },
  {
    id: 'swiggy',
    name: 'Swiggy Genie',
    price: 48,
    eta: '8 mins',
    icon: 'bike',
    color: 'border-orange-500',
    bgColor: 'bg-orange-50',
    rating: 4.7,
    totalDeliveries: 980,
    successRate: 97.2,
    riderName: 'Amit Sharma',
    riderPhone: '+91 98765 54321',
    riderRating: 4.8,
  },
  {
    id: 'shadowfax',
    name: 'Shadowfax',
    price: 35,
    eta: '25 mins',
    icon: 'truck',
    color: 'border-purple-500',
    bgColor: 'bg-purple-50',
    rating: 4.5,
    totalDeliveries: 2100,
    successRate: 96.8,
  },
  {
    id: 'own',
    name: 'Own Fleet',
    price: 0,
    eta: '2 hours',
    icon: 'building',
    color: 'border-gray-500',
    bgColor: 'bg-gray-50',
    rating: 4.6,
    totalDeliveries: 450,
    successRate: 99.1,
    riderName: 'DOZ3 Fleet #3',
    riderPhone: '+91 80 4567 8900',
    riderRating: 4.7,
  },
];

export function DispatchView({ order, onBack }: DispatchViewProps) {
  const [selectedAggregator, setSelectedAggregator] = useState<string | null>(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  
  const handleBooking = (aggregatorName: string, price: number) => {
    const eta = aggregators.find(a => a.name === aggregatorName)?.eta ?? '';
    toast.success(`Booking confirmed! Courier: ${aggregatorName}, Fee: ₹${price}. Rider ETA: ${eta}`);
    onBack();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'bike':
        return <Bike className="w-6 h-6" />;
      case 'truck':
        return <Truck className="w-6 h-6" />;
      case 'building':
        return <Building2 className="w-6 h-6" />;
      default:
        return <Bike className="w-6 h-6" />;
    }
  };

  const deliveryAddress = "HSR Layout, Sector 1, Bangalore - 560102";
  const estimatedDistance = "4.2 km";
  const estimatedDuration = "18 mins";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Courier Assignment & Dispatch</h1>
                <p className="text-sm text-gray-500">Select delivery partner and schedule pickup</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="text-xs text-teal-600 font-medium flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Ready for Pickup
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Order: <span className="font-bold text-gray-900">{order.orderNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Map & Route */}
          <div className="col-span-7 space-y-6">
            {/* Map Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 px-5 py-4 bg-gradient-to-r from-teal-50 to-white">
                <h2 className="text-lg font-bold text-gray-900">Delivery Route Map</h2>
                <p className="text-sm text-gray-600">Live tracking available after dispatch</p>
              </div>
              
              <div className="relative h-96 bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d62211.88269017139!2d77.59405449999999!3d12.9412848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3bae15a82b1e2b45%3A0x3b4f4c4f4c4f4c4f!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!3m2!1d12.9718915!2d77.6411545!4m5!1s0x3bae1670c9b44e6d%3A0x14d10f7a17c3fcb!2sHSR%20Layout%2C%20Bengaluru%2C%20Karnataka!3m2!1d12.9121181!2d77.6445548!5e0!3m2!1sen!2sin!4v1234567890"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Delivery Route Map"
                ></iframe>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30 pointer-events-none" />
                
                {/* Pickup Location Marker */}
                <div className="absolute top-[30%] left-[35%]">
                  <div className="relative group">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse border-4 border-white">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-12 left-14 bg-white border-2 border-green-500 rounded-lg px-4 py-2 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-bold text-gray-900">Pickup Point</div>
                      <div className="text-xs text-gray-600">Indiranagar Hub</div>
                    </div>
                    {/* Ping animation */}
                    <div className="absolute top-0 left-0 w-12 h-12 bg-green-500 rounded-full animate-ping opacity-30"></div>
                  </div>
                </div>
                
                {/* Delivery Location Marker */}
                <div className="absolute top-[65%] right-[30%]">
                  <div className="relative group">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-12 left-14 bg-white border-2 border-blue-500 rounded-lg px-4 py-2 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-bold text-gray-900">Delivery Point</div>
                      <div className="text-xs text-gray-600">Customer Location</div>
                    </div>
                  </div>
                </div>

                {/* Route Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 35% 30% Q 50% 45%, 70% 65%"
                    stroke="url(#routeGradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="8,4"
                  />
                </svg>

                {/* Distance Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-teal-500 rounded-full px-4 py-2 shadow-lg">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Distance</div>
                    <div className="text-lg font-bold text-teal-600">{estimatedDistance}</div>
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Navigation className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Estimated Distance</div>
                    <div className="font-bold text-gray-900">{estimatedDistance}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Estimated Duration</div>
                    <div className="font-bold text-gray-900">{estimatedDuration}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Delivery Instructions</h3>
                <span className="text-xs text-red-600 font-semibold">*Required</span>
              </div>
              <textarea
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="Add special instructions for the delivery rider (e.g., Gate code, floor number, contact person, handling instructions for medicines...)"
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                rows={4}
              />
              <div className="mt-3 flex items-start gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Add any specific delivery requirements, building access codes, or contact preferences (optional)</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Details & Aggregators */}
          <div className="col-span-5 space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <Package className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Order Details</h3>
                  <p className="text-sm text-gray-500">{order.orderNumber}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-blue-600 mb-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </div>
                  <div className="space-y-1.5">
                    <div className="font-semibold text-gray-900">{order.customerName}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5" />
                      {order.customerPhone}
                      <button
                        onClick={() => toast.success('Phone number copied')}
                        className="ml-auto p-1 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </div>
                  <div className="text-sm text-gray-900 font-medium">{deliveryAddress}</div>
                  <button
                    onClick={() => toast.success('Address copied')}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy Address
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">Package Contents</div>
                  <div className="space-y-1">
                    {order.medications?.map((med, idx) => (
                      <div key={idx} className="text-sm text-gray-900 flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{med.name} ({med.dosage})</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-bold text-gray-900">{order.medications?.length} medications</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aggregator Selection */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="border-b border-gray-200 px-5 py-4 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-lg font-bold text-gray-900">Select Delivery Partner</h2>
                <p className="text-sm text-gray-600">Compare rates and rider availability</p>
              </div>

              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                {aggregators.map((aggregator) => (
                  <div
                    key={aggregator.id}
                    onClick={() => setSelectedAggregator(aggregator.id)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedAggregator === aggregator.id
                        ? `${aggregator.color} ${aggregator.bgColor} shadow-lg scale-[1.02]`
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 bg-white rounded-lg shadow-sm border ${aggregator.color}`}>
                          {getIcon(aggregator.icon)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{aggregator.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-semibold text-gray-700">{aggregator.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-600">{aggregator.totalDeliveries} deliveries</span>
                          </div>
                        </div>
                      </div>
                      {aggregator.id === 'dunzo' && (
                        <div className="px-2 py-1 bg-yellow-100 border border-yellow-400 rounded-full">
                          <span className="text-xs font-bold text-yellow-700">FASTEST</span>
                        </div>
                      )}
                      {aggregator.id === 'own' && (
                        <div className="px-2 py-1 bg-green-100 border border-green-400 rounded-full">
                          <span className="text-xs font-bold text-green-700">FREE</span>
                        </div>
                      )}
                    </div>

                    {/* Rider Info */}
                    {aggregator.riderName && (
                      <div className="mb-3 bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-gray-900">{aggregator.riderName}</div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600">{aggregator.riderRating}</span>
                            </div>
                          </div>
                          <Phone className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
                        <IndianRupee className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                        <div className="text-xs text-gray-500">Fee</div>
                        <div className="text-base font-bold text-gray-900">
                          {aggregator.price === 0 ? 'Free' : `₹${aggregator.price}`}
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
                        <Clock className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                        <div className="text-xs text-gray-500">ETA</div>
                        <div className="text-base font-bold text-gray-900">{aggregator.eta}</div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
                        <CheckCircle2 className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                        <div className="text-xs text-gray-500">Success</div>
                        <div className="text-base font-bold text-green-600">{aggregator.successRate}%</div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBooking(aggregator.name, aggregator.price);
                      }}
                      className={`w-full ${
                        aggregator.id === 'dunzo'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : aggregator.id === 'swiggy'
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : aggregator.id === 'shadowfax'
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      } text-white rounded-lg py-2.5 font-bold transition-colors shadow-md hover:shadow-lg text-sm`}
                    >
                      Book {aggregator.name.split('/')[0]}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}