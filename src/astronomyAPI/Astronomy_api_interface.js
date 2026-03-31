import axios from "axios";

// fetch and encode the auth string for astronomy API
const rawAuthStr = import.meta.env.VITE_ASTRONOMY_API_AUTH_KEY;
const b64AuthStr = btoa(`${rawAuthStr}`)

// Get the bodies base URL
// https://docs.astronomyapi.com/endpoints/bodies
const bodiesURL = import.meta.env.VITE_ASTRONOMY_API_BODIES_BASE_URL;

console.log("bodiesURL", bodiesURL )

export const AstronomyApiBodiesClient = axios.create(
    {
        baseURL: bodiesURL,
        headers: { Authorization: `Basic ${b64AuthStr}` }
    }
)

