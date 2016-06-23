var fs = require('fs');
var expandHomeDir = require('expand-home-dir');
var parse = require('csv-parse');

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
  },
  build_query: function(classname, astObj) {
    switch (astObj.operator) {
    case 'AND':
      classname = build_query(classname, astObj.left);
      classname = build_query(classname, astObj.right);
      break;
    case 'OR':
      var sub = ncmb.DataStore(program.classname);
      sub1 = build_query(sub, astObj.left);
      sub2 = build_query(sub, astObj.right);
      classname = classname.or([sub1, sub2]);
      break;
    case '!=':
    case '<>':
      if (astObj.right.value == 'null') {
        classname = classname.exists(astObj.left.column);
      }else{
        classname = classname.notEqualTo(astObj.left.column, astObj.right.value);
      }
      break;
    case '=':
    case '==':
      classname = classname.equalTo(astObj.left.column, astObj.right.value);
      break;
    case '>':
      classname = classname.greaterThan(astObj.left.column, astObj.right.value);
      break;
    case '>=':
    case '=>':
      classname = classname.greaterThanOrEqualTo(astObj.left.column, astObj.right.value);
      break;
    case '<':
      classname = classname.lessThan(astObj.left.column, astObj.right.value);
      break;
    case '<=':
    case '=<':
      classname = classname.lessThanOrEqualTo(astObj.left.column, astObj.right.value);
      break;
    case 'IN':
      classname = classname.in(astObj.left.column, astObj.right.value.map(function(data) { return data.value; }));
      break;
    case 'NOT IN':
      classname = classname.notIn(astObj.left.column, astObj.right.value.map(function(data) { return data.value; }));
      break;
    }
    return classname;
  },
  csv2json: function(filename, options) {
    return new Promise(function(resolve, reject) {
      results = [];
      var parser = parse({ delimiter: ',', columns: true}, function(err, data){
        for (var i in data) {
          var line = data[i];
          for (var k in line) {
            value = line[k];
            if (options.boolean) {
              if (value.toUpperCase() == 'TRUE') {
                line[k] = true;
                continue;
              } else if (value.toUpperCase() == 'FALSE') {
                line[k] = false;
              }
            }
            if (options.location) {
              if (match = value.match(/^([0-9]{1,2}\.[0-9]+),([0-9]{1,3}\.[0-9]+)$/)) {
                line[k] = {"__type":"GeoPoint","longitude": parseFloat(match[2]),"latitude": parseFloat(match[1])}
                continue;
              }
            }
            if (options.date) {
              if (match = value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\+[0-9]{2}:[0-9]{2}$/)) {
                d = new Date(value);
                line[k] = {"__type":"Date","iso": d.toISOString()}
                continue;
              }
            }
            if (options.object) {
              try {
                line[k] = JSON.parse(value);
                continue;
              }catch(e){
              }
            }
            line[k] = value;
          }
          results.push(line);
        }
        return resolve(results);
      });
      fs.createReadStream(filename).pipe(parser);
    });
  }
}