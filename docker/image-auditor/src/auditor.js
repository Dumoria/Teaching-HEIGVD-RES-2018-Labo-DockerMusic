

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
	
	//nettoyage a l'etablissement connexion tcp
    var len = musicians.length;
	console.log(len);
    for (var i = 0; i < len; i++) {
		
        //Remove musicians if didn't hear it since 5 seconds
        if(moment().diff(musicians[i].activeSince) >= 5000){
            musicians.splice(i, 1);
			len = len - 1;
			i = i -1;//limite stocker temp indice a retirer puis une fois boucle terminee
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
			found = true;
			i = len;
		}
	}
	if(found == false){
		var musician = new Object();
		musician.uuid = dataReceived.uuidMus;
		musician.instrument = musiciansAndSounds.get(dataReceived.sound);
        musician.activeSince = moment();	
		musicians[len] = musician;
	}

    for (var i = 0; i < len; i++) {
		console.log( musicians[i].activeSince);
        console.log( musicians[i].instrument + " " + musicians[i].uuid);
    }
		
});






