var dispatcher = (function () {
	'use strict';

	var cluster = require('cluster'),
        messageHandler,
        workers = {};


    function getMessageJSON(nick, host, channel, message) {
        var json = {
            nick: nick,
            host: host,
            channel: channel,
            message: message
        };

        return JSON.stringify(json);
    }


    function handle(nick, host, channel, message){
        var worker,
            data,
            exitCallback;

        data = getMessageJSON(nick, host, channel, message);

        if (workers[channel]) {
            console.log('Worker exists for ', channel);
            workers[channel].send(data);
        } else {
            console.log('Spawning worker for ', channel);

            exitCallback = function () {
                delete workers[channel];
                console.log('Removed worker for channel ', channel);
            };

            worker = cluster.fork();
            worker.on('message', function (msg) {
                messageHandler(msg);
            });
            worker.on('exit', exitCallback);
            worker.on('disconnect', exitCallback);

            workers[channel] = worker;
            worker.send(data);
        }
    }

    function init() {
		cluster.setupMaster({
			exec: 'worker.js'
		});
    }

    function onMessage (handler) {
        messageHandler = handler;
    }

    return {
        handle: handle,
        init: init,
        onMessage: onMessage
    };
}());

module.exports = dispatcher;
