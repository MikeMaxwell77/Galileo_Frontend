// api.weather.gov — free, no key required, US locations only
export const WeatherService = {
  FetchForecastForDate: async ({ latitude, longitude, date }) => {
    const lat = parseFloat(latitude).toFixed(4);
    const lon = parseFloat(longitude).toFixed(4);

    const pointRes = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
    if (!pointRes.ok) throw new Error(`Weather grid lookup failed (${pointRes.status}) — location may be outside the US.`);
    const pointData = await pointRes.json();

    const forecastUrl = pointData.properties?.forecast;
    if (!forecastUrl) throw new Error("No forecast URL returned from weather service.");

    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) throw new Error(`Forecast fetch failed (${forecastRes.status}).`);
    const forecastData = await forecastRes.json();

    const periods = forecastData.properties?.periods ?? [];
    const targetStr = new Date(date).toDateString();

    const matching = periods.filter(p => new Date(p.startTime).toDateString() === targetStr);
    return matching.length > 0 ? matching : periods.slice(0, 2);
  }
};
