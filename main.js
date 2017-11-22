
// Aktuelles Problem, Reihenfolge der Darstellung der Abfragen und Fehlerbahndlungen der Abfragen
// Speichern der Rückgabewerte für Umwandlung

console.log("Fahrplandaten");
var Client = require('node-rest-client').Client;
var client = new Client();
var city ="Offenburg";

/*
//TEST Webseite erstellen
var express =require('express');
var app = express();

app.set('view engine', 'ejs');
app.get('/', function (req,res) {

    res.render('index', { title: 'My cool page!'})

});
app.listen(3000);

*/


var args = {
    headers : {"Authorization" : "Bearer 207af2c9a411a2846e84fd7dd96d9c83"}
            };



//get Date

var date = new Date();
var year = date.getFullYear();
year = year.toString().substr(-2);
var month = date.getMonth()+1;
var day = date.getDate();

var yymmdd = year+""+month+""+day;
var currenthours = date.getHours();

console.log(yymmdd);


eva = getEva();

departure = getDeparture();


// direct way

// gibt die EVA Nummer zurück
function getEva() {


                client.get("https://api.deutschebahn.com/timetables/v1/station/" + city, args, function (data, response) {


                                console.log(city);
                                    var eva = data.stations.station.$.eva;

                            console.log(eva);
                                return eva;

                        });

        }


/* Test über departure Board, allerdings Fehler da stopName immer Offenburg


function getDeparture() {

    client.get("https://api.deutschebahn.com/fahrplan-plus/v1/departureBoard/"+8000290+"?date=2017-11-16", args, function (data, response) {

        console.log(data);

    });
}
*/


//Abfrage Haltestops, geplante Abfahrtszeit und geänderte Abfahrtszeit
//aktuelles Problem, Reihenfolge der Darstellung und Error Handling
function getDeparture(){


client.get("https://api.deutschebahn.com/timetables/v1/plan/8000290/171122/14", args, function (data, response) {


       for(var i = 0; data.timetable.s[i].dp !== (undefined); i++) {

           if (data.timetable.s[i].dp.$ === undefined) {
            i++;
           } else {



           //Abfahrtszeit geplant (PlannedTime)
           console.log(data.timetable.s[i].dp.$.pt);

           //Abfahrtszeit geändert (ChangedTime)
           console.log(data.timetable.s[i].dp.$.ct);

           //Ziele der Abfahrt (Planned Path)
           console.log(data.timetable.s[i].dp.$.ppth);



            }

      }

   });

}















