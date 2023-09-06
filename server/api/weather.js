const axios = require("axios");

const WEATHER = require("../models/Weather")

// To get the weather. Config the path to read the proper environment variable file, .env
require('dotenv').config({path: "./../../../.env"});

const baseUrl = "http://api.openweathermap.org/data/2.5/weather";

// - A weather class to connect ot the weather api
// - Get the weather data to send back to the frontend
class Weather {
    /**
     * Parameters to gather correct information
     * Based on zipcode 
     * converge temp to metric
     * 
     * @param {number} // zipCode used to get the weather info
     * @param {String} // tempMetric. Can be imperial or Metric
     * @return {JSON}  // Data response from theweather api call.
    */

    getWeatherData = async (zipCode, tempMetric) => {

        /**
         * Use get api for "By ZIP code" 
         * - The "us" query stands for "United States
         * - "process.env.WEATHER_KEY" is the api key from the .env file
         * - "units" query can be either imperial (Fahrenheit) or metric (Celsius)
         */
        let url = `${baseUrl}?zip=${zipCode},us&appid=${process.env.WEATHER_KEY}&units=${tempMetric}`;

        return (await axios(url)).data;
    }
    
    saveWeatherDataToMongo = async (zipCode, data) => {
        const filter = {
            zip: zipCode
        }

        const replace = {
            ...filter,
            ...data,
            data: Date.now()
        }
        await this.findOneReplace(filter, replace);
    }

    /**
     * @param {number}
     * @return {JSON} 
     */


    getWeatherDataFromMongo = async (zipCode) => {
        return WEATHER.findOne({zip: zipCode});
    }

    /**
     * @param {{zip: number}}
     * @return {JSON} 
     */
    
    async findOneReplace(filter, replace) {
        await WEATHER.findOneAndReplace(filter, replace, {new: true, upsert:true});
    }
}

module.exports = Weather;

