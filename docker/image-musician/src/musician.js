//--------------UDP socket-----------------------
//Protocol udp address and port
var protocolUDP = new Object();
protocolUDP.MULTICAST_ADDRESS = "239.255.22.5";
protocolUDP.PORT = 7542;

//we use a standard Node.js module to work with UDP
var dgram = require('dgram'); 

//create datagram socket. We will use it to send our UDP dtatagrams
var socketUDP = dgram.createSocket('udp4');

//config socket
socketUDP.bind(protocolUDP.PORT, function(){
    console.log("Joining multicast group");
    socketUDP.addMembership(protocolUDP.MULTICAST_ADDRESS);
});

//-----------Create musician---------------
//uuid for the musician's unique id 
const uuidv1 = require('uuid/v1');
var instrument = process.argv[2]; 
var sound;

switch(instrument){
	case "piano":
		sound = "ti-ta-ti";
		break;
	case "flute":
		sound = "trulu";
		break;
	case "trumpet":
		sound = "pouet";
		break;
	case "violin":
		sound = "gzi-gzi";
		break;
	case "drum":
		sound = "boum-boum";
		break;
}


var musician = new Object();
musician.uuid = uuidv1();
musician.sound = sound;

//-----------------UDP sender-------------

var payload = JSON.stringify(musician);

var intervalID = setInterval(function(){
	//sending payload 
	message = new Buffer(payload);
	socketUDP.send(message, 0, message.length, protocolUDP.PORT, protocolUDP.MULTICAST_ADDRESS, 
		function(err, bytes){
			console.log("Sending payload: " + payload + " via port " + socketUDP.address().port);
		});
}, 1000);
