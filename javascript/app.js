var firebaseConfig = {
    apiKey: "AIzaSyBF2TuYyv3HoOKl7Exz18wCGRdKtvRZ2b4",
    authDomain: "first-project-be0fd.firebaseapp.com",
    databaseURL: "https://first-project-be0fd.firebaseio.com",
    projectId: "first-project-be0fd",
    storageBucket: "",
    messagingSenderId: "378657750556",
    appId: "1:378657750556:web:e9a9490a087f6611"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Using Moment to set up Current Time
var globalCurrentHour = moment().hour();
var globalCurrentMinutes = moment().minutes();
var globalCurrentTime = moment(globalCurrentHour + ":" + globalCurrentMinutes, "HH:mm");
$(".currentTime").text(globalCurrentTime.format("h:mm a"));

var name;
var destination;
var firstTime;
var frequency;

// Submitting
$("#submit-button").on("click", function () {
    event.preventDefault();

    name = $("#trainNameInput").val().trim();
    destination = $("#trainDestinationInput").val().trim();
    firstTime = $("#trainTimeInput").val().trim();
    frequency = parseInt($("#frequencyInput").val().trim());

    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    })

    $("input").val("");
})

// Database pulling
database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val());
    // making new table element for entry
    newTrain = $("<tr>").appendTo($("#timeTable"));

    var submission = snapshot.val();
    var trainfirstTime = submission.firstTime;
    // formatting time (First Time is the display Time)
    var firstTime = moment(trainfirstTime, "HH:mm");


    // adjusting local Time
    var localCurrentHour = moment().hour();
    var localCurrentMinutes = moment().minutes();
    var localCurrentTime = moment(localCurrentHour + ":" + localCurrentMinutes, "HH:mm");
    $("#current-time").text(localCurrentTime.format("hh:mm a"));

    // Looking at train Time with Current Time
    var frequency = submission.frequency;
    if (firstTime > localCurrentTime) {
        var nextArrivalTime = firstTime.format("hh:mm a");
        var minutesAway = firstTime.diff(localCurrentTime, "minutes");
    } else {
        var differenceInMinutes = localCurrentTime.diff(firstTime, "minutes");
        var minutesAway = frequency-(differenceInMinutes % frequency);

        var nextArrival = localCurrentTime.add(minutesAway, "minutes");
        var nextArrivalHour = nextArrival.hour();
        var nextArrivalMinutes = nextArrival.minutes();
        var nextArrivalTime = moment(nextArrivalHour + ":" + nextArrivalMinutes, "HH:mm").format("hh:mm a");
    }

    // Moving Data to HTML
    var newTrain = $("<tr>").append(
        $("<td class='submission' id='name'>").text(submission.name),
        $("<td class='submission' id='destination'>").text(submission.destination),
        $("<td class='submission' id='firstTrain'>").text(firstTime.format("hh:mm a")),
        $("<td class='submission' id='frequency'>").text(submission.frequency),
        $("<td class='submission' id='nextArrival'>").text(nextArrivalTime),
        $("<td class='submission' id='minutesAway'>").text(minutesAway),
    )

    newTrain.appendTo($("#timeTable"));



}, function (errorObject) {

    console.log("The read failed: " + errorObject.code);
})