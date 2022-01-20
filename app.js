require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");
const res = require("express/lib/response");
const date = require(__dirname + "/time.js");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

const api = process.env.API_KEY;

let cityName = "Muradnagar";
const units = "metric";

app.get("/", (req, res) => {
     
   const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=" + units + "&appid=" + api;
   https.get(url, (response) => {
        
      let weatherData, weather, image, temp, wind, humidity;
      
      response.on("data", data => {
         
         if(response.statusCode === 200)
         {
         weatherData = JSON.parse(data);
         const weatherList = weatherData.list;
         image = weatherData.list[0].weather[0].icon;
         const weatherImage = "http://openweathermap.org/img/wn/" + image + "@2x.png";

         const imageArray = [];
         for(let i =1; i<=18; i+=3)
         { 
            const Image =  "http://openweathermap.org/img/wn/" + weatherList[i].weather[0].icon + "@2x.png"
            imageArray.push(Image);
         }
         
         res.render("index", { city: cityName, date: date(), weatherList: weatherList, image: weatherImage, imageArray:imageArray})
      }
      else
      {
         
        res.redirect("failure");
      }
      });
        
   })
});

app.post("/", (req, res) =>
   {
      cityName = req.body.searchCity;
      res.redirect("/");

   });
   app.get("/failure", (req, res) =>
   {
      res.render("failure");
   });

   app.post("/failure", (req, res) =>
   {
      cityName = "Muradnagar";
      res.redirect("/");
   })
   

app.listen(process.env.PORT || 3000, console.log("Server started at port 3000"));