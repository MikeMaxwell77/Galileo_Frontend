import { useEffect, useState } from 'react'
import { AstronomyBodiesInterface, AstronomySearchInterface } from './../astronomyAPI/BodiesApi'


export default function ExplorePageDebug() {
    const [posData, setPosData] = useState(null);
    const [bodyNames, setBodyNames] = useState(null);
    const [observerPos, setObserverPos] = useState({ lat: 32.06, long: -81.15, elev: 0 })
    const [selectedBody, setSelectedBody] = useState("");
    const [selectedBodyData, setSelectedBodyData] = useState(null);

    const loadData = async () => {
        let namesData = [];
        let bodyPosData = [];

        try {
            // Get the bodies available in the position api
            const namesResponse = await AstronomyBodiesInterface.FetchNamedBodies();

            namesData = namesResponse.data.bodies;

        } catch (err) {
            console.error("Error while fetching body names", err)
            namesData = [];
        }

        try {
            // Fetch the position data a week forward
            const bodyPosRes = await AstronomyBodiesInterface.FetchAllBodyPositionsWFN({
                latitude: observerPos.lat,
                longitude: observerPos.long,
                elevation: observerPos.elev
            });

            bodyPosData = bodyPosRes.data;

        } catch (err) {
            console.error("Error while fetching body positions", err)
            bodyPosData = [];
        }

        return {
            names: namesData,
            positions: bodyPosData
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const APIdata = await loadData();

            setBodyNames(APIdata.names);
            setPosData(APIdata.positions)

        }
        fetchData()


    }, [])

    useEffect(() => {
        console.log("Names data", bodyNames);
        console.log("Pos data", posData);
    }, [posData, bodyNames])

    useEffect(() => {
        console.log("SelectedBody:", selectedBody);

        // filter the fetched data using the body id
        const selectedBodyData = posData?.table?.rows?.find(
            (row) => row.entry.id === selectedBody
        );

        // update the selectedBodyData
        setSelectedBodyData(selectedBodyData);

    }, [selectedBody])

    return (
        <div>
            <h1>Demo explore page</h1>
            <div>
                <a>Select the body of interest: </a>
                <select
                    value={selectedBody}
                    onChange={(e) => setSelectedBody(e.target.value)}
                >
                    <option value="">Select a body</option>
                    {bodyNames?.map((bodyName) => {
                        return (<option key={bodyName} value={bodyName}>{bodyName}</option>)
                    })}
                </select>
            </div>

            <div className="container-fluid">
                <h3>Currently displays Alt-Az system (https://www.timeanddate.com/astronomy/horizontal-coordinate-system.html)</h3>
                <table className="table border shadow">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Altitude (deg)</th>
                            <th>Azimuth  (deg)</th>
                            <th>Distance (km)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedBodyData?.cells?.map((cell, i) => (
                            <tr key={i}>
                                <td>{cell.date.substring(0, 10)}</td>
                                <td>{cell.position.horizontal.altitude.degrees}</td>
                                <td>{cell.position.horizontal.azimuth.degrees}</td>
                                <td>{cell.distance.fromEarth.km}</td>
                            </tr>
                        ))

                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}