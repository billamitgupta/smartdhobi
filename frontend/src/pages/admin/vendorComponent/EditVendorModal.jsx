import React, { useEffect, useState } from "react";
import { XCircle, AlertCircle, MapPin, Loader2 } from "lucide-react";
import axios from "axios";

// Component for editing vendor details
const EditVendorModal = ({ vendorId, onClose}) => {
  const [vendor, setVendor] = useState({});

  const fetchVendor = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/providers/profile/${vendorId}`
      );
      setVendor(res.data.provider);
    } catch (error) {
      console.error("Failed to fetch vendor:", error);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [vendorId]);

  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    serviceAreas: "",
    commissionRate: "",
    services: [],
    location: { type: "Point", coordinates: [] },
  });

  useEffect(() => {
    if (vendor && Object.keys(vendor).length > 0) {
      setFormData({
        name: vendor.name || "",
        owner: vendor.owner || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        address: vendor.address || "",
        serviceAreas: vendor.serviceAreas,
        commissionRate: vendor.commissionRate || "",
        services: vendor.services || [],
        location: vendor.location || { type: "Point", coordinates: [] },
      });
    }
  }, [vendor]);

  const [errors, setErrors] = useState({});
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [locationStatus, setLocationStatus] = useState("");

  const [serviceItem, setServiceItem] = useState({ name: "", price: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddService = () => {
    if (serviceItem.name && serviceItem.price) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, { ...serviceItem }],
      }));
      setServiceItem({ name: "", price: "" });
    }
  };

  const handleRemoveService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleServiceItemChange = (e) => {
    const { name, value } = e.target;
    setServiceItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create updated vendor object with form data
    const updatedVendor = {
      ...vendor,
      ...formData,
      serviceAreas: formData.serviceAreas,
    };

    const res = axios.patch(
      `${import.meta.env.VITE_APP_BASE_URL}/providers/profile/${vendorId}`,
      updatedVendor
    );

    console.log("Updated vendor data:", res);
    res
      .then((response) => {
        console.log("Vendor updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Failed to update vendor:", error);
        setErrors({ ...errors, form: "Failed to update vendor." });
      });
  };

  const getGeolocation = () => {
    setIsLoadingLocation(true);
    setLocationStatus("Detecting your location...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((data) => {
              const locationName =
                data.display_name ||
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

              setFormData((prev) => ({
                ...prev,
                serviceAreas: locationName,
                location: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
              }));

              setLocationStatus("Location detected successfully!");
              setIsLoadingLocation(false);

              if (errors.serviceAreas) {
                setErrors((prev) => ({ ...prev, serviceAreas: null }));
              }
            })
            .catch((err) => {
              console.error("Reverse geocoding failed:", err);
              setFormData((prev) => ({
                ...prev,
                serviceAreas: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                location: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
              }));
              setLocationStatus(
                "Coordinates saved, but couldn't get full address."
              );
              setIsLoadingLocation(false);
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          let message = "Failed to get your location.";
          if (error.code === 1) message = "Permission denied.";
          else if (error.code === 2) message = "Location unavailable.";
          else if (error.code === 3) message = "Request timed out.";

          setLocationStatus(message);
          setIsLoadingLocation(false);
          setErrors((prev) => ({ ...prev, serviceAreas: message }));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setLocationStatus("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
      setErrors((prev) => ({
        ...prev,
        serviceAreas: "Geolocation not supported by your browser.",
      }));
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">Edit Vendor</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Business Information
              </h4>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  rows="3"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  id="serviceAreas"
                  name="serviceAreas"
                  value={formData.serviceAreas}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.serviceAreas ? "border-red-300" : "border-gray-300"
                  } shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200`}
                  placeholder="Use current location or enter manually"
                  required
                />
                <button
                  type="button"
                  onClick={getGeolocation}
                  className="ml-2 p-2 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center"
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <MapPin size={20} />
                  )}
                </button>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="commissionRate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Commission Rate (%) *
                </label>
                <input
                  type="number"
                  id="commissionRate"
                  name="commissionRate"
                  value={formData.commissionRate}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Owner Information
              </h4>

              <div className="mb-4">
                <label
                  htmlFor="owner"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Owner Name *
                </label>
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Services & Pricing
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="min-w-full mb-4">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                      Service
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                      Price
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2 w-16">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.services.map((service, index) => (
                    <tr key={index}>
                      <td className="py-2 text-sm font-medium text-gray-900">
                        {service.name}
                      </td>
                      <td className="py-2 text-sm text-gray-500">
                        {service.price}
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveService(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label
                    htmlFor="serviceName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Service Name
                  </label>
                  <input
                    type="text"
                    id="serviceName"
                    name="name"
                    value={serviceItem.name}
                    onChange={handleServiceItemChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    placeholder="e.g. Dry Cleaning"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="servicePrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price
                  </label>
                  <input
                    type="text"
                    id="servicePrice"
                    name="price"
                    value={serviceItem.price}
                    onChange={handleServiceItemChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    placeholder="e.g. ₹5.00/item"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="font-medium rounded-lg text-sm px-5 py-2.5 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 mt-1"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-6 flex justify-end">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="font-medium rounded-lg text-sm px-5 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="font-medium rounded-lg text-sm px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVendorModal;
