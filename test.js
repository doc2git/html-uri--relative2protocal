'use strict';

const fs = require('fs');
const url = require('url');
const is = require('valido');
const config = require('./config');

function genSingleUrl(config, curHtml, innerRelativePath) {

    if (!is.uri(config.baseUri)) {
        throw new TypeError('Invalid baseUri');
    }

    if (!is.string(config.basePath) || !/^\//.test(config.basePath)) {
        throw new TypeError('Invalid basePath');
    }

    if (!is.string(curHtml)) {
        throw new TypeError('Invalid current path');
    }

    if (!is.string(innerRelativePath)) {
        throw new TypeError('Invalid relative path');
    }

    if (is.uri(innerRelativePath)) {
        return innerRelativePath;
    }

    config.basePath = config.basePath.replace(/\/$/, '');
    config.baseUri = config.baseUri.replace(/\/$/, '');
    var absolutePath = url.resolve(curHtml, innerRelativePath);
    return absolutePath.replace(config.basePath, config.baseUri);
}


var str = `./docs/4.0/getting-started/options/index.html:  <script src="../../../../dist/js/bootstrap.min.js"></script>`
    .replace(/\.\.\/[^"']*/g, function () {
        return genSingleUrl(
            config,
            '/home/doc2git/bootstrap/get-bootstrap/docs/4.0/components/dropdowns/index.html',
            arguments[0]
        );
    });
console.log(str);
