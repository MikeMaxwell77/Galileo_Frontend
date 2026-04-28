// BookmarkServices.js
import axios from "axios"
import AuthenticationService from "../auth/AuthenticationService";

const BOOKMARK_BACKEND_URL = `${import.meta.env.VITE_GALILEO_BACKEND_API_ROUTE}/bookmark`;
const BOOKMARKS_BACKEND_URL = `${import.meta.env.VITE_GALILEO_BACKEND_API_ROUTE}/bookmarks`;

const BookmarkService = {
    BOOKMARKS_BACKEND_URL,
    BOOKMARK_BACKEND_URL,
    // Utility Funcitons
    LongToDate : async (ms) => {
        const date = new Date(ms);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    },
    // Example usage UI:
    // <span>{LongToDate(sig.timestamp)}</span>

    DateToLong : async (date) => {
        const dateLong = new Date(date).getTime();
        return dateLong;
    },


    // Bookmark Functions
    CreateNewBookmark : async ({  
            objectAPIIdentifier, 
            whichAPI,
            displayName,
            date,
            latitude, 
            longitude 
    }) => {
        if (!AuthenticationService.isAuthenticated()) return;

        if (date === null){
            date = new Date(date).getTime();
        }

        const userID = AuthenticationService.getUserID();

        try {
            const response = await axios.post(BOOKMARK_BACKEND_URL, {
                accountID: userID,
                whichAPI: whichAPI,
                displayName: displayName,
                API_identifier: objectAPIIdentifier,
                timestamp: new Date().getTime(),
                date: date,
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
    },
    GetBookmarks: async (userID) => {
        if (!AuthenticationService.isAuthenticated()) return;
        
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

    },
    UpdateBookmarkDate: async (bookmarkID, newDate) => {
        if (!AuthenticationService.isAuthenticated()) return;
        console.log("newdate: ",newDate);
        try {
            const response = await axios.put(`${BOOKMARK_BACKEND_URL}/${bookmarkID}`, {
                date: newDate
            }, {
                headers: AuthenticationService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Update bookmark date error:", error);
            throw error;
        }
    },
    DeleteBookmarkByID: async (bookmarkID) => {
        if (!AuthenticationService.isAuthenticated()) return;

        try {
            const response = await axios.delete(`${BOOKMARK_BACKEND_URL}/${bookmarkID}`,
                {
                    headers: AuthenticationService.getAuthHeader()
                }
            );

            return response.data;
        } catch (error) {
            console.error("delete user bookmark error:", error.response?.data || error.message);
            throw error;
        }

    }


}

export default BookmarkService;