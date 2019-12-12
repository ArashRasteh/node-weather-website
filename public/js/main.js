console.log('Client side javascript file is loaded!')



const weatherForm = document.querySelector('form#weather-app');
const weatherSearch = document.querySelector('form#weather-app input');
const forecastMsg1 = document.querySelector('#forecast-1');
const forecastMsg2 = document.querySelector('#forecast-2');

weatherForm.addEventListener('submit', (e) => {
   e.preventDefault();
   
   forecastMsg1.textContent = 'Loading..';
   forecastMsg2.textContent = '';

   const location = weatherSearch.value;

   fetch('/weather?address=' + (location)).then((response) => {
      response.json().then((data) => {
         if (data.error) {
            return forecastMsg1.textContent = data.error;
         }
         forecastMsg1.textContent = data.location;
         forecastMsg2.textContent = data.forecast;
      })
   })
})