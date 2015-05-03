var messanger = (function () {
    'use strict';

    function send(channel, message) {
        process.send('PRIVMSG ' + channel + ' :' + message);
    }

    return {
        send: send
    };

}());

module.exports = messanger;
