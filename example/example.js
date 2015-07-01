var loadYaml = require('../index.js');
var path   = require('path');

var p = path.join(__dirname, 'example.yml');

loadYaml(p, function (data) {
    console.log(data);
});
