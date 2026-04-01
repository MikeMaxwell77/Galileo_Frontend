import axios from "axios";

// fetch the auth string from the vault
const rawAuthStr = import.meta.env.VITE_ASTRONOMY_API_AUTH_KEY;

// base 64 encode the auth string
const b64AuthStr = btoa(`${rawAuthStr}`)

// Get the bodies base URL
// https://docs.astronomyapi.com/endpoints/bodies
const bodiesURL = import.meta.env.VITE_ASTRONOMY_API_BODIES_BASE_URL;

// Setup the root url for the api and prepare the authorization header
export const AstronomyApiBodiesClient = axios.create(
    {
        baseURL: bodiesURL,
        headers: { Authorization: `Basic ${b64AuthStr}` }
    }
)

