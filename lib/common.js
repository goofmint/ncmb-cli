const fs = require('fs');
const expandHomeDir = require('expand-home-dir');
const parse = require('csv-parse');

const configPath = expandHomeDir('~/.ncmb.json');

module.exports = {
  load_config: function(applicationKey, clientKey) {
    return new Promise(function(resolve, reject) {
      if (applicationKey === '' && clientKey === '') {
        fs.access(configPath, fs.R_OK, function(err) {
          if (err) {
            return reject('Application key and client key are required.');
          }
          fs.readFile(configPath, function(err, data) {
            if (err) {
              return reject('Config file has broken.');
            }
            json = JSON.parse(data.toString());
            return resolve(json);
          });
        });
      } else {
        return resolve({application_key: applicationKey, client_key: clientKey});
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
      const sub = ncmb.DataStore(program.classname);
      sub1 = build_query(sub, astObj.left);
      sub2 = build_query(sub, astObj.right);
      classname = classname.or([sub1, sub2]);
      break;
    case '!=':
    case '<>':
      if (astObj.right.value == 'null') {
        classname = classname.exists(astObj.left.column);
      }else{
        classname = classname.notEqualTo(
          astObj.left.column,
          astObj.right.value
        );
      }
      break;
    case '=':
    case '==':
      classname = classname.equalTo(
        astObj.left.column,
        astObj.right.value
      );
      break;
    case '>':
      classname = classname.greaterThan(
        astObj.left.column,
        astObj.right.value
      );
      break;
    case '>=':
    case '=>':
      classname = classname.greaterThanOrEqualTo(
        astObj.left.column,
        astObj.right.value
      );
      break;
    case '<':
      classname = classname.lessThan(
        astObj.left.column,
        astObj.right.value
      );
      break;
    case '<=':
    case '=<':
      classname = classname.lessThanOrEqualTo(
        astObj.left.column,
        astObj.right.value
      );
      break;
    case 'IN':
      classname = classname.in(
        astObj.left.column,
        astObj.right.value.map(function(data) {
          return data.value;
        })
      );
      break;
    case 'NOT IN':
      classname = classname.notIn(
        astObj.left.column,
        astObj.right.value.map(function(data) {
          return data.value;
        })
      );
      break;
    }
    return classname;
  },
  csv2json: function(filename, options) {
    return new Promise(function(resolve, reject) {
      results = [];
      let parser = parse({delimiter: ',', columns: true}, function(err, data) {
        if (typeof data == 'undefined') {
          console.log(err);
          process.exit(1);
        }
        for (let i in data) {
          if (!data.hasOwnProperty(i)) continue;
          let line = data[i];
          for (let k in line) {
            if (!line.hasOwnProperty(k)) continue;
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
              let reg = /^([0-9]{1,2}\.[0-9]+),([0-9]{1,3}\.[0-9]+)$/;
              if (match = value.match(reg)) {
                line[k] = {
                  '__type': 'GeoPoint',
                  'longitude': parseFloat(match[2]),
                  'latitude': parseFloat(match[1]),
                };
                continue;
              }
            }
            if (options.date) {
              let reg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\+[0-9]{2}:[0-9]{2}$/;
              if (match = value.match(reg)) {
                d = new Date(value);
                line[k] = {
                  '__type': 'Date',
                  'iso': d.toISOString(),
                };
                continue;
              }
            }
            if (options.object) {
              try {
                line[k] = JSON.parse(value);
                continue;
              } catch(e) {
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
  },
};
