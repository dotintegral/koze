(function () {
    'use strict';

    var cluster = require('cluster'),
        fs = require('fs'),
        path = require('path'),
        config = require('./config.json'),
        messanger = require('./messanger'),
        actionDir = path.join(__dirname, 'action'),
        actions = {};

    function onMessage(data) {
        var commandData = detectCommand(data);

        if (commandData) {
            runCommand(data, commandData);
        } else {
            runActions(data);
        }
    }

    function runActions(data) {
        if (Object.keys(actions).length === 0) {
            loadActions();
        }

        Object.keys(actions).forEach(function (key) {
            actions[key].run(data);
        });
    }

    function loadActions() {
        fs.readdirSync(actionDir)
            .forEach(function(file) {
                if (file.match(/\.js$/) !== null) {
                    var actionFile = path.join(actionDir, file),
                        action = require(actionFile),
                        name = file.replace('.js', '');

                    actions[name] = action;
                }
            });
    }

    function runCommand(data, commandData) {
        var command,
            commandArgs;

        try {
            command = require('./command/' + commandData[1]);
            commandArgs = commandData[2] ? commandData[2].split(' ') : null;

            command.run(data, commandArgs);

        } catch (e) {
            console.error(e);
            messanger.send(data.channel, 'No command ' + commandData[1] + ' available');
        }
    }

    function detectCommand(data) {
        var pattern = new RegExp('^' + config.commandPrefix + '(\\w+)\\s*(.*)$', 'm'),
            match = pattern.exec(data.message);

        if (match) {
            return match;
        }

        return false;
    }

    function reload() {
        process.exit(0);
    }

    if (cluster.isWorker) {
        fs.watch(__filename, reload);
        fs.watch(path.join(__dirname, 'command'), reload);
        fs.watch(path.join(__dirname, 'action'), reload);

        process.on('message', function (data) {
            data = JSON.parse(data);

            onMessage(data);
        });
    }

}());
