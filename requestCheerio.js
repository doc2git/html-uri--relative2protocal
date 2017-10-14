var async = require('async');
var cheerio =require('cheerio');
var request = require('request');


function requestHtml(next) {
    request('http://www.baidu.com', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        next(null,body)
    });
}
function cheerioAtrr() {
    console.log(htmlStr)
    const $ = cheerio.load(htmlStr);
    $('h2.title').text('Hello there!')
    // $('h2').addClass('welcome')
    $.html()
    return cheerio;
}

async.waterfall([
    function (next) {
        requestHtml(next)
    },function(data){
        let $ = cheerio.load(data)
        // $('html img').each((index,item)=>{
        //     console.log($(item).attr('src'))
        // });
        $('html *').each((index,item)=>{
            var ele = $(item)[0]
            // console.log(ele);
            if(ele.attribs.src) console.log(ele.attribs.src);
            if(ele.attribs.link) console.log(ele.attribs.link);
        })
    }
], err=>console.log('All Done!'));
