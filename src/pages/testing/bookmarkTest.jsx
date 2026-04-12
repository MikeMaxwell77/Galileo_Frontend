import { useEffect, useState } from "react"

import AuthenticationService from "../../auth/AuthenticationService"
import BookmarkService from "../../GalileoBackendServices/BookmarksService"
import { useGeoLocation } from "../../components/geoLocation/GeoLocation";

export default function BookmarksDebug() {
    const [authenticated, setAuthenticated] = useState(false);

    const { geoData, geoAPIDenied, hasGeoData, getLocation, checkGeoAutoAPI, setManualLocation } = useGeoLocation();

    useEffect(() => {
        if(AuthenticationService.isAuthenticated()) setAuthenticated(true);
    }, [])

    const handleCreateBookmark = (objAPIid) => {
        BookmarkService.CreateNewBookmark({
            objectAPIIdentifier: objAPIid,
            latitude: geoData.latitude || 0,
            longitude: geoData.longitude || 0
        })
    }

    const handleLoadBookmarks = () => {
        
    }

    return (
        <div class="container mt-4">

                
            <div class="text-center mb-4">
                <h1>Test Dashboard</h1>
                <p class="text-muted">Quick UI for debugging and testing</p>
            </div>

            <div class="row">

                
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header">Info Display</div>
                        <div class="card-body">
                            

                            {authenticated && (
                                <>
                                <p>You Are authenticated!</p>
                                <ul id="infoList" class="list-group">
                                    <li class="list-group-item">Your user id is: {AuthenticationService.getUserID()}</li>
                                </ul>
                                </>
                            )}

                            { hasGeoData && (
                                <>
                                    <p>GeoLocationData available</p>
                                    <ul id="infoList" class="list-group">
                                        <li class="list-group-item">Latitude: {geoData.latitude}</li>
                                        <li class="list-group-item">Longitude: {geoData.longitude}</li>
                                        <li class="list-group-item">Elevation: {geoData.elevation}</li>
                                        <li class="list-group-item">Updated: {geoData.createdAt.toString()}</li>
                                    </ul>
                                </>
                            )}

                            
                        </div>
                    </div>
                </div>

                
                <div class="col-md-6">

                    
                    <div class="card mb-3">
                        <div class="card-header">Actions</div>
                        <div class="card-body d-flex gap-2 flex-wrap">
                            <button class="btn btn-primary" onclick="loadData()">Load My Bookmarks</button>
                            
                        </div>
                    </div>

                    
                    <div class="card">
                        <div class="card-header">Input</div>
                        <div class="card-body">
                            <form id="testForm">
                                <div class="mb-3">
                                    <label class="form-label">Object API identifier</label>
                                    <input type="text" class="form-control" id="objAPIid" placeholder="Enter object API id"/>
                                </div>


                                <button type="button" class="btn btn-primary" onClick={() => handleCreateBookmark(document.getElementById("objAPIid").value)}>CreateBookmark</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

