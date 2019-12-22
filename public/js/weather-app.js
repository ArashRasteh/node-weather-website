"use strict";

//Get HTML Selectors
const weatherForm = document.querySelector('form#weather-app');
const weatherSearch = document.querySelector('form#weather-app input');
const forecastMsg1 = document.querySelector('#forecast-1');
const forecastMsg2 = document.querySelector('#forecast-2');
const forecastWrapper = document.querySelector('#full-forecast');
const recentLocationDiv = document.querySelector('.recent-locations');

//Call global variables
let forecast = {};
let staticForecastIcons = new Array();
const skycons = new Skycons({"monochrome": false});

window.onload = function() {
   if (getQueryVariable('location')) {
      getWeatherData( getQueryVariable('location') );
      // weatherSearch.value = getQueryVariable('location');
   }
};


//prevent form from refreshing page and start the forecast fetching process
weatherForm.addEventListener('submit', (e) => {
   e.preventDefault();
   
   getWeatherData();
   
})



const getWeatherData = (location = weatherSearch.value) => {
   //loading message
   forecastMsg1.style.display = "block";
   forecastMsg1.textContent = 'Loading..';
   forecastMsg2.textContent = '';

   //call the api to get the forecast
   fetch('/weather?address=' + (location)).then((response) => {
      response.json().then((data) => {
         if (data.error) {
            return forecastMsg1.textContent = data.error;
         }

         addRecentLocation(data.location);

         setUpCurrentTemp(data);
         setUpDailyHourlyTemp(data, "daily"); 
         setUpDailyHourlyTemp(data, "hourly"); 
         setUpDailyHourTabs();
         
         skycons.play();

         forecastWrapper.style.display = "block";

      })
   })
}



//given the forecast data from DarkSky API, populate the current temperature
function setUpCurrentTemp(data) {

   updateShowRecentLocations();
   
   forecast = data.forecast;
   console.log(forecast);

   //Get HTML Selectors for current temp
   const forecastMsg1 = document.querySelector('#forecast-1');
   const forecastMsg2 = document.querySelector('#forecast-2');
   const forecastCity = document.querySelector('.forecast-city');
   const forecastDate = document.querySelector('.forecast-date');
   const forecastTemp = document.querySelector('.forecast-degrees-num');
   const forecastSummary = document.querySelector('.forecast-summary');
   const forecastPrecipChance = document.querySelector('.forecast-precipChance');
   const moreInfoButton = document.querySelector('#tabs_link_more');

   forecastMsg1.style.display = "none";
   forecastMsg2.style.display = "none";

   //Update fields on webpage
   forecastCity.textContent = data.location;
   moreInfoButton.href = "https://darksky.net/forecast/" + forecast.latitude + ',' + forecast.longitude;
   forecastDate.textContent = unixConv(forecast.daily.data[0].temperatureHighTime, 'dateSemiFull');
   skycons.add("forecast-icon", Skycons[forecast.currently.icon.toUpperCase().replace(/-/g, "_")]);
   forecastTemp.textContent = Math.round(forecast.currently.apparentTemperature);
   forecastSummary.textContent = forecast.minutely && forecast.minutely.summary ? ("Summary: " + forecast.minutely.summary) : '';
   forecastPrecipChance.innerHTML = '<strong>' + Math.round(forecast.daily.data[0].precipProbability*10)/10 + '%</strong> chance of ' + 
      (forecast.daily.data[0].precipType || 'precipitation') + ' today.';

}



