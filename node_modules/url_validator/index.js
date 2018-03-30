const url = require("url");

const urlPatter = /^(https?:\/\/)?[^-][a-z0-9.-]+[^-]\.[a-z]{2,4}$/;

module.exports = (str) => {
  
  if(typeof str === "string") {

    if(urlPatter.test(str)) {

      let fqdn; //full qualified domain name 
      fqdn = url.parse(str).protocol ? url.parse(str).hostname : url.parse(str).href;

      if(fqdn.length > 255) {
        
        return false;
      }
      return true;
    }
    return false;
  }
  return false;
};
