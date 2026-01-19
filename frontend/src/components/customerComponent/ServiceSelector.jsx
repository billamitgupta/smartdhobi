import React from 'react';

const ServiceSelector = ({ services, selectedServices, onServiceQuantityChange }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Services</h2>
   
    <div className="space-y-6">
      {services.map((service) => {
        const currentQuantity = selectedServices[service._id] || 0;
        
        return (
          <div
            key={service._id}
            className={`p-4 border-2 rounded-lg transition-all ${
              currentQuantity > 0
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-800 capitalize">{service.name}</h3>
                <p className="text-lg font-semibold text-purple-600">₹{service.price}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onServiceQuantityChange(service._id, Math.max(0, currentQuantity - 1))}
                  disabled={currentQuantity === 0}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentQuantity === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  -
                </button>
                
                <span className="text-xl font-semibold w-8 text-center">
                  {currentQuantity}
                </span>
                
                <button
                  onClick={() => onServiceQuantityChange(service._id, currentQuantity + 1)}
                  className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            
            {currentQuantity > 0 && (
              <div className="bg-white rounded p-2 text-sm">
                <span className="text-gray-600">Subtotal: </span>
                <span className="font-semibold text-purple-600">
                  ₹{parseInt(service.price) * currentQuantity}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default ServiceSelector;