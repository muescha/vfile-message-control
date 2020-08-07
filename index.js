"use strict"

const debug = require("debug")("vfile-message-control")
const chalk = require("chalk")
const rule = require("unified-lint-rule")
const minimatch = require("minimatch")

module.exports = rule("vfile-message-control", ignoreMessages)

const info_deny = chalk.red("deny ")
const info_allow = chalk.green("allow")
const info_filename = '            %s --> %s'
const info_rule = `Rule: %s ${chalk.yellow('%s')}`

// Utils
const isString = test => typeof test === "string";
const isRegExp = test => test instanceof RegExp;
const isFunction = test => test instanceof Function;
const wrapArray = value => Array.isArray(value) ? value : [value]

function getRegExp(regex) {
  // special for plain strings: they are not "instanceof String"
  if (isString(regex)) {
    regex = new RegExp(regex);
  }

  if (isRegExp(regex)) {
    throw Error('Required "regex" option need to be a RegEx or RegExp-String');
  }
  return regex
}

function getTest(test) {

  if (!test) {
    return () => false
  }

  if (isFunction(test)) {
    return (message) => {
      return test(message)
    }
  }

  return (message) => {
    return getRegExp(test).test(message.message)
  }
}


function match(id, option, message) {

  // Type 1: option := string
  // Type 2: option := [string]
  // Type 3: option := [string, string]
  // Type 4: option := [string, regexp]
  // Type 5: option := [string, function]

  const [idMatch, testMatch] = wrapArray(option)

  const matchedId = minimatch(id, idMatch, {nocase: true, debug: false})

  if (matchedId && testMatch) {
    return getTest(testMatch)(message)
  } else {
    return matchedId
  }
}


function ignoreMessages(ast, file, options) {

  if (!options || !options.deny) {
    return
  }

  const optionName = options.optionName || "id"
  const stripPathPrefix = options.stripPathPrefix || []

  file.messages = file.messages.filter((message) => {

    const id = name(message, optionName, stripPathPrefix)
    message.id = id

    const removeMessage = checkRemove(id, message)
    return !removeMessage
  })


  function checkRemove(id, message) {


    for (const option of options.deny) {
      if (match(id, option, message)) {

        debug(info_rule, info_deny, option)

        if (options.allow) {
          for (const option of options.allow) {
            if (match(id, option, message)) {
              debug(info_rule, info_allow, option)
              debug(info_filename, id, info_allow)
              return false
            }
          }
        }
        debug(info_filename, id, info_deny)
        return true
      }
    }
    return false
  }

  function name(message, optionName, stripPathPrefix) {
    let name = message.name
    stripPathPrefix.forEach((v) => {
      if (name.startsWith(v)) {
        name = name.substring(v.length)
      }
    })
    const option = message[optionName] ? (":" + message[optionName]) : ""
    return `${name}:${message.source}:${message.ruleId}${option}`
  }
}
