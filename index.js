var marked = require('marked');
var fs     = require('fs');
var path   = require('path');
var yaml   = require('js-yaml');

var createSchema = function (filename) {

    var loadMarkdownSync = function (mdPath) {
        var p = path.join(path.dirname(filename), mdPath);
        var data;

        try {
            data = fs.readFileSync(p, 'utf8');
        } catch (e) {
            throw e;
        }

        return marked(data);
    };

    var MarkdownYamlType = new yaml.Type('!md', {
        kind: 'scalar',
        construct: loadMarkdownSync
    });

    var MarkdownJSONYamlType = new yaml.Type('!md-json', {
        kind: 'scalar',
        construct: function (mdPath) {
            return {
                filename: filename,
                md: loadMarkdownSync(mdPath)
            };
        }
    });

    return yaml.Schema.create([ MarkdownYamlType, MarkdownJSONYamlType ]);
};


var loadWithMarkdown = function (filename, callback, options, data) {

    options = options || {};
    options.schema = createSchema(filename);

    // the data is file-contents are already loaded
    if (data) {
        var loaded = yaml.load(data, options);
        callback(loaded);
        return loaded;
    } else {
        fs.readFile(filename, 'utf8', function (error, data) {
            var loaded;

            if (!error) {
                loaded = yaml.load(data, options);
                callback(loaded);
            } else {
                console.error(error.stack || error.message || String(error));
            }

        });
    }


};

module.exports = loadWithMarkdown;
