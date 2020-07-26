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

function ignoreMessages(ast, file, options) {

  if (!options || !options.deny) {
    return
  }

  const optionName = options.optionName || "id"
  const stripPathPrefix = options.stripPathPrefix || []

  file.messages = file.messages.filter((message) => {
    const id = name(message, optionName, stripPathPrefix)
    const remove = checkRemove(id)
    return !remove
  })


  function checkRemove(id) {

    for (const option of options.deny) {
      if (minimatch(id, option, {nocase: true, debug: false})) {

        debug(info_rule, info_deny, option)

        if (options.allow) {
          for (const option of options.allow) {
            if (minimatch(id, option, {nocase: true, debug: false})) {
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
