import React, { useState } from "react";
import { useGeoLocation } from "./GeoLocation";



export default function GeoLocationTestPage() {

    const { geoData, geoAPIDenied, hasGeoData, getLocation, checkGeoAutoAPI, setManualLocation } = useGeoLocation();

    const handleClick = async () => {
        const geo = await getLocation();
        console.log(geo);
    };

    const handleManualSubmit = (lat, long, elev) => {
        setManualLocation(lat, long, elev);

        //setGeoAPIDenied(false); // user recovered

    };

    return (
        <div className="container fluid">
            <h1>GeoLocation Test</h1>
            <p>This is a test page for the GeoLocation component.</p>

            {!hasGeoData && <button className="btn btn-primary" onClick={checkGeoAutoAPI}>Get GeoLocation Data</button>}

            {!hasGeoData && geoAPIDenied && (
                <div>
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
                </div>
            )}

            < div className="container mt-4">
                {!geoAPIDenied ? (
                    <h3>Automatic GeoLocation data</h3>
                ) : (

                    <h3>Manual GeoLocation data</h3>

                )
                }
            </div>

            <div className="container mt-4">
                {hasGeoData && (
                    <div>
                        <h3>Current GeoLocation Data:</h3>
                        <p>Latitude: {geoData.latitude}</p>
                        <p>Longitude: {geoData.longitude}</p>
                        <p>Elevation: {geoData.elevation}</p>
                        <p>Timestamp: {geoData.createdAt.toString()}</p>
                    </div>
                )}
            </div>

        </div >
    )

}