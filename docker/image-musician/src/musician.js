//--------------Protocol----------------------
var protocol = new Object();
protocol.PROTOCOL_PORT = 7305;
protocol.PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";


//--------------UDP socket-----------------------
//we use a standard Node.js module to work with UDP
var dgram = require('dgram');

//create datagram socket. We will use it to send our UDP dtatagrams
var socket = dgram.createSocket('udp4');



//--------------UUID generation-----------------------
//we use a Node.js module to generate a UUID compliant with RFC4122 (npm install uuid --save)
const uuidv1 = require('uuid/v1');
var uuidMus = uuidv1();


//------------------Assign musician------------------

var musiciansAndSounds = new Map();
musiciansAndSounds.set("piano", "ti-ta-ti");
musiciansAndSounds.set("trumpet", "pouet");
musiciansAndSounds.set("flute", "trulu");
musiciansAndSounds.set("violin", "gzi-gzi");
musiciansAndSounds.set("drum", "boum-boum");

var typeMusician = process.argv[2]; //Get the name of the musician type (first arg => 2)


//---------------Sending periodicaly payload-------------
var intervalID = setInterval(function(){

	var res = new Object();
	res.uuidMus = uuidMus;
	res.sound = musiciansAndSounds.get(typeMusician);

	var payload = JSON.stringify(res);

	//--------------Sending Paylod-----------------------
	//Send the payload via UDP (multicast)
	message = new Buffer(payload);
	socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, 
		function(err, bytes){
			console.log("Sending payload: " + payload + " via port " + socket.address().port);
		});
	
}, 1000);
	
	
	
