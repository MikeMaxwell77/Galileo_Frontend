import { useEffect } from "react";
import { SatelliteInterface } from "../../GalileoBackendServices/nasaSatelliteService.js";

export default function SatelliteApiTest() {
  useEffect(() => {
    SatelliteInterface.FetchAllSatellites()
      .then(satellites => {
        console.log("Total satellites:", satellites.length);      // should be 308
        console.table(satellites.slice(0, 5));    
      })
      .catch(err => console.error("FAILED:", err));
  }, []);

  return <div>Check console</div>;
}