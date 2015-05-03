var info = (function () {
    'use strict';

    var messanger = require('../messanger');

    function run(data) {
        messanger.send(data.channel, 'KoZe bot v0.1 by Artur Siery');
    }

    function help() {
        return 'prints bot info';
    }

    return {
        run: run,
        help: help
    };
}());

module.exports = info;
