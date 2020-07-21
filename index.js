'use strict';

const chalk = require('chalk');
const rule = require('unified-lint-rule');
const minimatch = require('minimatch');

module.exports = rule('remark-lint:ignore-messages', ignoreMessages);

function ignoreMessages(ast, file, options) {

  if (!options || !options.deny) {
    return;
  }

  const optionName = options.optionName || 'id';
  const stripPathPrefix = options.stripPathPrefix || [];

  file.messages = file.messages.filter((message) => {
    const id = name(message, optionName, stripPathPrefix);
    const remove = checkRemove(id);
    return !remove;
  });

  function checkRemove(id) {
    for (const option of options.deny) {
      if (minimatch(id, option, { nocase: true, debug: false })) {
        if (options.debug) {
          console.log(id + chalk.red(' --> deny '));
          console.log(`Rule: deny ${chalk.yellow(option)}`);
        }

        if (options.allow) {
          for (const option of options.allow) {
            if (minimatch(id, option, { nocase: true, debug: false })) {
              if (options.debug) {
                console.log(id + chalk.green(' --> allow '));
                console.log(`Rule: allow ${chalk.yellow(option)}`);
              }
              return false;
            }
          }
        }
        return true;
      }
    }
    return false;
  }

  function name(message, optionName, stripPathPrefix) {
    let name = message.name;
    stripPathPrefix.forEach((v) => {
      if (name.startsWith(v)) {
        name = name.substring(v.length);
      }
    });
    const option = message[optionName] ? (':' + message[optionName]) : '';
    return `${name}:${message.source}:${message.ruleId}${option}`;
  }
}
