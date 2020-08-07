"use strict"

const { match, wrapArray } = require("./utils");

const debug = require("debug")("vfile-message-control")
const chalk = require("chalk")
const rule = require("unified-lint-rule")

module.exports = rule("vfile-message-control", ignoreMessages)

const info_deny = chalk.red("deny ")
const info_allow = chalk.green("allow")
const info_none = chalk.gray("none ")
const info_filename = '            %s --> %s'
const info_rule = `Rule: %s ${chalk.yellow('%s')}`


function ignoreMessages(ast, file, options) {

  if (!options || !options.deny) {
    return
  }

  const optionName = options.optionName //|| "id"
  const stripPathPrefix = options.stripPathPrefix || []

  file.messages = file.messages.filter((message) => {

    message.id = name(message, optionName, stripPathPrefix)

    const removeMessage = checkRemove(message)
    return !removeMessage
  })


  function checkRemove(message) {


    for (const option of wrapArray(options.deny)) {
      if (match(option, message)) {

        debug(info_rule, info_deny, option)

        if (options.allow) {
          for (const option of wrapArray(options.allow)) {
            if (match(option, message)) {
              debug(info_rule, info_allow, option)
              debug(info_filename, message.id, info_allow)
              return false
            }
          }
        }
        debug(info_filename, message.id, info_deny)
        return true
      }
    }
    debug(info_rule, info_none, "no matching rules")
    debug(info_filename, message.id, info_allow)
    return false
  }

  function name(message, optionName, stripPathPrefix) {
    let name = message.name
    stripPathPrefix.forEach((v) => {
      if (name.startsWith(v)) {
        name = name.substring(v.length)
      }
    })
    const option = (optionName && message[optionName]) ? (":" + message[optionName]) : ""
    return `${name}:${message.source}:${message.ruleId}${option}`
  }
}
