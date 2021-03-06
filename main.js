

console.log("Fahrplandaten");
console.log("");
var Client = require('node-rest-client').Client;
var client = new Client();
var city = "";
var express = require('express');
var app = express();
var renderpage = express();
var renderpage2 = express();
var HashMap = require('hashmap');




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
    var month = "" + date.getMonth() + 1;
} else {
    var month = date.getMonth() + 1;
}

var yymmdd = year + "" + month + "" + day;

if(date.getHours() < 10){
    var currenthours = "0" + date.getHours();
}else{
    var currenthours = date.getHours();
}




// Methodenaufrufe
//getDeparture();
//getChangedTime();


//Abfrage Haltestops, geplante Abfahrtszeit und geänderte Abfahrtszeit
function getChangedTime() {
    var eva;
    var map = new HashMap();
    verspaetung = new Array();
    count2 = 0;

    client.get("https://api.deutschebahn.com/timetables/v1/station/" + city, args, function (data, response) {


        //console.log("Abfahrtsbahnhof: " + city);
        eva = data.stations.station.$.eva;
        stadt = "Abfahrtsbahnhof: " + city;
        eva1 = "ID des Bahnhofs: " + eva;

       // console.log("ID des Bahnhofs: " + eva);


       // console.log("______________________________________");

        // Abfrage der Verpätungen
        client.get("https://api.deutschebahn.com/timetables/v1/rchg/" + eva, args, function (data, response) {

            console.log("Verspätung von: " + city);
           // console.log("______________________________________");


            if(data.timetable.s !== (undefined)){

            for(var i=0;i<data.timetable.s.length;i++){


            var test;

                if (data.timetable.s[i].$.id !== (undefined)){

                  //  console.log("ID: "+data.timetable.s[i].$.id);
                    test =data.timetable.s[i].$.id;

                }

                if (data.timetable.s[i].ar !== (undefined)) {
                    if (data.timetable.s[i].ar.$ !== (undefined)){
                        var arD = data.timetable.s[i].ar.$.ct;
                        var arDAusgabe = arD.substring(4,6)+"."+arD.substring(2,4)+"."+arD.substring(0,2);
                        var arHAusgabe = arD.substring(6,8) + ":" + arD.substring(8,10);
                      //  console.log("Ankunftsänderung: " + arDAusgabe + "\t" + arHAusgabe);
                        test2 = " Ankunftsänderung: " + arDAusgabe + "\t" + arHAusgabe;

                    }else {
                        test2 = "";
                    }
                }else {
                    test2 = "";
                }




                if (data.timetable.s[i].dp !== (undefined)) {
                    if (data.timetable.s[i].dp.$ !== (undefined)){
                        var dpD = data.timetable.s[i].dp.$.ct;
                        var dpDAusgabe = dpD.substring(4,6)+"."+dpD.substring(2,4)+"."+dpD.substring(0,2);
                        var dpHAusgabe = dpD.substring(6,8) + ":" + dpD.substring(8,10);
                        // console.log("Abfahrtsänderung: " + dpDAusgabe + "\t" + dpHAusgabe);
                        test3 = " Abfahrtsänderung: " + dpDAusgabe + "\t" + dpHAusgabe;
                    }else {
                        test3 = "";
                    }
                }else {
                    test3 = "";
                }


                map.set(test, test2+test3);

            }
            }

            client.get("https://api.deutschebahn.com/timetables/v1/plan/" + eva + "/" + yymmdd + "/" + currenthours, args, function (data, response) {



                for (var k = 0; k < data.timetable.s.length; k++) {


                    if (data.timetable.s[k].dp !== (undefined)) {


                        if(map.get(data.timetable.s[k].$.id) !== undefined){


                            console.log("Zielbahnhöfe: " + data.timetable.s[k].dp.$.ppth);
                            var abfahrtszeit = data.timetable.s[k].dp.$.pt.toString();
                            var abfahrtsdatum = abfahrtszeit.substring(4, 6) + "." + abfahrtszeit.substring(2, 4) + "." + abfahrtszeit.substring(0, 2);
                            var uhrzeit = abfahrtszeit.substring(6, 8) + ":" + abfahrtszeit.substring(8, 10);
                            console.log("Abfahrt: " + abfahrtsdatum + "  " + uhrzeit + "");

                            console.log(map.get(data.timetable.s[k].$.id));
                            verspaetung[count2] = "Zielbahnhöfe: " + data.timetable.s[k].dp.$.ppth + " Abfahrt: " + abfahrtsdatum + "  " + uhrzeit + "" + map.get(data.timetable.s[k].$.id);
                            count2++;
                        }

                    }


                }


            });
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
            count = 0;
            for (var i = 0; i < data.timetable.s.length; i++) {

                if (data.timetable.s[i].dp !== (undefined)) {
                    //Ziele der Abfahrt (Planned Path)
                    console.log("Zielbahnhöfe: " + data.timetable.s[i].dp.$.ppth);


                    //Abfahrtszeit geplant (PlannedTime)
                    var abfahrtszeit = data.timetable.s[i].dp.$.pt.toString();
                    var abfahrtsdatum = abfahrtszeit.substring(4, 6) + "." + abfahrtszeit.substring(2, 4) + "." + abfahrtszeit.substring(0, 2);
                    var uhrzeit = abfahrtszeit.substring(6, 8) + ":" + abfahrtszeit.substring(8, 10);
                    console.log("Abfahrt: " + abfahrtsdatum + "  " + uhrzeit + "");
                    // xxx <br> Tag wird in ejs beim rendern nicht erkannt

                    ziel[count]= "Abfahrt: " + abfahrtsdatum + "  " + uhrzeit + " " + "Zielbahnhöfe: " + data.timetable.s[i].dp.$.ppth;
                    count++;
                    //Abfahrtszeit geändert (ChangedTime) / Verspätungen funktioniert so nicht, da es bei der DB (noch?) nicht möglich ist
                   /* if (data.timetable.s[i].dp.$.ct === undefined) {
                        console.log("Keine Verspätungen bekannt");
                        console.log("______________________________________");
                    } else {
                        console.log("Geänderte Abfahrtszeit: " + data.timetable.s[i].dp.$.ct.toString().substr(-4));
                        console.log("______________________________________");
                    }*/

                }


            }


        });


    });
}


//xxx Intention noch einfügen

app.get('/stadt/:id/:intention', function (req, res) {


    city = req.params.id;
    var intention = req.params.intention;

    console.log(city);
    console.log(intention);
    console.log("______________TEST_____________");

    if(intention == "getDeparture();"){

        getDeparture();

        renderpage.set('view engine','ejs');
        renderpage.get('/', function (req, res) {
            res.render('traininfo')
        });


    } else if (intention == "getChangedTime();"){

        getChangedTime();

        renderpage2.set('view engine','ejs');
        renderpage2.get('/', function (req, res) {
            res.render('traininfo2')
        });

    }





})



app.get ('*', function (req, res) {
    res.sendFile("/Users/myanhdoan/WebstormProjects/Projektmanagment/index.html")

})
renderpage.listen(3002);
renderpage2.listen(3003);
app.listen(3001);






