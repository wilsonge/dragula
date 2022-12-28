'use strict';

const { test, expect } = require('@playwright/test');
const url = '/test/scenarios/basic.html';
const url2 = '/test/scenarios/double-column.html';
const url3 = '/test/scenarios/spill-revert.html';

test.describe('destroy does not throw when not dragging, destroyed, or whatever', () => {
  test('a single time', async ({page}) => {
    await page.goto(url);
    await page.evaluate(async () => {
      drake.destroy();
    });
  });

  test('multiple times', async ({page}) => {
    await page.goto(url);
    await page.evaluate(async () => {
      drake.destroy();
      drake.destroy();
      drake.destroy();
      drake.destroy();
    });
  });
});

test('when dragging and destroy gets called, nothing happens but dragend event is emitted gracefully', async ({page}) => {
  await page.goto(url);

  await page.evaluate(async () => {
    drake.start(document.getElementById('item1'));
  });

  const dragendPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('dragend', (item) => {
        f(true)
      });
    })
  });

  await page.evaluate(async () => {
    drake.destroy();
  });

  const list = page.locator('#container > div');
  await expect(list, 'nothing happens').toHaveCount(3);
  const draggingState = await page.evaluate(() => drake.dragging);
  expect(draggingState, 'drake has stopped dragging').toEqual(false);

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'dragend got called').toEqual(true);
});

test('when dragging a copy and destroy gets called, default does not revert', async ({page}) => {
  await page.goto(url2);

  await page.evaluate(async () => {
    drake.start(document.getElementById('item1'));
    document.getElementById('container2').appendChild(document.getElementById('item1'));
  });

  const dragendPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('dragend', (item) => {
        f(true)
      });
    })
  });

  const dropPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('drop', (target, parent, source) => {
        f([
          target === document.getElementById('item1'),
          parent === document.getElementById('container2'),
          source === document.getElementById('container1'),
        ])
      });
    })
  });

  await page.evaluate(async () => {
    drake.destroy();
  });

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'dragend got called').toEqual(true);
  const dropResult = await dropPromise;
  await expect(dropResult[0], 'drop was invoked with item').toEqual(true);
  await expect(dropResult[1], 'drop was invoked with final container').toEqual(true);
  await expect(dropResult[2], 'drop was invoked with source container').toEqual(true);
});

test('when dragging a copy and destroy gets called, revert is executed', async ({page}) => {
  await page.goto(url3);

  await page.evaluate(async () => {
    drake.start(document.getElementById('item1'));
    document.getElementById('container3').appendChild(document.getElementById('item1'));
  });

  const dragendPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('dragend', (item) => {
        f(true)
      });
    })
  });

  const cancelPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('cancel', (target, container) => {
        f([
          target === document.getElementById('item1'),
          container === document.getElementById('container1'),
        ])
      });
    })
  });

  await page.evaluate(async () => {
    drake.destroy();
  });

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'dragend got called').toEqual(true);

  const cancelResult = await cancelPromise;
  await expect(cancelResult[0], 'cancel was invoked with item').toEqual(true);
  await expect(cancelResult[1], 'cancel was invoked with container').toEqual(true);
});
