let replaceRelativeUriToProtocalUriInHtml = require('./index.js');
let uriReplaceSrcList = require('./test-dir/uriReplaceSrcList.js');
let fnRenameFileRule = function (inputFilename) {
    return inputFilename.replace(/\.html$/, '') + '-converted' + '.html';
};
replaceRelativeUriToProtocalUriInHtml('http://localhost:3378/a/b/c/d/e/f/g', fnRenameFileRule, ...uriReplaceSrcList);