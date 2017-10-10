var replaceRelativeUriToProtocalUriInHtml = require('./index.js');
var uriReplaceSrcList = require('./uriReplaceSrcList.js');
replaceRelativeUriToProtocalUriInHtml('http://localhost:3378/a/b/c/d/e/f/g', ...uriReplaceSrcList);