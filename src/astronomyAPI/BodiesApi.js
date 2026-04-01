import axios from "axios";
import { AstronomyApiBodiesClient } from "./Astronomy_api_interface";

// TO-DO: implement smart defaults for paramaters
export const BuildAllBodiesQuery = ({
        Latitude,
        Longitude,
        Elevation,
        FromDate,
        ToDate ,
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

export const AstronomyBodiesInterface = {
    FetchNamedBodies: async () => {
        try {
            const response = await AstronomyApiBodiesClient.get("/");
            
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

    FetchAllBodyPositions: async ({longitude, latitude, elevation}) => {
        // Prepare the needed params for https://api.astronomyapi.com/api/v2/bodies/positions
        const now = new Date();

        const today_date = [
            String(now.getFullYear()),
            String(now.getMonth() +1).padStart(2, "0"), // for some reason this month is one behind?
            String(now.getDate()).padStart(2, "0"),
        ].join("-");

        //console.log("FromDate:", today_date);

        const month_from_now = [
            String(now.getFullYear()),
            String(now.getMonth() + 2).padStart(2, "0"), // defaults to a month out for now
            String(now.getDate()-1).padStart(2, "0"),
        ].join("-");

        //console.log("ToDate:", month_from_now);

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
            FromDate: today_date, 
            ToDate: month_from_now, 
            Time: time
        });

        //console.log("QueryParams:", query);


        try {
            const response = await AstronomyApiBodiesClient.get("/positions", 
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
    } , // End FetchAllBodyPositions

    FetchEvents: async ({bodyid, longitude, latitude, elevation}) => {
        // According to the Astronomy v2 api manual events are only available for the sun 
        // and the moon at the moment

        if (!bodyid == null || !(bodyid === "sun") && !(bodyid === "moon")){
            console.error("The provided body ID is not supported by the event API or is null")
            return [];
        }



        const now = new Date();

        const today_date = [
            String(now.getFullYear()),
            String(now.getMonth() + 1).padStart(2, "0"), // for some reason this month is one behind?
            String(now.getDate()).padStart(2, "0"),
        ].join("-");

        //console.log("FromDate:", today_date);

        const month_from_now = [
            String(now.getFullYear()),
            String(now.getMonth() + 2).padStart(2, "0"), // defaults to a month out for now
            String(now.getDate() - 1).padStart(2, "0"),
        ].join("-");

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
                FromDate: today_date,
                ToDate: month_from_now,
                Time: time
            }
        );

        try {
            const response = await AstronomyApiBodiesClient.get(`/events/${bodyid}`,
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
}