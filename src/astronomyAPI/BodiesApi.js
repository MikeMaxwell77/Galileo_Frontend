import axios from "axios";
import { AstronomyApiBodiesClient } from "./Astronomy_api_interface";

/*
* TEST useEffect to show Interface usage, an to potentially test : place this in app.jsx to test
*
* useEffect(() => {
    const run = async() => {
    console.log("NamedBodies:", await AstronomyBodiesInterface.FetchNamedBodies());
    const SavLat = 32.06;
    const SavLong = -81.15;
    const SavElev = 0.0;
    console.log("OneMonthAllBodiesSavannah:", await AstronomyBodiesInterface.FetchAllBodyPositions({ latitude: SavLat, longitude: SavLong, elevation: SavElev }));

    console.log("EventLookup::sun", await AstronomyBodiesInterface.FetchEvents(
      {
        bodyid: "sun",
        longitude: SavLong,
        latitude: SavLat,
        elevation: SavElev
      }
    ))

    console.log("EventLookup::moon", await AstronomyBodiesInterface.FetchEvents(
      {
        bodyid: "moon",
        longitude: SavLong,
        latitude: SavLat,
        elevation: SavElev
      }
    ))

    console.log("SearchOrionFuzzy:", await AstronomySearchInterface.FetchObjectsByName(
      {
        objectSearchTerm: "orion",
        exact: false
      }
    ))
    }
    
    run();
  }, []) 
*/

// TO-DO: implement smart defaults for paramaters
export const BuildAllBodiesQuery = ({
    Latitude,
    Longitude,
    Elevation,
    FromDate,
    ToDate,
    Time,
    Output = "table"
} = {}) => {
    return {
        latitude: Latitude,
        longitude: Longitude,
        elevation: Elevation,
        from_date: FromDate,
        to_date: ToDate,
        time: Time,
        output: Output
    }
}

export const ComputeDateTimeRange = ({
    startDateTime,
    endDateTime
} = {}) => {
    // validate input params
    if (startDateTime instanceof Date && isNaN(startDateTime)) return {};
    if (endDateTime instanceof Date && isNaN(endDateTime)) return {};

    const start_date = [
        String(startDateTime.getFullYear()),
        String(startDateTime.getMonth() + 1).padStart(2, "0"), // for some reason this month is one behind?
        String(startDateTime.getDate()).padStart(2, "0"),
    ].join("-");

    const end_date = [
        String(endDateTime.getFullYear()),
        String(endDateTime.getMonth() + 1).padStart(2, "0"), // for some reason this month is one behind?
        String(endDateTime.getDate()).padStart(2, "0"),
    ].join("-");

    return {from_date: start_date, to_date: end_date};
}

export const AstronomyBodiesInterface = {
    FetchNamedBodies: async () => {
        try {
            const response = await AstronomyApiBodiesClient.get("bodies/");

            if (!response || Object.keys(response.data) === 0) {
                return [];
            } else {
                //console.log("SUCESS:", response.data);
                return response.data;
            }
        } catch (error) {
            console.error("API::ERROR::", error);
            return [];
        }



    },

    FetchAllBodyPositions: async ({ longitude, latitude, elevation }) => {
        // Prepare the needed params for https://api.astronomyapi.com/api/v2/bodies/positions
        const now = new Date();
        const untill = new Date(now);
        untill.setDate(untill.getDate() + 7);
        

        const DateTimeRange = ComputeDateTimeRange({startDateTime: now, endDateTime: untill});
        //console.log("TimeDateRange", DateTimeRange);
        

        const time = [
            String(now.getHours()).padStart(2, "0"),
            String(now.getMinutes()).padStart(2, "0"),
            String(now.getSeconds()).padStart(2, "0"),
        ].join(":");
        //console.log("Time(seconds):", time);

        const query = BuildAllBodiesQuery(
            {
                Latitude: latitude,
                Longitude: longitude,
                Elevation: elevation,
                FromDate: DateTimeRange.from_date,
                ToDate: DateTimeRange.to_date,
                Time: time
            });

        //console.log("QueryParams:", query);


        try {
            const response = await AstronomyApiBodiesClient.get("bodies/positions",
                {
                    params: query,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }
            );

            if (!response || Object.keys(response.data) === 0) {
                return [];
            } else {
                //console.log("SUCESS:", response.data);
                return response.data;
            }

        } catch (error) {
            console.error("API::ERROR::", error);
            return [];
        }
    }, // End FetchAllBodyPositions

    FetchEvents: async ({ bodyid, longitude, latitude, elevation }) => {
        // According to the Astronomy v2 api manual events are only available for the sun 
        // and the moon at the moment

        // NOTE: Something is wrong with this API endpoint or the way i am querying it
        //  There is supposed to be several lunar events during 17/24 april but they
        //  arent being returned by the API (could be location i guess)

        if (!bodyid == null || !(bodyid === "sun") && !(bodyid === "moon")) {
            console.error("The provided body ID is not supported by the event API or is null")
            return [];
        }



        const now = new Date();
        const untill = new Date(now);
        untill.setDate(untill.getDate() + 30);

        const DateTimeRange = ComputeDateTimeRange({ startDateTime: now, endDateTime: untill });
        
        //console.log("ToDate:", month_from_now);

        const time = [
            String(now.getHours()).padStart(2, "0"),
            String(now.getMinutes()).padStart(2, "0"),
            String(now.getSeconds()).padStart(2, "0"),
        ].join(":");


        const query = BuildAllBodiesQuery(
            {
                Latitude: latitude,
                Longitude: longitude,
                Elevation: elevation,
                FromDate: DateTimeRange.from_date,
                ToDate: DateTimeRange.to_date,
                Time: time
            }
        );

        //console.log("EventsHeader")

        try {
            const response = await AstronomyApiBodiesClient.get(`bodies/events/${bodyid}`,
                {
                    params: query,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }
            );

            if (!response || Object.keys(response.data) === 0) {
                return [];
            } else {
                //console.log("SUCESS:", response.data);
                return response.data;
            }

        } catch (error) {
            console.error("API::ERROR::", error, "response", response.data);
            return [];
        }

    }
} // End AstronomyBodiesInterface

export const AstronomySearchInterface = {
    FetchObjectsByName : async ({objectSearchTerm, exact}) => {
        const url = "search"

        const queryParams = {
            term: objectSearchTerm,
            match_type: exact ? "exact" : "fuzzy",
            limit: 10,
            offset: 0,
            order_by: "name"
        }

        try {
            const response = await AstronomyApiBodiesClient.get(url,
                {
                    params: queryParams
                }
            );

            if (!response || Object.keys(response.data) === 0) {
                return [];
            } else {
                //console.log("SUCESS:", response.data);
                return response.data;
            }

        } catch (error) {
            console.error("API::ERROR::", error);
            return [];
        }

    },

    FetchObjectsByRaDec : async ({ra, dec}) => {
        // Need to decide if we want to implement this, 
        // https://paulplusx.wordpress.com/2016/03/02/rtpts_azalt/
        // Could be nice for the enthousast but it seems hard to compute so 
    }

}