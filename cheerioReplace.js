const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
var strHtml;
var uri = 'http://localhost:7785/docs/4.0/examples/grid/index.html';
uri = 'http://www.baidu.com';

function requestHtml(uri) {
    request('http://www.google.com', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
}

// requestHtml(uri);


async.waterfall([
    requestHtml(uri),
    // ()=>console.log(strHtml, '28---')
    // cheerioDo(),
]);

