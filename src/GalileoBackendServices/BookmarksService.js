import axios from "axios"
import AuthenticationService from "../auth/AuthenticationService";

const BOOKMARK_BACKEND_URL = `${import.meta.env.VITE_GALILEO_BACKEND_API_ROUTE}/bookmark`;
const BOOKMARKS_BACKEND_URL = `${import.meta.env.VITE_GALILEO_BACKEND_API_ROUTE}/bookmarks`;

const BookmarkService = {
    BOOKMARKS_BACKEND_URL,
    BOOKMARK_BACKEND_URL,

    CreateNewBookmark : async ({  
            objectAPIIdentifier, 
            latitude, 
            longitude 
    }) => {
        if (!AuthenticationService.isAuthenticated()) return;

        const userID = AuthenticationService.getUserID();

        try {
            const response = await axios.post(BOOKMARK_BACKEND_URL, {
                accountID: userID,
                whichAPI: "AstronomyAPI",
                API_identifier: objectAPIIdentifier,
                timestamp: new Date().getTime(),
                latitude: latitude,
                longitude: longitude
            },
            {
                headers: AuthenticationService.getAuthHeader()
            }
        );

            return response.data;
        } catch (error) {
            console.error("Registration error:", error.response?.data || error.message);
            throw error;
        }

    },
    GetAuthUserBookmarks: async () => {
        if (!AuthenticationService.isAuthenticated()) return;
        const userID = AuthenticationService.getUserID();

        try {
            const response = await axios.get(`${BOOKMARKS_BACKEND_URL}/${userID}`, {},
                {
                    headers: AuthenticationService.getAuthHeader()
                }
            );

            return response.data;
        } catch (error) {
            console.error("Fetch user bookmarks error:", error.response?.data || error.message);
            throw error;
        }

    }


}

export default BookmarkService;