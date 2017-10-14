'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const is = require('valido');
const config = require('./config');

function genSingleUrl(config, curHtml, innerRelativePath) {
    console.log('10----');

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
    //var absolutePath = path.resolve(curHtml, '../' + innerRelativePath);
    var absolutePath = url.resolve(curHtml, innerRelativePath);
    console.log(config.basePath, absolutePath, '0350----');
    return absolutePath.replace(config.basePath, config.baseUri);
}

// function genSingleUrl() {
//
// }


var write = (callback, filePath, strContent) =>
    Promise.resolve(callback(filePath))
        .then(
            function (filePath) {
                fs.writeFile(filePath, strContent, 'utf8', err => {
                    if (err) console.error(err);
                    console.log(filePath + ' has been converted!\n');
                });
            }
        );

function replaceRelativeUriToProtocalUriInHtml(config, ...args) {
    args = config.uriReplaceSrcList.concat([...args]);
    let defaultFnRenameFileRule = function (inputFilename) {
        //return inputFilename.replace(/\.html$/, '') + '-converted' + '.html';
        return inputFilename + '.htm';
    };
    let fnRenameFileRule = args[0];
    if (typeof args[0] === 'function') {
        args[0] = args.slice(-1)[0];
        args.length--;
    } else {
        fnRenameFileRule = defaultFnRenameFileRule;
    }
    args.forEach(function (itemName) {
        var f = {};



        var promiseHtml = new Promise((resolve, reject) => {
            resolve(fs.readFileSync(itemName, 'utf8'))
        });
        promiseHtml
            .then(function (content) {
                return content.replace(/\.\.\/[^"']*/g, function () {
                    var replacedUri = genSingleUrl(
                        config,
                        itemName,
                        url.resolve(arguments[0], '..')
                    );
                    console.log(replacedUri, '78---**+++');
                    return replacedUri;
                });
            }).then(function (content) {
            if (/\.\.\/[^"']*/g.test(content)) {
                console.error('Maybe a error has been caused, a "replace ancestors reference uri" still exists after prevsious replace, ');
            } else {
                return content;
            }
        }).then(function (content) {
            //replacedHtml = replacedHtml.replace(/(["'])(\.\/)?(\.\.\.\/)?[^(\.\./|http://|https://)][^"']*/, function () {
            var regExpCurDir = /=\s*["']((?:\.\/)?(?:\.\.\.\/)?[^>'"]+)['"]/g;
            return content.replace(regExpCurDir, function () {
                console.log(arguments[0], '98----********');
                console.log(arguments[1], '99----********');
                console.log(arguments[2], '100----********');
                var replacedUri = arguments[1];
                if (/^(http:\/\/|https:\/\/)/.test(replacedUri)) {
                    return replacedUri;
                }
                return genSingleUrl(
                    config,
                    itemName,
                    arguments[0]
                );
            });
            // console.log(content, '118&&&&&&&&&&&&&&&&&&&&&');
        })
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

