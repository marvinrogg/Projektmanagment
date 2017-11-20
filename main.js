
var Client = require('node-rest-client').Client;

var client = new Client();
var city ="Offenburg";


var args = {
    headers : {"Authorization" : "Bearer 207af2c9a411a2846e84fd7dd96d9c83"} };




var id = getEva();


// direct way



function getEva() {


    client.get("https://api.deutschebahn.com/timetables/v1/station/" + city, args, function (data, response) {


        //console.log(city);
        var eva = data.stations.station.$.eva;

        //console.log(eva);
        return eva;

    });

}

console.log(getEva());



//client.get("https://api.deutschebahn.com/timetables/v1/plan/"+ eva +"/171116/15", args, function (data, response) {


       /* for(var i = 0; data.timetable.s[i].dp.$.ppth != null; i++){

               if(data.timetable.s[i].dp.$.ppth == undefined){

               }else{
                   console.log(data.timetable.s[i].dp.$.ppth);
               }

        */

     //  console.log(data.timetable.s[0].dp.$.ppth);


   // });













