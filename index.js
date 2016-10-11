var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var sensor = require('node-dht-sensor');
var spawn = require('child_process').spawn;
var ads1x15 = require('node-ads1x15');
var moment = require("momentjs");

var proc;
var lightHistory = [];
var id = 0;
var chip = 0; //0 for ads1015, 1 for ads1115
var idLight;

//Simple usage (default ADS address on pi 2b or 3):
var adc = new ads1x15(chip);

// Optionally i2c address as (chip, address) or (chip, addr$
// So to use  /dev/i2c-0 use the line below instead...:

//    var adc = new ads1x15(chip, 0x48, 'dev/i2c-0');

var samplesPerSecond = '250'; // see index.js for allowed v$
var progGainAmp = '4096'; // see index.js for allowed value$

app.use('/', express.static(path.join(__dirname, 'stream')));
console.log(path.join(__dirname, "Chart.LinearGauge.js"));
app.use("/static", express.static('public')); 
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
var sockets = {};
 
io.on('connection', function(socket) {
 
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);
 
  socket.on('disconnect', function() {
    delete sockets[socket.id];
 
    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  });
 
  socket.on('start-stream', function() {
    startStreaming(io);
  });
 
});
 
http.listen(3000, function() {
  console.log('listening on *:3000');
});
 
function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./stream/image_stream.jpg');
  }
}
function readTemp() {
  sensor.read(11, 4, function(err, temperature, humidity) {
    console.log(err);
    if (!err) {
        var values = {temp:parseFloat(temperature.toFixed(1)), humidity: parseFloat(humidity.toFixed(1))};
        console.log(temperature.toFixed(1));
        console.log(values);
        io.sockets.emit('temp', values);
        setTimeout(readTemp, 5000);
    }
  });
  
}
function readLight() {
  var reading  = 0;
  if(!adc.busy)
  {
    adc.readADCSingleEnded(1, progGainAmp, samplesPerSecond, function(err, data) {
      // if you made it here, then the data object contains y$
      reading = data;
      if(lightHistory.length > 12) {
        lightHistory.shift();
      }
      lightHistory.push({time: moment().format("hh:mm:ss"), light:data});
      io.sockets.emit("light", lightHistory);
      console.log("Light", data);
      // any other data processing code goes here...
    });
  }
  setTimeout(readLight, 5000);
}
function readWater() {
  var reading  = 0;
  if(!adc.busy)
  {
    adc.readADCSingleEnded(0, progGainAmp, samplesPerSecond, function(err, data) {
      // if you made it here, then the data object contains y$
      reading = data;
      io.sockets.emit("water", data);
      console.log("Water", data);
      // any other data processing code goes here...
    });
  }
  setTimeout(readWater, 5000);
}
function startStreaming(io) {
  if(!idLight) {
    setTimeout(readTemp, 5000);
    idLight = setTimeout(readLight, 4000);
    setTimeout(readWater, 1000);
    if (app.get('watchingFile')) {
      io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
      return;
    }
   


   
    console.log('Watching for changes...');
   
    app.set('watchingFile', true);
   
    fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
      io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    })
  }
}
