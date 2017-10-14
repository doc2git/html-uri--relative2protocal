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
    var absolutePath = url.resolve(curHtml, '../' + innerRelativePath);
    return absolutePath.replace(config.basePath, config.baseUri);
}

var read = (filePath, obj) => {
    return fs.readFileSync(filePath, 'utf8');
}

var write = (callback, filePath, strContent) =>
    Promise.resolve( callback(filePath) )
        .then(
            function (filePath) {
                fs.writeFile(filePath, strContent, 'utf8', err => {
                    if(err) console.error(err);
		    console.log(filePath + ' has been converted!\n');
                });
            }
        );

function replaceRelativeUriToProtocalUriInHtml(config, ...args) {
    args = config.uriReplaceSrcList.concat([...args]);
    let defaultFnRenameFileRule = function (inputFilename) {
        return inputFilename.replace(/\.html$/, '') + '-converted' + '.html';
    };
    let fnRenameFileRule = args[0];
    if (typeof args[0] === 'function') {
        args[0] = args.slice(-1)[0];
        args.length--;
    }else{
        fnRenameFileRule = defaultFnRenameFileRule;
    }
    args.forEach(function (itemName) {
        var f = {};

        function relativeToProtocal(content) {
            return content.replace(/\.\.\/[^"']*/g, function () {
                return genSingleUrl(
                    config,
                    itemName,
                    arguments[0]
                );
            })
        }

        Promise.resolve(
            relativeToProtocal(read(itemName, f))
        )
            .then(function (content) {
                write(fnRenameFileRule, itemName, content);
            });

    });
}

if (process.argv.length > 4) {
    var [node, curScript, baseUri, ...args] = process.argv;
    let uriReplaceSrcList = require('./uriReplaceSrcList.js');
    replaceRelativeUriToProtocalUriInHtml(config.baseUri, ...args);
}

module.exports = replaceRelativeUriToProtocalUriInHtml;

