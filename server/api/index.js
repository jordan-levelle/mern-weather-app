// - Use express router to route all API endpoints

const express = require('express');
const router = express.Router();

// Use weather class from ./weather.js to call our method. Will get weather data from the api 
const Weather = require("./weather");


// GET Request - statically get weather data from weather api
router.get("/weather", async (req, res) => {
    let weather = new Weather();

    // Fixed or predetermined example GET request
    let weatherData = await weather.getWeatherData(98052, "us");

    //content sent is prettified json
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(weatherData, null, 4));
});


// POST Request - dynamically get weather data based on request body
router.post("/weather", async (req, res) => {
    const {zipCode, tempMetric} = req.body;
    let weather = new Weather();

    // Params of zipCode and tempMetric are dynamic
    let weatherData = await weather.getWeatherData(zipCode, tempMetric);

    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(weatherData, null, 4));
});

// POST Request = get weather data,, save to mongo, then return
router.post("/weatherMongo", async(req, res) => {
    const {zipCode, tempMetric} = req.body;
    let weather = new Weather();
    let weatherData = await weather.getWeatherData(zipCode, tempMetric);

    await weather.saveWeatherDataToMongo(zipCode, weatherData);
    res.header("Content-Tyoe", 'application/json');
    res.send(JSON.stringify(weatherData, null, 4));
});


// GET Request - get weather data save to mongo
router.get("/weatherMongo", async(req, res) => {
    const {zipCode} = req.query;
    let weather = new Weather();

    let weatherData = await weather.getWeatherDataFromMongo(zipCode);
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(weatherData, null, 4));
})

module.exports = router;

/*  
since we have different endpoints for different calls. This router helps direct the type of traffic. i.e a GET or a POST.
*/

