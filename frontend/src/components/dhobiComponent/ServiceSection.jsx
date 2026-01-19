import React , {useState} from "react";
import { 
  Edit,
  Trash2
} from 'lucide-react';

const ServicesSection = ({ services, onEditService, onDeleteService }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">My Services</h3>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Add Service
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => onEditService(service)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => onDeleteService(service.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-lg font-semibold text-purple-600">{service.price}</p>
              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;