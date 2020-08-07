"use strict"

const minimatch = require("minimatch")

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

  if (!isRegExp(regex)) {
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


function match(option, message) {

  // Type 1: option := string
  // Type 2: option := [string]
  // Type 3: option := [string, string]
  // Type 4: option := [string, regexp]
  // Type 5: option := [string, function]

  const [idMatch, testMatch] = wrapArray(option)

  const matchedId = minimatch(message.id, idMatch, {nocase: true, debug: false})

  if (matchedId && testMatch) {
    return getTest(testMatch)(message)
  } else {
    return matchedId
  }
}

module.exports = { match, wrapArray }