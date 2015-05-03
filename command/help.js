var help = (function () {
    'use strict';

    var fs = require('fs'),
        messanger = require('../messanger');

    function run(data, args) {
        if (args && args.length > 0) {

            if (args[0] === 'help') {
                messanger.send(data.channel, help());
                return;
            }

            try {
                var command = require('./' + args[0]);
                messanger.send(data.channel, command.help());
            } catch (e) {
                messanger.send(data.channel, 'command ' + args[0] + ' does not exists');
            }


        } else {
            fs.readdir(__dirname, function (err, contents) {
                if (err) {
                    console.error(err);
                }

                var commands = contents.map(function (item) {
                    return ',' + item.split('.')[0];
                });

                messanger.send(data.channel, 'available commands: ' + commands.join(' '));
            });

        }
    }

    function help() {
        return 'Prints help. Usage: ,help - all available commands; ,help <command> - help for given command';
    }

    return {
        run: run,
        help: help
    };
}());

module.exports = help;
