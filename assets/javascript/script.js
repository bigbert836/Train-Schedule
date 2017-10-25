// Initialize Firebase
var config = {
	apiKey: "AIzaSyCr3GuG8a9YapRdytWt6_neazqxyXBQOvA",
    authDomain: "rpsdb-58590.firebaseapp.com",
    databaseURL: "https://rpsdb-58590.firebaseio.com",
    projectId: "rpsdb-58590",
    storageBucket: "",
    messagingSenderId: "869741659106"
};

firebase.initializeApp(config);

var database = firebase.database();

var name;
var destination;
var time;
var frequency;

$("#submit").click(function(event){
	event.preventDefault();
	name = $("#name").val().trim();
	destination = $("#destination").val().trim();
	time = $("#time").val().trim();
	frequency = $("#frequency").val().trim();

	database.ref().push({
			name: name,
			destination: destination,
			time: time,
			frequency: frequency,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
	});

	$("#name").val("");
	$("#destination").val("");
 	$("#time").val("");
  	$("#frequency").val("");
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {


  	// Store everything into a variable.
	 var newName = childSnapshot.val().name;
	 var newDestination = childSnapshot.val().destination;
	 var newTime = childSnapshot.val().time;
	 var newFrequency = childSnapshot.val().frequency;

	 var nextArrival;
	 var minutesAway;
	
	// First Time (pushed back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(newTime, "hh:mm").subtract(1, "years");

	// Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % newFrequency;

    // Minute Until Train
    minutesAway = newFrequency - tRemainder;

    // Next Train
    nextArrival = moment().add(minutesAway, "minutes");
    
  $("tbody").append("<tr><td>" + newName + "</td><td>" + newDestination + "</td><td>" +
  newFrequency + "</td><td>" + moment(nextArrival).format("hh:mm") + "</td><td>" + minutesAway + "</td>");

});