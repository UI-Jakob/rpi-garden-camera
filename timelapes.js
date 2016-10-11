var fs = require('fs');
var path = require('path');

var RaspiCam = require("raspicam");

var camera = new RaspiCam({ 
	mode: "timelapse",
	output: "./timelapse/image_%06d.jpg", // image_000001.jpg, image_000002.jpg,...
	encoding: "jpg",
	timelapse: 3000, // take a picture every 3 seconds
	timeout: 0 // take a total of 4 pictures over 12 seconds });
});
//to take a snapshot, start a timelapse or video recording
camera.start( );

//listen for the "start" event triggered when the start method has been successfully initiated
camera.on("start", function(){
    //do stuff
});

//listen for the "read" event triggered when each new photo/video is saved
camera.on("read", function(err, timestamp, filename){ 
    //do stuff
});

//listen for the "stop" event triggered when the stop method was called
camera.on("stop", function(){
    //do stuff
});

//listen for the process to exit when the timeout has been reached
camera.on("exit", function(){
    //do stuff
});