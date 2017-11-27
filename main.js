
// Aktuelles Problem, Reihenfolge der Darstellung der Abfragen und Fehlerbahndlungen der Abfragen
// Speichern der Rückgabewerte für Umwandlung

console.log("Fahrplandaten");
console.log("");
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




eva = getEva();

departure = getDeparture();


// direct way

// gibt die EVA Nummer zurück
    function getEva() {


                client.get("https://api.deutschebahn.com/timetables/v1/station/" + city, args, function (data, response) {


                    console.log("Abfahrtsbahnhof: " + city);
                    var eva = data.stations.station.$.eva;

                    console.log("ID des Bahnhofs: " + eva);


                    console.log("______________________________________")

                    return eva;

                        });

        }





//Abfrage Haltestops, geplante Abfahrtszeit und geänderte Abfahrtszeit
//aktuelles Problem, Reihenfolge der Darstellung und Error Handling
function getDeparture(){


client.get("https://api.deutschebahn.com/timetables/v1/plan/8000290/171127/10", args, function (data, response) {



    for(var i = 0; i < data.timetable.s.length; i++) {

    if ( data.timetable.s[i].dp !== (undefined)){
            //Ziele der Abfahrt (Planned Path)
           console.log("Zielbahnhöfe: " + data.timetable.s[i].dp.$.ppth);

           //Abfahrtszeit geplant (PlannedTime)
           console.log("Abfahrtszeit: " + data.timetable.s[i].dp.$.pt.toString().substr(-4));

           //Abfahrtszeit geändert (ChangedTime)
           if(data.timetable.s[i].dp.$.ct === undefined){
               console.log("Keine Verspätungen bekannt")
           }else{
           console.log("Geänderte Abfahrtszeit: " + data.timetable.s[i].dp.$.ct.toString().substr(-4));
           }
}

            console.log("______________________________________");




      }


   });

}















