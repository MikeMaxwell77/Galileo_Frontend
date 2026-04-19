// nasaSatelliteService.js

const SSC_BASE = "https://sscweb.gsfc.nasa.gov/WS/sscr/2";

// Helper: unwraps ["java.SomeType", actualValue] → actualValue
const unwrap = (arr) => Array.isArray(arr) ? arr[1] : arr;

const parseSatellite = (rawSat) => {
  const sat = unwrap(rawSat); // unwrap ObservatoryDescription wrapper
  return {
    Id: sat.Id,
    Name: sat.Name,
    Resolution: sat.Resolution,
    StartTime: unwrap(sat.StartTime), // unwrap XMLGregorianCalendar wrapper
    EndTime: unwrap(sat.EndTime),
    ResourceId: sat.ResourceId ?? null,
  };
};

export const SatelliteInterface = {
  FetchAllSatellites: async () => {
    const res = await fetch(`${SSC_BASE}/observatories`, {
      headers: { Accept: "application/json" }
    });
    const raw = await res.json();

    // raw = ["gov.nasa.gsfc.sscweb.schema.ObservatoryResponse", { Observatory: [...] }]
    const responseBody = unwrap(raw);                        // → { Observatory: [...] }
    const observatoryWrapper = responseBody.Observatory;     // → ["java.util.ArrayList", [...]]
    const observatoryList = unwrap(observatoryWrapper);      // → array of 308 raw satellites

    return observatoryList.map(parseSatellite);
  }
};