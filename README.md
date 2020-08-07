## `vfile-message-control`

A `remark-lint` plugin to filter [messages](https://github.com/vfile/vfile#vfilemessages) in a [`vFile`](https://github.com/vfile/vfile) from other linters.

It uses https://github.com/isaacs/minimatch.

## `id`

This plugin filter `vFile` messages based on a calculated id. The id is calculated from the filename and rule name and the location of the message and optional an additional parameter defined by `optionName`.

Format:

```
`${name}:${source}:${ruleId}[:${message[optionName]}]`
```

Example:
```
docs/path/filename.md:179:1-179:21:remark-lint:no-multiple-toplevel-headings
```

## Options

### Option `deny`

An array of `matcher` to remove messages  

### Option `allow` (optional)

An array of `matcher` to keep messages (evaluated only after a match with `deny`)  

### Option `stripPathPrefix` (optional)

An array of string to remove from the path of the calculated id 

### Option `optionName` (optional)

A string for an option appended to the id. This can be used from plugins to add more info to a rule.

### Parameter `matcher`

Always check the `globstring` against `id` and if this matched the second parameter check with parameter `message.message`, function check with parameter `message`

- matcher := `string`
- matcher := `[string [, (string|regexp|function)]]`

A matcher can be one of these combinations:

- Type 1: `matcher` :=  `globString` 
- Type 2: `matcher` := [`globString`]
- Type 3: `matcher` := [`globString`, `regexpString`]
- Type 4: `matcher` := [`globString`, `regexp`]
- Type 5: `matcher` := [`globString`, `function`]

With these options:
- `globString` := a string minimatch glob string.
- `regexpString` := a string which would converted to a `RegExp.` Used like `new RegExp(regexpString,'i').test(message.message)`.
- `rexexp` = a `RegExp` called with parameter  `.test(message.message)`.
- `function` = a function called with parameter `message`.

## Examples

Example configuration:

```javascript
    [
      "vfile-message-control",
      {
        "deny":[
          "docs/docs/headless-cms-1.md:*:retext-repeated-words:*",
          ["docs/docs/README.md:remar-lint:retext-repeated-words:*", '^The parameter'],
        ],
        "allow": [
          "docs/docs/headless-cms-1.md:*:retext-repeated-words:graphql",
        ],
      }
    ]
```

![Screenshot](./screenshot.png)

## Logger

It uses the [`debug`](https://www.npmjs.com/package/debug) package, so you can enable the logs with

```shell
DEBUG=vfile-message-control remark
```

## Note

It not removes messages from plugins which attach to FileSet with `fileSet.use()` like `remark-validate-links`.