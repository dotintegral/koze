var memo = (function () {
    'use strict';

    var fs = require('fs'),
        path = require('path'),
        messanger = require('../messanger'),
        dataFile = path.join(__dirname, '..', 'data', 'memo.json');

    function run(data, args) {
        if (!args || args.length < 2) {
            messanger.send(data.channel, 'Invalid usage, see help for memo');
            return;
        }

        var nick = args.shift(),
            message = args.join(' ');

        fs.readFile(dataFile, {encoding: 'utf8'}, function (err, text) {
            if (err) {
                messanger.send(data.channel, 'Error reading data file');
                return;
            }

            var json;

            try {
                json = JSON.parse(text);
            } catch (e) {
                messanger.send(data.channel, 'Error parsing the data file');
                return;
            }

            json.push({
                channel: data.channel,
                to: nick,
                from: data.nick,
                message: message
            });

            fs.writeFile(dataFile, JSON.stringify(json, null, '  '), function (err) {
                if (err) {
                    messanger.send(data.channel, 'Error writting to data file');
                    return;
                }

                require('../action/memo').updateData();
                messanger.send(data.channel, 'memo set');
            });

        });

    }

    function help() {
        return 'Saves memo for user. Usage: memo <nick> <message>';
    }

    return {
        run: run,
        help: help
    };
}());

module.exports = memo;