//Will set up the daily and hourly temp given which one as datasetVal
function setUpDailyHourlyTemp(data,datasetVal = "daily") {
   const contentWrapper = document.querySelector('#tabs_content_' + datasetVal);
   const dataset = forecast[datasetVal].data;
   let strToPrnt = '';
   
   if (!forecast) forecast = data.forecast;
   
   if (!contentWrapper) console.error('datasetVal not set correctly for setUpDailyHourlyTemp()');

   strToPrnt += '<p style="margin-top: 0"><strong>Summary</strong><br>' + forecast[datasetVal].summary + '</p>';

   for (let i = 0; i < dataset.length; i++) {
      let date = new Date(dataset[i].time*1000);
      let dayOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()].toUpperCase();
      // let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'][date.getMonth()];
      let dayOfMonth = date.getDate();
      let nthOfMo = nth(dayOfMonth);
      let timeOfDay = date.getHours()%12 !== 0 ? date.getHours()%12 : 12 ;
      let ampm = date.getHours() < 12 ? 'AM' : 'PM' ;
      let precipChance = Math.round(dataset[i].precipProbability*100);
      let precipType = dataset[i].precipType || 'precip';

      strToPrnt+= '<div class="future-forecast">';

         strToPrnt+= '<div class="future-forecast-time-date"><div>';
            strToPrnt+= dayOfWeek + '<br>';
            if (datasetVal === "daily") strToPrnt += dayOfMonth + '<sup>' +  nthOfMo + '</sup>';
            if (datasetVal === "hourly") strToPrnt += timeOfDay + ' <small>' +  ampm + '</small>';
         strToPrnt+= '</div></div><!-- end .future-forecast-time-date -->';
         
         strToPrnt += '<div class="future-forecast-temps-precip">';
            if (datasetVal === "daily") {
               let dayTempHigh = Math.round(dataset[i].temperatureHigh);
               let dayTempHighTime = unixConv(dataset[i].temperatureHighTime, 'timeShort');
               let dayTempLow = Math.round(dataset[i].temperatureLow);
               let dayTempLowTime = unixConv(dataset[i].temperatureLowTime, 'timeShort');

               strToPrnt += '<div class="future-forecast-temps-item">';
                  strToPrnt += '<div class="future-forecast-temps-item-top">';
                     strToPrnt += '<div class="temp-low">' + dayTempLow + '&#176;</div>'
                  strToPrnt += '</div><!-- end .future-forecast-temps-item-top -->';
                  strToPrnt += '<div class="future-forecast-temps-item-bottom">';
                     strToPrnt += dayTempLowTime;
                  strToPrnt += '</div><!-- end .future-forecast-temps-item-bottom -->';
               strToPrnt += '</div><!-- end .future-forecast-temps-item -->';

               strToPrnt += '<div class="future-forecast-temps-item">';
                  strToPrnt += '<div class="future-forecast-temps-item-top">';
                     strToPrnt += '<div class="temp-high">' + dayTempHigh + '&#176;</div>'
                  strToPrnt += '</div><!-- end .future-forecast-temps-item-top -->';
                  strToPrnt += '<div class="future-forecast-temps-item-bottom">';
                     strToPrnt += dayTempHighTime;
                  strToPrnt += '</div><!-- end .future-forecast-temps-item-bottom -->';
               strToPrnt += '</div><!-- end .future-forecast-temps-item -->';
            } else if (datasetVal === "hourly") {
               let hourTempActual = Math.round(dataset[i].temperature);
               let hourTempFeels = Math.round(dataset[i].apparentTemperature);

               strToPrnt += '<div class="future-forecast-temps-item">';
                  strToPrnt += '<div class="future-forecast-temps-item-top">';
                     strToPrnt += '<div class="temp-actual-feels">' + hourTempActual + '&#176;</div>'
                  strToPrnt += '</div><!-- end .future-forecast-temps-item-top -->';
                  strToPrnt += '<div class="future-forecast-temps-item-bottom">';
                     strToPrnt += 'Actual';
                  strToPrnt += '</div><!-- end .future-forecast-temps-item-bottom -->';
               strToPrnt += '</div><!-- end .future-forecast-temps-item -->';

               strToPrnt += '<div class="future-forecast-temps-item">';
                  strToPrnt += '<div class="future-forecast-temps-item-top">';
                     strToPrnt += '<div class="temp-actual-feels">' + hourTempFeels + '&#176;</div>'
                  strToPrnt += '</div><!-- end .future-forecast-temps-item-top -->';
                  strToPrnt += '<div class="future-forecast-temps-item-bottom">';
                     strToPrnt += 'Feels Like';
                  strToPrnt += '</div><!-- end .future-forecast-temps-item-bottom -->';
               strToPrnt += '</div><!-- end .future-forecast-temps-item -->';
            }
            
            strToPrnt += '<div class="future-forecast-temps-item">';
               strToPrnt += '<div class="future-forecast-temps-item-top">';
                  strToPrnt += '<div class="precip-chance">' + precipChance + '%</div>'
               strToPrnt += '</div><!-- end .future-forecast-temps-item-top -->';
               strToPrnt += '<div class="future-forecast-temps-item-bottom">';
                  strToPrnt += precipType;
               strToPrnt += '</div><!-- end .future-forecast-temps-item-bottom -->';
            strToPrnt += '</div><!-- end .future-forecast-temps-item -->';

            let canvasID = 'forecast-icon-' + datasetVal + i;
            strToPrnt += '<div class="future-forecast-temps-item">';
               strToPrnt += '<canvas id="' + canvasID + '" width="49" height="49"></canvas>';
            strToPrnt += '</div><!-- end .future-forecast-temps-item -->';
            staticForecastIcons.push({
               canvasID,
               icon: dataset[i].icon.toUpperCase().replace(/-/g, "_")
            })

            strToPrnt += '<div class="future-forecast-temps-item fullWidth">';
               strToPrnt += dataset[i].summary;
            strToPrnt += '</div><!-- end .future-forecast-temps-item.fullWidth -->';

         strToPrnt += '</div><!-- end .future-forecast-temps-precip -->';

         

      strToPrnt+= '</div><!-- end .future-forecast -->';
   }

   contentWrapper.innerHTML = strToPrnt;

}



