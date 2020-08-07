'use strict';

const test = require('tape');
const vfile = require('vfile');
const controlAttacher = require('.')


function geFixture() {
  const path = 'doc/path/file.md';
  const pos1 = {
    position: {
      start: {line: 1, column: 3},
      end: {line: 1, column: 5}
    }
  }
  const pos2 = {
    position: {
      start: {line: 2, column: 6},
      end: {line: 2, column: 7}
    }
  }
  const pos3 = {
    position: {
      start: {line: 3, column: 8},
      end: {line: 3, column: 9}
    }
  }
  const contents = 'the v8 javascript engine';
  const file = vfile({path: path, contents: contents});
  file.message("First message with final text", pos1, "source1:rule1")
  file.message("Second message with other text", pos2, "source1:rule2")
  file.message("Third message has no more text", pos3, "source1:rule3")
  return file
}

const noop = () => {
};

function runControl(options) {
  const file = geFixture()
  const control = controlAttacher(options)
  control({}, file, noop)
  return file;
}

test('vfile-message-control', (t) => {

  t.test("check fixture setup", (t) => {
    const file = geFixture()
    t.ok(file, 'file exists');
    t.equal(file.messages.length, 3, 'exits 3 messages')
    t.deepEqual(file.messages.map(m => m.ruleId), ['rule1', 'rule2', 'rule3'], 'rules setup')
    t.end()
  })

  t.test("should do nothing if no options", (t) => {
    const file = runControl({});

    t.deepEqual(file.messages.map(m => m.ruleId), ['rule1', 'rule2', 'rule3'], 'rules setup')

    t.end()
  })

  t.test("Type 1: option := string", (t) => {

    t.test("should delete all messages if path matches", (t) => {
      const file = runControl({
        deny: "doc/path/file.md:*"
      });
      t.deepEqual(file.messages.map(m => m.ruleId), [], 'should have no messages')
      t.end()
    })

    t.test("should delete all messages if path matches", (t) => {
      const file = runControl({
        deny: [
          "doc/path/file.md:*"
        ]
      });
      t.deepEqual(file.messages.map(m => m.ruleId), [], 'should have no messages')
      t.end()
    })

    t.test("should delete all messages if path matches and one rule", (t) => {
      const file = runControl({
        deny: [
          "doc/path/file.md:*:rule2"
        ]
      });
      t.deepEqual(file.messages.map(m => m.ruleId), ['rule1', 'rule3'], 'should have 2 messages')
      t.end()
    })

    t.test("should deny all messages and allow one rule", (t) => {
      const file = runControl({
        deny: [
          "doc/path/file.md:*"
        ],
        allow: [
          "doc/path/file.md:*:rule3"
        ]
      });
      t.deepEqual(file.messages.map(m => m.ruleId), ['rule3'], 'should have 1 messages')
      t.end()
    })

    t.end()
  })

  t.test("Type 2: option := [string]", (t) => {
    // ^Alt text should end with punctuation'
    t.end()
  })

  t.test("Type 3: option := [string, string]", (t) => {
    t.test("should match inline word", (t) => {
      const file = runControl({
        deny: [
          ["doc/path/file.md:*", "other"],
        ]
      });
      t.deepEqual(file.messages.map(m => m.ruleId), ['rule1', 'rule3'], 'should have 2 messages')
      t.end()
    })
    t.test("should match inline word", (t) => {
      const file = runControl({
        deny: [
          ["doc/path/file.md:*"],
        ],
        allow: [
          ["doc/path/file.md:*", "other"],
        ]
      });
      t.deepEqual(file.messages.map(m => m.ruleId), ['rule2'], 'should have 1 messages')
      t.end()
    })
    t.test("should not match regex", (t) => {
      const file = runControl({
        deny: [
          ["doc/path/file.md:*", "^other"],
        ]
      });
      t.deepEqual(file.messages.map(m => m.ruleId), ['rule1', 'rule2', 'rule3'], 'should have 3 messages')
      t.end()
    })
    t.test("should match regex", (t) => {
      const file = runControl({
        deny: [
          ["doc/path/file.md:*", "^Third"],
        ]
      });
      t.deepEqual(file.messages.map(m => m.ruleId), ['rule1', 'rule2'], 'should have 2 messages')
      t.end()
    })
  })

  t.test("Type 4: option := [string, regexp]", (t) => {
    t.test("should match regex", (t) => {
      const file = runControl({
        deny: [
          ["doc/path/file.md:*", /^Third/i],
        ]
      });
      t.deepEqual(file.messages.map(m => m.ruleId), ['rule1', 'rule2'], 'should have 2 messages')
      t.end()
    })

    t.end()
  })

  t.test("Type 5: option := [string, function]", (t) => {
    t.test("should match ruleid", (t) => {
      const file = runControl({
        deny: [
          ["doc/path/file.md:*", (message) => message.ruleId === 'rule2'],
        ]
      });
      t.deepEqual(file.messages.map(m => m.ruleId), ['rule1', 'rule3'], 'should have 2 messages')
      t.end()
    })
    t.test("should not in line 3", (t) => {
      const file = runControl({
        deny: [
          ["doc/path/file.md:*", (message) => message.location.start.line === 3],
        ]
      });
      t.deepEqual(file.messages.map(m => m.ruleId), ['rule1', 'rule2'], 'should have 2 messages')
      t.end()
    })

    t.end()
  })

  t.end();
});
