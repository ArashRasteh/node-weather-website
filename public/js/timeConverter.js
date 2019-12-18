"use strict";

/**
 * @param {number} UNIX_timestamp - Unix Timestamp in seconds
 * @param {(string|object)} [format] - How the timestamp is to be formatted
 * @param {string} [timezone] - The time zone to use
 * @param {string} [locale="en-US"] - A string with a BCP 47 language tag, or an array of such strings
 * @return {string} formatted time / date give Unix Timestamp
 */
function unixConv(UNIX_timestamp, format, timezone, locale){
   let unixTime = (new Date(UNIX_timestamp * 1000));
   let localeOpt = locale || 'en-US';
   let options = {};

   //Use https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString for formatting information
   if (typeof format == 'object') {
      options = format;
   } else {
      switch (format) {
         case 'timeShort':
            options.timeStyle = "short";
            break;
   
         case 'dateFull':
            options.dateStyle = "full";
            break;
   
         case 'dateSemiFull':
            options.weekday = "long";
            options.month = "short";
            options.day = "numeric";
            options.year = "numeric";
            break;
      
         default:
            break;
      }
   }
   
   
   if (timezone) options.timeZone = timezone;

   return unixTime.toLocaleString(localeOpt, options);
}