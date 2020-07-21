# vfile-message-control

remark-lint plugin to filter messages from other linters.

it uses https://github.com/isaacs/minimatch.

## `id`

the id is calculated from the filename and rule name and the location of the message and optional an parameter defined by `optionName`

## Options

### Option `deny`

an array of minimatch globs to remove messages  

### Option `allow`

an array of minimatch globs to keep messages (evaluated after deny)  

### Option `stripPathPrefix`

an array remove from the start of the calculated id  

### Option `optionName`

an string for an option appended to the id    

## Examples

Example configuration:

```javascript
  [
    "vfile-message-control",
    {
      "deny":[
        // "docs/blog/100days/accessibility/index.md:27:23-27:29:remark-lint:prohibited-strings:eslint-case",
        // "docs/docs/making-your-site-accessible.md:*:*",
        // "**/index.md:*",
        // "**/*.*:*:TypeScript",
        // "**/*.*:*",
        // "**/*.*:*11:97*:*",

        //AskGatsbyJS

        // "docs/blog/100days/accessibility/index.md:35:127-35:135:remark-lint:prohibited-strings:gatsby-js",

        // TypeScript
        "docs/blog/2019-02-14-behind-the-scenes-q-and-a/index.md:36:89-36:99:remark-lint:prohibited-strings:TypeScript",
        "docs/blog/2020-01-23-why-typescript-chose-gatsby/index.md:6:9-6:19:remark-lint:prohibited-strings:TypeScript",

        //ESLint
        "docs/docs/making-your-site-accessible.md:38:111-38:117:remark-lint:prohibited-strings:eslint-case",
        "docs/docs/making-your-site-accessible.md:36:18-36:24:remark-lint:prohibited-strings:eslint-case",
        "docs/docs/glossary.md:209:252-209:258:remark-lint:prohibited-strings:eslint-case",

      ]
        // .concat(excludeExamples)
      ,
      "allow":[
        "docs/docs/creating-a-source-plugin.md:*",
        "docs/docs/creating-a-transformer-plugin.md:*",
        // "docs/blog/gatsbygram-case-study/index.md:*",
        // "docs/contributing/index.md:*",
        // "**/*.*:*:gatsby-js",
        // "**/*.*:*:Markdown",
      ],
      "stripPathPrefix":['../gatsby/'],
      "debug": true,
      // "optionName": "id"
    }
  ]

```
