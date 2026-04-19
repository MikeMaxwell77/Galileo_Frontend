import axios from "axios";

// api.weather.gov — free, no key required, US locations only
export const WeatherService = {
  FetchForecastForDate: async ({ latitude, longitude, date }) => {
    const lat = parseFloat(latitude).toFixed(4);
    const lon = parseFloat(longitude).toFixed(4);

    const pointRes = await axios.get(`https://api.weather.gov/points/${lat},${lon}`);
    const forecastUrl = pointRes.data.properties?.forecast;
    if (!forecastUrl) throw new Error("No forecast URL returned from weather service.");

    const forecastRes = await axios.get(forecastUrl);
    const periods = forecastRes.data.properties?.periods ?? [];
    const targetStr = new Date(date).toDateString();

    const matching = periods.filter(p => new Date(p.startTime).toDateString() === targetStr);
    return matching.length > 0 ? matching : [];
  }
};
