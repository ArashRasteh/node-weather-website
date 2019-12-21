const request = require('request');

const forecast = (latitude, longitude, callback) => {
   // https://darksky.net/dev/docs
   const url = 'https://api.darksky.net/forecast/c5fee5306f221edb7533de478a4ae90f/'+ latitude +',' + longitude +'';

   request({url, json: true}, (error, {body}) => {
      if (error) {
         callback('Unable to connect to Weather Service', undefined)
      } else if (body.error) {
         callback(body.error, undefined)
      } else {
         callback(undefined, body);
      }
   })
}

module.exports = forecast