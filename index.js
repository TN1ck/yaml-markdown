var marked = require('marked');
var fs     = require('fs');
var path   = require('path');
var yaml   = require('js-yaml');
var react  = require('react');

var createSchema = function (filename) {

    var loadMarkdownSync = function (mdPath) {
        var p = path.join(path.dirname(filename), mdPath)
        var data;

        try {
            data = fs.readFileSync(p, 'utf8');
        } catch (e) {
            throw e;
        }

        return marked(data);
    };

    var createReactFromMarkdown = function(md) {
        return react.createElement('span', {
            dangerouslySetInnerHTML: {
                __html: md
            }
        });
    };


    var MarkdownYamlType = new yaml.Type('!md', {
        kind: 'scalar',
        construct: loadMarkdownSync
    });

    var MarkdownReactYamlType = new yaml.Type('!md-react', {
        kind: 'scalar',
        construct: function (mdPath) {
            return createReactFromMarkdown(loadMarkdownSync(mdPath));
        },
        represent: function (obj) {
            obj.toString();
        }
    });

    return yaml.Schema.create([ MarkdownYamlType, MarkdownReactYamlType ]);
};


var loadWithMarkdown = function (filename, callback, options) {

    options = options || {};
    options.schema = createSchema(filename);

    fs.readFile(filename, 'utf8', function (error, data) {
        var loaded;

        if (!error) {
            loaded = yaml.load(data, options);
            callback(loaded);
        } else {
            console.error(error.stack || error.message || String(error));
        }

    });

};

module.exports = loadWithMarkdown;
