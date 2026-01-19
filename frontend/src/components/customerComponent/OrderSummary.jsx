import React from 'react';
import { Calculator } from 'lucide-react';

const OrderSummary = ({ selectedServices, services, pickupAddress, deliveryAddress, onBookService, isBooking }) => {
  // Check if any services are selected
  const hasSelectedServices = Object.keys(selectedServices).length > 0;
  
  if (!hasSelectedServices) return null;

  // Calculate total and prepare service details
  let total = 0;
  const serviceDetails = Object.entries(selectedServices).map(([serviceId, quantity]) => {
    const service = services.find(s => s._id === serviceId);
    const subtotal = parseInt(service.price) * quantity;
    total += subtotal;
    
    return {
      name: service.name,
      price: service.price,
      quantity,
      subtotal
    };
  });

  const isFormValid = pickupAddress && pickupAddress.trim() && deliveryAddress && deliveryAddress.trim();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Calculator className="w-5 h-5 mr-2" />
        Order Summary
      </h2>
      
      <div className="space-y-3 mb-6">
        {serviceDetails.map((service, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <div>
              <span className="capitalize font-medium">{service.name}</span>
              <span className="text-gray-500 text-sm block">
                ₹{service.price} × {service.quantity}
              </span>
            </div>
            <span className="font-semibold">₹{service.subtotal}</span>
          </div>
        ))}
        
        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-purple-600">₹{total}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onBookService(total)}
        disabled={!isFormValid || isBooking}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          isFormValid && !isBooking
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isBooking 
          ? 'Booking...' 
          : isFormValid 
            ? `Book Service - ₹${total}` 
            : 'Please fill pickup & delivery addresses'
        }
      </button>
    </div>
  );
};

export default OrderSummary;