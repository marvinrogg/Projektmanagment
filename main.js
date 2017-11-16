


console.log("Hallo World");


var Client = require('node-rest-client').Client;

var client = new Client();


// direct way
client.get("http://www.web.de", function (data, response) {
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
});



var express = require('express');
var app = express();

var a = "Guten Tag";

app.get('/', function (req, res) {
    res.send('<h1> Hello World 2222! </h1>' + a );

});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});