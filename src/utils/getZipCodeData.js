"use strict";

const path = require('path');
const fs = require('fs');

const states = [['Arizona','AZ'],['Alabama','AL'],['Alaska','AK'],['Arkansas','AR'],['California','CA'],['Colorado','CO'],['Connecticut','CT'],['Delaware','DE'],['Florida','FL'],['Georgia','GA'],['Hawaii','HI'],['Idaho','ID'],['Illinois','IL'],['Indiana','IN'],['Iowa','IA'],['Kansas','KS'],['Kentucky','KY'],['Louisiana','LA'],['Maine','ME'],['Maryland','MD'],['Massachusetts','MA'],['Michigan','MI'],['Minnesota','MN'],['Mississippi','MS'],['Missouri','MO'],['Montana','MT'],['Nebraska','NE'],['Nevada','NV'],['New Hampshire','NH'],['New Jersey','NJ'],['New Mexico','NM'],['New York','NY'],['North Carolina','NC'],['North Dakota','ND'],['Ohio','OH'],['Oklahoma','OK'],['Oregon','OR'],['Pennsylvania','PA'],['Rhode Island','RI'],['South Carolina','SC'],['South Dakota','SD'],['Tennessee','TN'],['Texas','TX'],['Utah','UT'],['Vermont','VT'],['Virginia','VA'],['Washington','WA'],['West Virginia','WV'],['Wisconsin','WI'],['Wyoming','WY']];

const getZipCodeData = (zip, callback) => {
   //check if zipcode provided is inherently incorrect
   if (zip === ''){
      return callback('Error: Please provide a valid zip code after /zip/.');
   } else if (isNaN(zip)) {
      return callback('Error: "' + zip + '" is not a number.<br> Please provide a valid zip code after /zip/.');
   } else if (zip < 0 || zip > 99999) {
      return callback('Error: ' + zip + ' is not a valid zip code.<br> Please provide a valid zip code after /zip/.')
   }

   //find the zip code group that could possible contain the zip, and make sure that zipcode database contains zip provided
   const zipCodeGroup = Math.floor(zip/10000)*10000 === 0 ? "00000" : Math.floor(zip/10000)*10000;
   const jsonDataPath = path.join(__dirname, '../jsonData/UScities-divided/USCities-' + zipCodeGroup + '.json');
   const jsonData = JSON.parse(fs.readFileSync(jsonDataPath));
   const zipCodeDataIndex = getIndexOfK(jsonData,zip);

   //further error checking
   if (zipCodeDataIndex == -1) {
      return callback('Error: ' + zip + ' not found in database.<br> Please provide a valid zip code after /zip/.<br> Or Use the Search bar above')
   }
   
   for (let i = 0; i < 5; i++) {
      if( jsonData[zipCodeDataIndex][i] === '') return callback('Error: ' + zip + ' found in database, but data incomplete.<br>')
   }

   //unabbreviate state
   jsonData[zipCodeDataIndex][4] = states[getIndexOfK(states,jsonData[zipCodeDataIndex][4],1)][0];

   return callback( undefined , jsonData[zipCodeDataIndex]);
}

//give the array, what you are looking for (k), and the position in multidimentional array, find the index of k, else return -1
function getIndexOfK(arr, k, pos=0) {
   for (var i = 0; i < arr.length; i++) {
      if (arr[i][pos] == k) {
         return i;
      }
   }
   return -1;
}




module.exports = getZipCodeData;