//set up tab system on weather page
function setUpDailyHourTabs() {
   const tabDaily = document.querySelector('#tabs_link_daily');
   const tabHourly = document.querySelector('#tabs_link_hourly');
   const contentDaily = document.querySelector('#tabs_content_daily');
   const contentHourly = document.querySelector('#tabs_content_hourly');

   tabDaily.addEventListener("click", function(){
      tabHourly.classList.remove("tabs_show");
      tabDaily.classList.add("tabs_show");
      contentHourly.classList.remove("content_show");
      contentDaily.classList.add("content_show");
      
    });    

    tabHourly.addEventListener("click", function(){
      tabDaily.classList.remove("tabs_show");
      tabHourly.classList.add("tabs_show");
      contentDaily.classList.remove("content_show");
      contentHourly.classList.add("content_show");
   });    

   for (let i = 0; i < staticForecastIcons.length; i++) {
      const {canvasID, icon} = staticForecastIcons[i];
      skycons.add(canvasID, Skycons[icon]);
   }
}



//Add a new location to recent locations
const addRecentLocation = (location) => {
   let recentLocations = new Array();
   if (getCookie('recentLocation')) {
      recentLocations = JSON.parse(getCookie('recentLocation'));
   }
   if (recentLocations.indexOf(location) === -1) {
      if (recentLocations.length >= 3) recentLocations.pop();
      recentLocations.unshift(location);
   } else {
      recentLocations.splice(recentLocations.indexOf(location),1);
      recentLocations.unshift(location);
   }
   setCookie('recentLocation',JSON.stringify(recentLocations),30);
   console.log(JSON.parse(getCookie('recentLocation')));
}

//actually show recent locations
const updateShowRecentLocations = () => {
   // recentLocationDiv
   let strToPrnt = '';

   let recentLocations = [];
   if (getCookie('recentLocation')) {
      recentLocations = JSON.parse(getCookie('recentLocation'));
      document.querySelector('.recent-locations-wrapper').style.display = 'flex'
   }

   for (let i = 0; i < recentLocations.length; i++) {
      strToPrnt += '<a href="/?location=' + encodeURI(recentLocations[i]) + '">';
      strToPrnt += recentLocations[i];
      strToPrnt += '</a>'
   }

   recentLocationDiv.innerHTML = strToPrnt;
}



//functions from stackoverflow below:
const nth = function(d) {
   if (d > 3 && d < 21) return 'th';
   switch (d % 10) {
     case 1:  return "st";
     case 2:  return "nd";
     case 3:  return "rd";
     default: return "th";
   }
}

//https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split('&');
   for (var i = 0; i < vars.length; i++) {
       var pair = vars[i].split('=');
       if (decodeURIComponent(pair[0]) == variable) {
           return decodeURIComponent(pair[1]);
       }
   }
   console.log('Query variable %s not found', variable);
}

//https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays = 30) {
   var d = new Date();
   d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
   var expires = "expires=" + d.toUTCString();
   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
   var name = cname + "=";
   var ca = document.cookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return "";
}