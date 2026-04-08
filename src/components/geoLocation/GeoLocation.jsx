import { useEffect, useState } from 'react'

class GeoLocationData {
    constructor(lat, long, elev) {
        this.createdAt = new Date();
        this.lat = lat;
        this.long = long;
        this.elev = elev;
    }

    getCreatedAt() {
        return this.createdAt;
    }


    getLatitude() {
        return this.lat;
    }

    setLatitude(lat) {
        this.lat = lat;
    }

    getLongitude() {
        return this.long;
    }

    setLongitude(long) {
        this.long = long;
    }

    getElevation() {
        return this.elev;
    }

    setElevation(elev) {
        this.elev = elev;
    }

}

export default function GeoLocation() {

    const [geoAPISupported, setGeoAPISupported] = useState(true);
    const [hasGeoData, setHasGeoData] = useState(false);
    const [geoAPIDenied, setGeoAPIDenied] = useState(false);
    const [geoData, setGeoData] = useState(new GeoLocationData(0, 0, 0));

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

            setGeoData(new GeoLocationData(latitude, longitude, altitude));
            setHasGeoData(true);

            console.log("GeoLocation data updated: ", geoData);

        }, (error) => {

            if (error.code === error.PERMISSION_DENIED) {
                console.error("User denied the request for Geolocation.");
                setGeoAPIDenied(true);
                setHasGeoData(false);
            }

        });

        if (geoAPIDenied) {
            return false;
        } else {
            return true;
        }

    }

    const handleManualSubmit = (lat, long, elev) => {
        const data = new GeoLocationData(
            Number(lat),
            Number(long),
            Number(elev) || 0
        );

        setGeoData(data);
        setHasGeoData(true);
        console.log("GeoLocation data updated (manual): ", geoData);
        //setGeoAPIDenied(false); // user recovered

    };


    return (
        <div className="container fluid">
            <h1>GeoLocation Test</h1>
            <p>This is a test page for the GeoLocation component.</p>

            <button className="btn btn-primary" onClick={checkGeoAutoAPI}>Get GeoLocation Data</button>

            < div className="container mt-4">
                {!geoAPIDenied ? (
                    <>
                        <h2> GeoLocation Data (GeoLocationAPI):</h2>
                        <p><strong>Latitude:</strong> {geoData.lat}</p>
                        <p><strong>Longitude:</strong> {geoData.long}</p>
                        <p><strong>Elevation:</strong> {geoData.elev} m</p>
                        <p><strong>Data Timestamp:</strong> {geoData.createdAt.toString()}</p>
                    </>
                ) : (
                    <>
                        <h3>Enter your location manually</h3>

                        <input id="lat" placeholder="Latitude" type="number" />
                        <input id="long" placeholder="Longitude" type="number" />
                        <input id="elev" placeholder="Elevation" type="number" />

                        <button
                            onClick={() =>
                                handleManualSubmit(
                                    document.getElementById("lat").value,
                                    document.getElementById("long").value,
                                    document.getElementById("elev").value
                                )
                            }
                        >
                            Submit
                        </button>
                    </>

                )
                }
            </div>

        </div >
    );
};