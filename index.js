'use strict';

const fs = require('fs');
const url = require('url');
const is = require('valido');

function absolutify(baseUrl, partialUrl) {
    if (!is.uri(baseUrl)) {
        throw new TypeError('Invalid base URL');
    }

    if (!is.string(partialUrl)) {
        throw new TypeError('Invalid partial URL');
    }

    if (is.uri(partialUrl)) {
        return partialUrl;
    }

    return url.resolve(baseUrl, partialUrl);
}



var read = (filePath, obj) => {
    return fs.readFileSync(filePath, 'utf8');
}

var write = (callback, filePath, strContent) =>
    Promise.resolve( callback(filePath) )
        .then(
            function (filePath) {
                fs.writeFile(filePath, strContent, 'utf8', err => {
                    console.log(strContent, '35++++++');
                    console.log(filePath, '34------');
                    if(err) console.error(err);
                });
            }
        );
//
// function ToHandleFileMaterial(filename = '', content = '') {
//     this.filename = filename;
//     this.content = content;
// }


function replaceRelativeUriToProtocalUriInHtml(uriBase, ...args) {
    // var [node, script, uriBase, ...args] = process.argv;
// args = Array.prototype.slice.call(args, 0);
    args = [...args];
    let defaultFnRenameFileRule = function (inputFilename) {
        return inputFilename.replace(/\.html$/, '') + '-converted' + '.html';
    };
    let fnRenameFileRule = args[0];
    if (typeof args[0] == 'function') {
        args[0] = args.slice(-1)[0];
        args.length--;
    }else{
        fnRenameFileRule = defaultFnRenameFileRule;
    }
    args.forEach(function (itemName) {
        var f = {};

        function relativeToProtocal(content) {
            return content.replace(/\.\.\/[^"']*/g, function () {
                return absolutify(uriBase, arguments[0]);
            })
        }

        Promise.resolve(
            relativeToProtocal(read(itemName, f))
        )
            .then(function (content) {
                // itemName = itemName.replace(/\.html$/, '') + '-converted' + '.html';
                //     itemName = fnRenameFileRule(itemName);
                // console.log(itemName, '----------##############*******-------:::::::::::::::::::::');
                write(fnRenameFileRule, itemName, content);
            });

    });
}

if (process.argv.length > 4) {
    var [node, curScript, uriBase, ...args] = process.argv;
    let uriReplaceSrcList = require('./uriReplaceSrcList.js');

    replaceRelativeUriToProtocalUriInHtml(uriBase, ...args);
}

module.exports = replaceRelativeUriToProtocalUriInHtml;

