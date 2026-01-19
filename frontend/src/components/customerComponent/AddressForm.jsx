import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import useGetLocation from '../../auth/getLocation'; // Adjust import path as needed

const AddressForm = ({ 
  pickupAddress, 
  setPickupAddress, 
  deliveryAddress, 
  setDeliveryAddress, 
  pickupTime, 
  setPickupTime, 
  deliveryTime, 
  setDeliveryTime,
  formData,
  setFormData,
  errors,
  setErrors
}) => {
  
  // Create separate formData handlers for pickup and delivery
  const handlePickupLocationData = (locationData) => {
    setFormData(prev => ({
      ...prev,
      pickupLocation: locationData.location
    }));
    setPickupAddress(locationData.serviceAreas);
  };

  const handleDeliveryLocationData = (locationData) => {
    setFormData(prev => ({
      ...prev,
      deliveryLocation: locationData.location
    }));
    setDeliveryAddress(locationData.serviceAreas);
  };

  // Create custom setFormData functions that work with your existing hook
  const setPickupFormData = (updateFunction) => {
    const locationData = updateFunction({});
    handlePickupLocationData(locationData);
  };

  const setDeliveryFormData = (updateFunction) => {
    const locationData = updateFunction({});
    handleDeliveryLocationData(locationData);
  };

  // Location hooks for both pickup and delivery
  const { 
    getGeolocation: getPickupLocation, 
    isLoadingLocation: isLoadingPickupLocation, 
    locationStatus: pickupLocationStatus 
  } = useGetLocation(setPickupFormData, setErrors);

  const { 
    getGeolocation: getDeliveryLocation, 
    isLoadingLocation: isLoadingDeliveryLocation, 
    locationStatus: deliveryLocationStatus 
  } = useGetLocation(setDeliveryFormData, setErrors);

  const handlePickupAddressChange = (e) => {
    const value = e.target.value;
    setPickupAddress(value);
    // Clear location data when manually entering address
    setFormData(prev => ({
      ...prev,
      pickupLocation: null
    }));
  };

  const handleDeliveryAddressChange = (e) => {
    const value = e.target.value;
    setDeliveryAddress(value);
    // Clear location data when manually entering address
    setFormData(prev => ({
      ...prev,
      deliveryLocation: null
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2" />
        Pickup & Delivery Details
      </h2>
     
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pickup Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Pickup Address *
            </label>
            <button
              type="button"
              onClick={getPickupLocation}
              disabled={isLoadingPickupLocation}
              className="flex items-center px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Navigation className="w-3 h-3 mr-1" />
              {isLoadingPickupLocation ? 'Getting...' : 'Current Location'}
            </button>
          </div>
          
          <textarea
            value={pickupAddress}
            onChange={handlePickupAddressChange}
            placeholder="Enter your pickup address or click 'Current Location'..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows="3"
            required
          />
          
          {pickupLocationStatus && (
            <p className={`text-xs mt-1 ${
              pickupLocationStatus.includes('successfully') 
                ? 'text-green-600' 
                : pickupLocationStatus.includes('Failed') || pickupLocationStatus.includes('denied')
                ? 'text-red-600'
                : 'text-blue-600'
            }`}>
              {pickupLocationStatus}
            </p>
          )}

          {errors?.pickupAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.pickupAddress}</p>
          )}
         
          <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
            Preferred Pickup Time
          </label>
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
       
        {/* Delivery Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Delivery Address *
            </label>
            <button
              type="button"
              onClick={getDeliveryLocation}
              disabled={isLoadingDeliveryLocation}
              className="flex items-center px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Navigation className="w-3 h-3 mr-1" />
              {isLoadingDeliveryLocation ? 'Getting...' : 'Current Location'}
            </button>
          </div>
          
          <textarea
            value={deliveryAddress}
            onChange={handleDeliveryAddressChange}
            placeholder="Enter your delivery address or click 'Current Location'..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows="3"
            required
          />
          
          {deliveryLocationStatus && (
            <p className={`text-xs mt-1 ${
              deliveryLocationStatus.includes('successfully') 
                ? 'text-green-600' 
                : deliveryLocationStatus.includes('Failed') || deliveryLocationStatus.includes('denied')
                ? 'text-red-600'
                : 'text-blue-600'
            }`}>
              {deliveryLocationStatus}
            </p>
          )}

          {errors?.deliveryAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress}</p>
          )}
         
          <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
            Preferred Delivery Time
          </label>
          <input
            type="time"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;