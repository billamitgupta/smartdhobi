import React from "react";
import { useState, useEffect } from "react";
import DhobiInfo from "../../components/customerComponent/DhobiInfo";
import ServiceSelector from "../../components/customerComponent/ServiceSelector";
import OrderSummary from "../../components/customerComponent/OrderSummary";
import { fetchDhobiById, saveOrder } from "../../auth/ApiConnect";
import AddressForm from "../../components/customerComponent/AddressForm";

export default function DhobiBookingService() {
  const [dhobi, setDhobi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServices, setSelectedServices] = useState({});
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  
  // Add formData state to store location information
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    pickupLocation: null,
    deliveryLocation: null
  });
  
  // Add errors state for location errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadDhobiData = async () => {
      try {
        const pathParts = window.location.pathname.split('/');
        const dhobiId = pathParts[pathParts.length - 1] || '675e123456789';
        
        const dhobiData = await fetchDhobiById(dhobiId);
        setDhobi(dhobiData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDhobiData();
  }, []);

  const generateOrderId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return 'ORD' + randomNum;
  };

  const handleServiceQuantityChange = (serviceId, quantity) => {
    setSelectedServices(prev => {
      const updated = { ...prev };
      if (quantity <= 0) {
        delete updated[serviceId];
      } else {
        updated[serviceId] = quantity;
      }
      return updated;
    });
  };

  const handleBookService = async (total) => {
    if (!pickupAddress.trim() || !deliveryAddress.trim()) {
      alert('Please fill in both pickup and delivery addresses');
      return;
    }

    if (Object.keys(selectedServices).length === 0) {
      alert('Please select at least one service');
      return;
    }

    setIsBooking(true);
    
    try {
      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const userId = userData._id || 'mockUserId123'; 

      console.log(userId , "faflkajflkdsj")
      
      if (!userId) {
        alert('Please login to book a service');
        return;
      }

      const servicesArray = Object.entries(selectedServices).map(([serviceId, quantity]) => {
        const service = dhobi.services.find(s => s._id === serviceId);
        return {
          name: service.name,
          quantity: quantity,
          price: parseInt(service.price)
        };
      });

      // Include location data in order if available
      const orderData = {
        orderId: generateOrderId(),
        userId: userId,
        providerId: dhobi._id,
        services: servicesArray,
        pickupAddress: pickupAddress.trim(),
        deliveryAddress: deliveryAddress.trim(),
        pickupTime: pickupTime || '',
        deliveryTime: deliveryTime || '',
        amount: total.toString(),
        status: 'pending',
        paymentStatus: 'pending',
        // Include location data if available
        ...(formData.pickupLocation && { pickupLocation: formData.pickupLocation }),
        ...(formData.deliveryLocation && { deliveryLocation: formData.deliveryLocation })
      };

      console.log('Order Data:', orderData);
      
      const savedOrder = await saveOrder(orderData);
      
      alert(`Service booked successfully! Order ID: ${savedOrder.orderId || orderData.orderId}`);
      
      // Reset form
      setSelectedServices({});
      setPickupAddress('');
      setDeliveryAddress('');
      setPickupTime('');
      setDeliveryTime('');
      setFormData({
        pickupAddress: '',
        deliveryAddress: '',
        pickupLocation: null,
        deliveryLocation: null
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Failed to book service. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dhobi details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dhobi) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Dhobi not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full mx-auto px-4">
        <DhobiInfo dhobi={dhobi} />
        
        <ServiceSelector
          services={dhobi.services}
          selectedServices={selectedServices}
          onServiceQuantityChange={handleServiceQuantityChange}
        />
        
        {Object.keys(selectedServices).length > 0 && (
          <AddressForm
            pickupAddress={pickupAddress}
            setPickupAddress={setPickupAddress}
            deliveryAddress={deliveryAddress}
            setDeliveryAddress={setDeliveryAddress}
            pickupTime={pickupTime}
            setPickupTime={setPickupTime}
            deliveryTime={deliveryTime}
            setDeliveryTime={setDeliveryTime}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        
        <OrderSummary
          selectedServices={selectedServices}
          services={dhobi.services}
          pickupAddress={pickupAddress}
          deliveryAddress={deliveryAddress}
          onBookService={handleBookService}
          isBooking={isBooking}
        />
      </div>
    </div>
  );
}