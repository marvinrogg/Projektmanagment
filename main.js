

console.log("Fahrplandaten");
console.log("");
var Client = require('node-rest-client').Client;
var client = new Client();
var city = "Offenburg";
var express = require('express');
var app = express();

/*
var apiai = require('apiai');

var app = apiai("e605f41a45d34a969546694711fd7fe0");

var request = app.textRequest('Abfahrten aus  Offenburg', {
    sessionId: '1'
});

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();
*/



var args = {
    headers: {"Authorization": "Bearer 207af2c9a411a2846e84fd7dd96d9c83"}
};


//get Date

var date = new Date();
var year = date.getFullYear();
year = year.toString().substr(-2);


if (date.getDate() < 10) {
    var day = "0" + date.getDate();
} else {
    var day = date.getDate();
}


if (date.getMonth() + 1 < 10) {
    var month = "0" + date.getMonth() + 1;
} else {
    var month = date.getMonth() + 1;
}

var yymmdd = year + "" + month + "" + day;
var currenthours = date.getHours();


// Methodenaufrufe
getDeparture();
//getChangedTime();


//Abfrage Haltestops, geplante Abfahrtszeit und geänderte Abfahrtszeit
function getChangedTime() {
    var eva;
    client.get("https://api.deutschebahn.com/timetables/v1/station/" + city, args, function (data, response) {


        //console.log("Abfahrtsbahnhof: " + city);
        eva = data.stations.station.$.eva;

       // console.log("ID des Bahnhofs: " + eva);


       // console.log("______________________________________");

        // Abfrage der Verpätungen
        client.get("https://api.deutschebahn.com/timetables/v1/rchg/" + eva, args, function (data, response) {

            console.log("Verspätung von: " + city);
            console.log("______________________________________");
            for(var i=0;i<data.timetable.s.length;i++){



                if (data.timetable.s[i].$.id !== (undefined)){
                if(data.timetable.s[i].$.id.substring(0,19)<0){
                    console.log("ID: "+data.timetable.s[i].$.id.substring(0,20));
                }else{
                    console.log("ID: "+data.timetable.s[i].$.id.substring(0,18));
                }}

                if (data.timetable.s[i].ar !== (undefined)) {
                    if (data.timetable.s[i].ar.$ !== (undefined)){
                        var arD = data.timetable.s[i].ar.$.ct;
                        var arDAusgabe = arD.substring(4,6)+"."+arD.substring(2,4)+"."+arD.substring(0,2);
                        var arHAusgabe = arD.substring(6,8) + ":" + arD.substring(8,10);
                        console.log("Ankunftsänderung: " + arDAusgabe + "\t" + arHAusgabe);
                    }
                }

                if (data.timetable.s[i].dp !== (undefined)) {
                    if (data.timetable.s[i].dp.$ !== (undefined)){
                        var dpD = data.timetable.s[i].dp.$.ct;
                        var dpDAusgabe = dpD.substring(4,6)+"."+dpD.substring(2,4)+"."+dpD.substring(0,2);
                        var dpHAusgabe = dpD.substring(6,8) + ":" + dpD.substring(8,10);
                        console.log("Abfahrtsänderung: " + dpDAusgabe + "\t" + dpHAusgabe);
                    }
                }
                console.log("______________________________________");
            }

        });





});
}

// Abfrage der BahnhofsID & Abfahrten
function getDeparture() {

    //Abfrage der BahnhofsID
    var eva;
    client.get("https://api.deutschebahn.com/timetables/v1/station/" + city, args, function (data, response) {


        console.log("Abfahrtsbahnhof: " + city);
        eva = data.stations.station.$.eva;
        stadt = "Abfahrtsbahnhof: " + city
        console.log("ID des Bahnhofs: " + eva);
        eva1 = "ID des Bahnhofs: " + eva;

        console.log("______________________________________")

        // Abfrage der Abfahrten und Abfahrtszeiten
        client.get("https://api.deutschebahn.com/timetables/v1/plan/" + eva + "/" + yymmdd + "/" + currenthours, args, function (data, response) {

            ziel = new Array();

            for (var i = 0; i < data.timetable.s.length; i++) {

                if (data.timetable.s[i].dp !== (undefined)) {
                    //Ziele der Abfahrt (Planned Path)
                    console.log("Zielbahnhöfe: " + data.timetable.s[i].dp.$.ppth);


                    //Abfahrtszeit geplant (PlannedTime)
                    var abfahrtszeit = data.timetable.s[i].dp.$.pt.toString();
                    var abfahrtsdatum = abfahrtszeit.substring(4, 6) + "." + abfahrtszeit.substring(2, 4) + "." + abfahrtszeit.substring(0, 2);
                    var uhrzeit = abfahrtszeit.substring(6, 8) + ":" + abfahrtszeit.substring(8, 10);
                    console.log("Abfahrt: " + abfahrtsdatum + "  " + uhrzeit + "");
                    ziel[i]= "Zielbahnhöfe: " + data.timetable.s[i].dp.$.ppth +" " +"Abfahrt: " + abfahrtsdatum + "  " + uhrzeit + "";

                    //Abfahrtszeit geändert (ChangedTime) / Verspätungen funktioniert so nicht, da es bei der DB (noch?) nicht möglich ist
                    if (data.timetable.s[i].dp.$.ct === undefined) {
                        console.log("Keine Verspätungen bekannt");
                        console.log("______________________________________");
                    } else {
                        console.log("Geänderte Abfahrtszeit: " + data.timetable.s[i].dp.$.ct.toString().substr(-4));
                        console.log("______________________________________");
                    }

                }


            }


        });


    });
}







// gibt die EVA Nummer zurück
/*function getEva() {

    client.get("https://api.deutschebahn.com/timetables/v1/station/" + city, args, function (data, response) {


                console.log("Abfahrtsbahnhof: " + city);
                eva = data.stations.station.$.eva;

                console.log("ID des Bahnhofs: " + eva);


                console.log("______________________________________")





                    });


    }
*/


app.set('view engine','ejs');
app.get('/', function (req, res) {
    res.render('traininfo')
});
app.listen(3000);






