 var readline = require('linebyline'),
 rl = readline('./uriReplaceSource.list', {
	     retainBuffer: true //tell readline to retain buffer  
 });
var obj = {};
rl.on("line", function (data,linecount){
	obj[linecount] = data;
});
console.log(obj);
