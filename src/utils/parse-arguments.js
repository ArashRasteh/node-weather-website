//arguments need to have -- and = to be counted as a CLI argument otherwise count as command
const parseNodeArguments = () => {
   const arguments = process.argv;
   const parsedArguments = {
      commands:{}
   };
   for (let i = 2; i < arguments.length; i++) {
      let foundDoubleDash = arguments[i].indexOf('--');
      let foundEqual = arguments[i].indexOf('=');
      if (foundDoubleDash !== -1 && foundEqual !== -1) {
         let key = arguments[i].substring(foundDoubleDash+2,foundEqual);
         let value = arguments[i].substring(foundEqual+1);
         parsedArguments[key] = value;
      } else {
         parsedArguments.commands[arguments[i]] = true;
      }
   }
   return parsedArguments;
}

module.exports = parseNodeArguments