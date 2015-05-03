var memo = (function () {
    'use strict';

    var fs = require('fs'),
        path = require('path'),
        messanger = require('../messanger'),
        dataFile = path.join(__dirname, '..', 'data', 'memo.json'),
        dataJSON;

    function run(data) {
        dataJSON.forEach(function (item) {
            if (data.channel === item.channel && data.nick === item.to) {
                messanger.send(data.channel, item.to + ' <' + item.from + '>: ' + item.message);
                item.read = true;
            }
        });

        dataJSON = dataJSON.filter(function (item) {
            return !item.read;
        });

        fs.writeFileSync(dataFile, JSON.stringify(dataJSON, null, '  '), 'utf8');
    }

    function updateData() {
        var text = fs.readFileSync(dataFile, {encoding: 'utf8'});
        dataJSON = JSON.parse(text);
    }

    updateData();

    return {
        run: run,
        updateData: updateData
    };

}());

module.exports = memo;
