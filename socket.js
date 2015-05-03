var socket = (function () {
	'use strict';

	var net = require('net'),
		connection = {};

	function connect(obj, callback) {
		connection = net.connect({
				port: obj.port,
				host: obj.host
			}, function () {
				console.log('connected');
				setTimeout( function () {
					send('USER ' + obj.nick + ' localhost localhost :' + obj.nick);
					send('NICK ' + obj.nick);
				}, 100);
			});

		connection.on('data', function (data) {
			console.log('>>> ' + data.toString());
			callback(data);
		});
	}

	function send(msg) {
		connection.write(msg + '\n');
		console.log('<<< ' + msg);
	}

	return {
		connect: connect,
		send: send
	};

}());

module.exports = socket;
