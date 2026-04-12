import { useEffect, useState } from "react"

import AuthenticationService from "../../auth/AuthenticationService"
import BookmarkService from "../../GalileoBackendServices/BookmarksService"

export default function BookmarksDebug() {
    const [authenticated, setAuthenticated] = useState(false);


    useEffect(() => {
        if(AuthenticationService.isAuthenticated()) setAuthenticated(true);
    }, [])

    return (
        <div>
            <h1>Bookmarks dev page!</h1>
            {authenticated && (
                <div>
                    <h4>You are logged in!</h4>
                    <p>Your user id is: {AuthenticationService.getUserID()}</p>
                </div>
            )}
        </div>
    )
}

