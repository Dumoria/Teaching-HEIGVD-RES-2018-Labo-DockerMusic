

//--------------Protocol----------------------
var protocolUDP = new Object();
protocolUDP.PROTOCOL_PORT = 7305;
protocolUDP.PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";

var protocolTCP = new Object();
protocolTCP.PROTOCOL_PORT = 2205;
protocolTCP.PROTOCOL_ADDRESS = "0.0.0.0";


const moment = require('moment');
moment().format();


//--------------UDP socket-----------------------
//we use a standard Node.js module to work with UDP
var dgram = require('dgram');

//create datagram socket. We will use it to send our UDP dtatagrams
var socketUDP = dgram.createSocket('udp4');

//config socket
socketUDP.bind(protocolUDP.PROTOCOL_PORT, function(){
    console.log("Joining multicast group");
    socketUDP.addMembership(protocolUDP.PROTOCOL_MULTICAST_ADDRESS);
});


//--------------TCP socket-----------------------

var musicians = [];

//we use a standard Node.js module to work with TCP
var net = require('net');

var server = net.createServer(function(socket) {
    var len = musicians.length;
    for (var i = 0; i < len; i++) {
        //Remove musicians if didn't hear it since 5 seconds
        var dateAct = moment();
        var diff = dateAct - musicians[i].activeSince;
        if(diff >= 5000){
            musicians.splice(i, 1);
        }
    }
	
    var payload = JSON.stringify(musicians);
socket.write(payload);
	socket.pipe(socket);
	socket.end();

});

server.listen(protocolTCP.PROTOCOL_PORT, protocolTCP.PROTOCOL_ADDRESS);


//---------------musicians array----------------

var musiciansAndSounds = new Map();
musiciansAndSounds.set("ti-ta-ti", "piano");
musiciansAndSounds.set("pouet", "trumpet");
musiciansAndSounds.set("trulu", "flute");
musiciansAndSounds.set("gzi-gzi", "violin");
musiciansAndSounds.set("boum-boum", "drum");
	

//--------------Getting new datagram (callback fct)-----------------------
socketUDP.on('message', function(msg, source){

	//Parse the datagram
	var dataReceived = JSON.parse(msg);

	//Values for for
	var len = musicians.length;
	var found = false;
	for (var i = 0; i < len; i++) {
	
		if(musicians[i].uuid == dataReceived.uuidMus){
			musicians[i].activeSince = moment();
			musicians[i].stillActif = true;
			found = true;
			i = len;
		}
	}
	if(found == false){
		var musician = new Object();
		musician.uuid = dataReceived.uuidMus;
		musician.instrument = musiciansAndSounds.get(dataReceived.sound);
        musician.activeSince = moment();
		musician.stillActif = true;
		
		musicians[len] = musician;
	}

    for (var i = 0; i < len; i++) {
        console.log( musicians[i].instrument + " " + musicians[i].uuid);
    }
		
});






