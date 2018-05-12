

//--------------Protocol----------------------
var protocolUDP = new Object();
protocolUDP.PROTOCOL_PORT = 7305;
protocolUDP.PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";

var protocolTCP = new Object();
protocolTCP.PROTOCOL_PORT = 2205;
protocolTCP.PROTOCOL_ADDRESS = "0.0.0.0";


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

    var payload = JSON.stringify(musicians);
    socket.write(payload);

});

server.listen(protocolTCP.PROTOCOL_PORT, protocolTCP.PROTOCOL_ADDRESS);


//---------------musicians array----------------

var musiciansAndSounds = new Map();
musiciansAndSounds.set("ti-ta-ti", "piano");
musiciansAndSounds.set("pouet", "trumpet");
musiciansAndSounds.set("trulu", "flute");
musiciansAndSounds.set("gzi-gzi", "violin");
musiciansAndSounds.set("boum-boum", "drum");
	


//--------------fct called periodically to remove musicians----------
var intervalID = /*async.*/setInterval(function(){
    var len = musicians.length;
    for (var i = 0; i < len; i++) {
        //Remove musicians if didn't hear it since 5 seconds
        var dateAct = Date.now();
        var diff = Math.abs(dateAct - musicians[i].activeSince);
        if(diff >= 5000){
            musicians.splice(i, 1);
        }
    }

}, 1000);


//--------------Getting new datagram (callback fct)-----------------------
socketUDP.on('message', function(msg, source){

	//Parse the datagram
	var dataReceived = JSON.parse(msg);
	var musician = new Object();

	//Values for for
	var len = musicians.length;
	var found = false;
	for (var i = 0; i < len; i++) {
	
		if(musicians[i].uuid == dataReceived.uuidMus){
			musicians[i].activeSince = Date.now();
			found = true;
			i = len;
		}
	}
	if(found == false){
		musician.uuid = dataReceived.uuidMus;
		musician.instrument = musiciansAndSounds.get(dataReceived.sound);
        musician.activeSince = Date.now();
		musicians[len] = musician;
	}

    for (var i = 0; i < len; i++) {
        console.log( musicians[i].instrument + " " + musicians[i].uuid);
    }
		
});





