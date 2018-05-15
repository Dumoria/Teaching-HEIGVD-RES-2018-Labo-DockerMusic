//--------------Other----------------------
//Musicians array
var musicians = new Array();

//Moment
var moment = require('moment');
moment().format();

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


//---------------UDP receiver------------------
socketUDP.on('message', function(msg, source){
	
	var nbMus = musicians.length;
	var found = false;
	var dataRcv = JSON.parse(msg);
	
	for(var i = 0; i < nbMus; ++i){
		if(dataRcv.uuid == musicians[i].uuid){
			found = true;
			musicians[i].activeSince = moment();
		}
	}
	
	if(!found){
		var musician = new Object();
	
		musician.uuid = dataRcv.uuid;
		switch(dataRcv.sound){
			case "ti-ta-ti":
				musician.instrument = "piano";
				break;
			case "trulu":
				musician.instrument = "flute";
				break;
			case "pouet":
				musician.instrument = "trumpet";
				break;
			case "gzi-gzi":
				musician.instrument = "violin";
				break;
			case "boum-boum":
				musician.instrument = "drum";
				break;
		}
		musician.activeSince = moment();
		
		musicians[nbMus] = musician;
	}
	
});


//---------------TCP server----------------------
var protocolTCP = new Object();
protocolTCP.ADDRESS = "0.0.0.0";
protocolTCP.PORT = 2205;

//we use a standard Node.js module to work with TCP
var net = require('net');

var server = net.createServer(function(socketTCP) {
	//Clean at connexion
	var nbMus = musicians.length;
	
	for(var i = 0; i < nbMus; ++i){
		if(moment().diff(musicians[i].activeSince) >= 5000){
			musicians.splice(i--, 1);
			nbMus--;
		}
	}
	
	//Send at connexion
	var payload = JSON.stringify(musicians);
	socketTCP.write(payload);
	socketTCP.pipe(socketTCP);
	socketTCP.end();
	
});

server.listen(protocolTCP.PORT, protocolTCP.ADDRESS);

/*
//------------TCP client-------------------
var net = require('net');

var client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
*/
