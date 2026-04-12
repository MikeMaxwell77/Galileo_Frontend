import { useEffect, useState } from "react"

import AuthenticationService from "../../auth/AuthenticationService"
import BookmarkService from "../../GalileoBackendServices/BookmarksService"
import { useGeoLocation } from "../../components/geoLocation/GeoLocation";

export default function BookmarksDebug() {
    const [authenticated, setAuthenticated] = useState(false);
    const [data, setData] = useState([]);

    const [otherData, setOtherData] = useState([]);

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

    const handleLoadBookmarks = async () => {
        const bookmarksData = await BookmarkService.GetAuthUserBookmarks();
        if (bookmarksData) setData(bookmarksData);
        //console.log(bookmarksData)
    }

    const handleLoadOtherUserBookmarks = async (userID) => {
        const otherBMs = await BookmarkService.GetBookmarks(userID);
        if (otherBMs ) setOtherData(otherBMs)
        console.log(otherBMs);
    }

    return (
        <div classNameName="container mt-4">

                
            <div className="text-center mb-4">
                <h1>Test Dashboard</h1>
                <p className="text-muted">Quick UI for debugging and testing</p>
            </div>

            <div className="row">

                
                <div className="col-md-6">
                    <div className="card mb-3">
                        <div className="card-header">Info Display</div>
                        <div className="card-body">
                            

                            {authenticated && (
                                <>
                                <p>You Are authenticated!</p>
                                <ul id="infoList" className="list-group">
                                    <li className="list-group-item">Your user id is: {AuthenticationService.getUserID()}</li>
                                </ul>
                                </>
                            )}

                            { hasGeoData && (
                                <>
                                    <p>GeoLocationData available</p>
                                    <ul id="infoList" className="list-group">
                                        <li className="list-group-item">Latitude: {geoData.latitude}</li>
                                        <li className="list-group-item">Longitude: {geoData.longitude}</li>
                                        <li className="list-group-item">Elevation: {geoData.elevation}</li>
                                        <li className="list-group-item">Updated: {geoData.createdAt.toString()}</li>
                                    </ul>
                                </>
                            )}

                            
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-header">My saved bookmarks</div>
                        <div className="card-body d-flex gap-2 flex-wrap">
                            <button className="btn btn-primary" onClick={() => handleLoadBookmarks()}>Load My Bookmarks</button>
                        </div>

                        <div>
                            {data && data.map((item) => (
                                <div key={item.id} className="card">
                                    <h3>{item.api_identifier}</h3>
                                    <p>bkid: {item.id}</p>
                                    <p>Lat: {item.latitude}</p>
                                    <p>Lon: {item.longitude}</p>
                                    <p>Time: {new Date(item.timestamp * 1000).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                
                <div className="col-md-6">


                    <div className="card">
                        <div className="card-header">Input</div>
                        <div className="card-body">
                            <form id="testForm">
                                <div className="mb-3">
                                    <label className="form-label">Object API identifier</label>
                                    <input type="text" className="form-control" id="objAPIid" placeholder="Enter object API id"/>
                                </div>


                                <button type="button" className="btn btn-primary" onClick={() => handleCreateBookmark(document.getElementById("objAPIid").value)}>CreateBookmark</button>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">Search for another users bookmarks</div>
                        <div className="card-body">
                            <form id="testForm">
                                <div className="mb-3">
                                    <label className="form-label">Query user id</label>
                                    <input type="text" className="form-control" id="queryUserId" placeholder="Enter User id" />
                                </div>

                                <button type="button" className="btn btn-primary" onClick={() => handleLoadOtherUserBookmarks(document.getElementById("queryUserId").value)}>CreateBookmark</button>
                            </form>

                            <div>
                                {otherData && otherData.map((item) => (
                                    <div key={item.id} className="card">
                                        <h3>{item.api_identifier}</h3>
                                        <p>bkid: {item.id}</p>
                                        <p>Lat: {item.latitude}</p>
                                        <p>Lon: {item.longitude}</p>
                                        <p>Time: {new Date(item.timestamp * 1000).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

