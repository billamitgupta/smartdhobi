import { useState } from "react";


function useGetLocation(setFormData, setErrors) {
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationStatus, setLocationStatus] = useState("");

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
                        .then((response) => response.json())
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

                            setErrors((prev) => ({ ...prev, serviceAreas: null }));
                        })
                        .catch((error) => {
                            setFormData((prev) => ({
                                ...prev,
                                serviceAreas: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                                location: {
                                    type: "Point",
                                    coordinates: [longitude, latitude],
                                },
                            }));
                            setLocationStatus("Got coordinates, but couldn't get address.");
                            setIsLoadingLocation(false);
                        });
                },
                (error) => {
                    let errorMessage = "Failed to get your location.";
                    if (error.code === 1) {
                        errorMessage =
                            "Location access denied. Please enable location services.";
                    } else if (error.code === 2) {
                        errorMessage = "Location unavailable. Please try again.";
                    } else if (error.code === 3) {
                        errorMessage = "Location request timed out. Please try again.";
                    }
                    setLocationStatus(errorMessage);
                    setIsLoadingLocation(false);
                    setErrors((prev) => ({ ...prev, serviceAreas: errorMessage }));
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

    return { getGeolocation, isLoadingLocation, locationStatus };
}

export default useGetLocation;
