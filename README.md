# yaml-markdown
Extend the yaml-js parser with a markdown type,  React-output is optional.

## install

`npm install yaml-markdown`

## usage

Use the custom `!md` and `!md-react` tags to load the markdown-files (the given path is relative to the `.yml`-file).

```yml
test_markdown: !md './example.md'
test_markdown_react: !md-react './example.md'
```

Use the exposed methods to load the yaml with the markdown-schema file.

```js
    var loadYaml = require('../index.js');
    var path   = require('path');

    var p = path.join(__dirname, 'example.yml');

    loadYaml(p, function (data) {
        console.log(data);
    });

```

Additional options for the `yaml-parser` can be used via a third-attribute to the exposed function.
