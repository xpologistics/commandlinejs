var _   = require('underscore');
var xstr = require('xpo-stringjs');

module.exports = wrapper();

function wrapper() {
    var managedConfig = null;
    var argv          = require('minimist')(process.argv.slice(2));

    function CommandLine(config) {
        managedConfig = config;
    }

    CommandLine.prototype.parseCommandLine = function () {
        var that = this;

        if (argv.help) {
            this.displayHelp();
            return false;
        }

        Object.keys(argv).forEach(function (key) {
            if (key == '_') return;

            var value = argv[key];
            if (!that.applyConfigSetting(key, value))
                console.log('Ignoring unrecognized command %s', key);
        });

        return true;
    };

    CommandLine.prototype.getCommandForHelp = function(command) {
        if (!_.isArray(command)) command = [command];

        var helpText = '';
        command.forEach(function (c) {
            if (c.length > 1)
                helpText += '--';
            else
                helpText += '-';

            helpText += c + ' '
        });

        return helpText;
    };

    CommandLine.prototype.displayHelp = function () {
        //    console.log('XRT Explorer test utility');
        //    console.log('Usage: ');

        var that = this;
        var subcommandPadding = 5;

        var maxLength = 0;
        var commandText = {};

        // get commands and sub values (for objects)
        Object.keys(managedConfig).forEach(function (c) {
            var item = managedConfig[c];

            // commands
            var text = that.getCommandForHelp(item.command);
            if (text.length > maxLength) maxLength = text.length;
            commandText[c] = {command: text, name: item.name};

            // sub values for command
            var subCommands = [];
            if (!_.isArray(item.value) && _.isObject(item.value)) {
                Object.keys(item.value).forEach(function (sc) {
                    if ((sc.length + subcommandPadding) > maxLength)
                        maxLength = sc.length + subcommandPadding;
                    subCommands.push({command: sc, name: item.value[sc].description});
                });
            }
            commandText[c].subCommands = subCommands;
        });

        Object.keys(commandText).forEach(function (key) {
            var item = commandText[key];
            if (item.subCommands.length)
                item.command += 'subcommand:value';

            var defaultText = !_.isArray(managedConfig[key].value) && !_.isObject(managedConfig[key].value)
                ? ' (default: ' + (managedConfig[key].value || 'none') + ')'
                : '';

            console.log('  ' + xstr.padRight(item.command, maxLength + 10) + item.name + defaultText);

            item.subCommands.forEach(function (sc) {
                console.log('     ' + xstr.padRight(sc.command, maxLength + 7) + sc.name);
            });
        });

    };


    CommandLine.prototype.applyConfigSetting = function(name, value) {
        var that = this;

        for (var key in managedConfig) {
            if (!managedConfig.hasOwnProperty(key)) continue;

            var configSection = managedConfig[key];
            var command = _.isArray(configSection.command) ? configSection.command : [configSection.command];

            for (var i = 0; i < command.length; i++) {
                if (command[i] == name) {
                    if (!_.isArray(value)) value = [value];
                    value.forEach(function (v) {
                        if (!that.setConfigValue(configSection, v))
                            console.log('invalid value %s for %s', v, name);
                    });

                    return true; // command was found
                }
            }
        }

        return false;
    };

    CommandLine.prototype.setConfigValue = function(configSection, newValue) {
        if (_.isArray(configSection.value))
            configSection.value.push(newValue);
        if (_.isObject(configSection.value)) {
            var v = parseObjectValue(newValue);
            if (!v || v.length != 2 || !configSection.value[v[0]]) return false;
            configSection.value[v[0]].value = v[1];
        } else
            configSection.value = newValue;

        return true;
    };

    function parseObjectValue(value) {
        if (!~value.indexOf(':')) return false;

        return value.split(':');
    }

    return CommandLine;
}