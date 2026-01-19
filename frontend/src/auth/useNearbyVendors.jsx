
import React , {useState} from "react"
import { getAllDhobis } from "./ApiConnect";
const useNearbyVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  const searchNearbyVendors = async (userLocation, radius = 5000) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be your API endpoint
      // const response = await fetch('/api/vendors/nearby', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ location: userLocation, radius })
      // });
      
      // Mock data based on your dhobi structure
      const mockDhobis = await getAllDhobis();

      // location on off
      const userLat = userLocation.coordinates[1];
      const userLng = userLocation.coordinates[0];
      // const userLat = 22.7227885;
      // const userLng = 75.917358;
      const radiusInKm = radius / 1000;

      console.log("User Location:", userLat, userLng, mockDhobis);
      const nearbyVendors = mockDhobis
        .filter(dhobi => dhobi.isActive && dhobi.isApproved === 'approved')
        .map(dhobi => {
          const distance = calculateDistance(
            userLat, userLng,
            dhobi.location.coordinates[1], dhobi.location.coordinates[0]
          );
          return { ...dhobi, distance: parseFloat(distance.toFixed(1)) };
        })
        .filter(dhobi => dhobi.distance <= radiusInKm)
        .sort((a, b) => a.distance - b.distance);

      setVendors(nearbyVendors);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { vendors, loading, error, searchNearbyVendors };
};

export default useNearbyVendors;