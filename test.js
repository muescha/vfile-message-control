'use strict';

const test = require('tape');
const vfile = require('vfile');


test('vfile-message-control', (t) => {
  const path = 'fhqwhgads.md';

  {
    const contents = 'the v8 javascript engine';
    const file = vfile({ path: path, contents: contents });
    t.ok(file, 'file exists');
    // t.deepEqual(
    //   processorWithOptions([])
    //     .processSync(vfile({ path: path, contents: contents }))
    //     .messages.map(String),
    //   [],
    //   'test message are filtered'
    // );
  }

  t.end();
});
