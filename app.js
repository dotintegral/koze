var client = (function () {
	'use strict';

	var socket = require('./socket'),
		dispatcher = require('./dispatcher'),
		connection = {},
		connParams = {},
		privMsgPattern = /^:(.*?)!(.*?)\sPRIVMSG\s(.*?)\s:(.*?)$/m;

	function autojoin() {
		connection.send('JOIN ' + connParams.autojoin.join(','));
	}

	function onPrivMsg(match) {
		if (!match) {
			return;
		}

		var nick = match[1],
			host = match[2],
			channel = match[3],
			message = match[4];

		dispatcher.handle(nick, host, channel, message);
	}

	function onData(data) {
		var input = data.toString(),
			match;

		if (/^PING/.test(input)) {
			connection.send('PONG :' + input.split(':')[1]);
		} else if (/MOTD/.test(input)) {
			autojoin();
		} else {
			match = privMsgPattern.exec(input);
			onPrivMsg(match);
		}
	}

	function init(params) {
		connParams = params;
		connection = socket;
		connection.connect(connParams, onData);

		dispatcher.init();
		dispatcher.onMessage(function (msg) {
			connection.send(msg);
		});
	}

	return {
		init: init
	};
}());

var params = require('./config.json');

client.init(params);
