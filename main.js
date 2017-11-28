
// Aktuelles Problem, Reihenfolge der Darstellung der Abfragen und Fehlerbahndlungen der Abfragen
// Speichern der Rückgabewerte für Umwandlung

console.log("Fahrplandaten");
var Client = require('node-rest-client').Client;
var client = new Client();
var city ="Offenburg";



var args = {
    headers : {"Authorization" : "Bearer 207af2c9a411a2846e84fd7dd96d9c83"}
            };

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

function getDeparture(){


client.get("https://api.deutschebahn.com/timetables/v1/plan/8000290/171121/12", args, function (data, response) {


       for(var i = 0; data.timetable.s[i].dp.$.ppth != null; i++) {

          // if (data.timetable.s[i].dp.$ == undefined) {
         //   i++;
         //  } else {

 var b = ata.timetable.s[i].dp.$

           //Abfahrtszeit geplant (PlannedTime)
           console.log(data.timetable.s[i].dp.$.pt);

           //Abfahrtszeit geändert (CurrentTime)
           //console.log(data.timetable.s[i].dp.$.ct);

           //Ziele der Abfahrt (Planned Path)
           console.log(data.timetable.s[i].dp.$.ppth);



           // }

      }

   });

}















