var fs = require('fs');
var expandHomeDir = require('expand-home-dir')
config_path = expandHomeDir("~/.ncmb.json");

module.exports = {
  load_config: function(application_key, client_key) {
    return new Promise(function(resolve, reject) {
      if (application_key === '' && client_key === '') {
        fs.access(config_path, fs.R_OK, function(err) {
          if (err) {
            return reject("Application key and client key are required.");
          }
          fs.readFile(config_path, function(err, data) {
            if (err) {
              return reject("Config file has broken.");
            }
            json = JSON.parse(data.toString());
            return resolve(json);
          });
        });
      } else {
        return resolve({application_key: application_key, client_key: client_key});
      }
    });
  }
}