import { useEffect, useState } from 'react'



export function useGeoLocation() {

    const [geoAPISupported, setGeoAPISupported] = useState(true);
    const [hasGeoData, setHasGeoData] = useState(false);
    const [geoManualInput, setGeoManualInput] = useState({ longitude: 0, latitude: 0, elevation: 0 });
    const [geoAPIDenied, setGeoAPIDenied] = useState(false);
    const [geoData, setGeoData] = useState(null);

    const CreateGeoLocationData = (lat, long, elev) => {
        return {
            latitude: lat,
            longitude: long,
            elevation: elev || 0,
            createdAt: new Date()
        }
    };

    const getLocation = () => {
        return new Promise((resolve, reject) => {

            if (!navigator.geolocation) {
                setGeoAPISupported(false);
                reject("Geolocation not supported");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let { latitude, longitude, altitude } = position.coords;

                    const data = createGeoData(
                        latitude,
                        longitude,
                        altitude || 0
                    );

                    setGeoData(data);
                    setHasGeoData(true);
                    setGeoAPIDenied(false);

                    resolve(data); // 🔥 KEY
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        setGeoAPIDenied(true);
                        setHasGeoData(false);
                    }

                    reject(error);
                }
            );
        });
    };

    const checkGeoAutoAPI = () => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");

            return false;
        }


        navigator.geolocation.getCurrentPosition((position) => {

            let { latitude, longitude, altitude } = position.coords;

            if (altitude === null) {
                altitude = 0;
            }

            setGeoData(CreateGeoLocationData(latitude, longitude, altitude));
            setHasGeoData(true);

            console.log("GeoLocation data updated: ", geoData);

        }, (error) => {

            if (error.code === error.PERMISSION_DENIED) {
                console.error("User denied the request for Geolocation.");
                setGeoAPIDenied(true);
                setHasGeoData(false);
            }

        });

    }

    const setManualLocation = (lat, long, elev) => {
        const data = CreateGeoLocationData(lat, long, elev);
        setGeoData(data);
        setGeoAPIDenied(false);
        setHasGeoData(true);
        return data;
    };


    return {
        geoData,
        hasGeoData,
        geoAPIDenied,
        geoAPISupported,
        getLocation,      // callable
        setManualLocation, // callable
        checkGeoAutoAPI     // callable
    };
};