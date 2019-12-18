"use strict";

const weatherForm = document.querySelector('form#weather-app');
const weatherSearch = document.querySelector('form#weather-app input');
const forecastMsg1 = document.querySelector('#forecast-1');
const forecastMsg2 = document.querySelector('#forecast-2');
let forecast = {};

weatherForm.addEventListener('submit', (e) => {
   e.preventDefault();
   
   forecastMsg1.textContent = 'Loading..';
   forecastMsg2.textContent = '';

   const location = weatherSearch.value;

   fetch('/weather?address=' + (location)).then((response) => {
      response.json().then((data) => {
         forecast = data.forecast;

         let currentTemperature = forecast.currently.temperature;
         let currentPrecipProb = forecast.currently.precipProbability;
         let todayDate = unixConv(forecast.daily.data[0].temperatureHighTime, 'dateSemiFull');
         let todaySummary = forecast.daily.data[0].summary;
         let todayTemperatureHigh = forecast.daily.data[0].temperatureHigh;
         let todayTempertatureHighTime = unixConv(forecast.daily.data[0].temperatureHighTime, 'timeShort');
         let todayTemperatureLow = forecast.daily.data[0].temperatureLow;
         let todayTempertatureLowTime = unixConv(forecast.daily.data[0].temperatureLowTime, 'timeShort');

         console.log(forecast);
         if (data.error) {
            return forecastMsg1.textContent = data.error;
         }
         forecastMsg1.textContent = data.location + ' - ' + todayDate;
         forecastMsg2.innerHTML = todaySummary + ' It is currently ' + currentTemperature + ' &#8457; out. There is a ' + currentPrecipProb + '% chance of rain. ' + 'Expect highs of ' + todayTemperatureHigh + ' &#8457; at ' + todayTempertatureHighTime + ' and Lows of ' + todayTemperatureLow + ' &#8457; at ' + todayTempertatureLowTime + '. ';

         
      })
   })
})