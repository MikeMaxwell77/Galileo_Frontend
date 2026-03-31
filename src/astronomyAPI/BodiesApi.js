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
            console.log("SUCESS:", response.data);
        } catch (error) {
            console.error("API::ERROR::", error);
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

        console.log("FromDate:", today_date);

        const month_from_now = [
            String(now.getFullYear()),
            String(now.getMonth() + 2).padStart(2, "0"), // defaults to a month out for now
            String(now.getDate()-1).padStart(2, "0"),
        ].join("-");

        console.log("ToDate:", month_from_now);

        const time = [
            String(now.getHours()).padStart(2, "0"),
            String(now.getMinutes()).padStart(2, "0"), 
            String(now.getSeconds()).padStart(2, "0"),
        ].join(":");
        console.log("Time(seconds):", time);

        const query = BuildAllBodiesQuery({
            Latitude: latitude, 
            Longitude: longitude, 
            Elevation: elevation, 
            FromDate: today_date, 
            ToDate: month_from_now, 
            Time: time});

        console.log("QueryBody:", query);


        try {
            const response = await AstronomyApiBodiesClient.get("/positions", 
                {
                    params: query,
                    headers: {
                            "X-Requested-With": "XMLHttpRequest"
                    }
                });
            console.log("SUCESS:", response.data);
        } catch (error) {
            console.error("API::ERROR::", error);
        }


    }

}