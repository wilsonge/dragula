'use strict';

const { test, expect } = require('@playwright/test');
const url = '/test/scenarios/basic.html';
const url2 = '/test/scenarios/double-column.html';

test.describe('cancel does not throw when not dragging', () => {
  test('a single time', async ({page}) => {
    await page.goto(url);
    await page.evaluate(async () => {
      drake.cancel();
    });
  });

  test('multiple times', async ({page}) => {
    await page.goto(url);
    await page.evaluate(async () => {
      drake.cancel();
      drake.cancel();
      drake.cancel();
      drake.cancel();
    });
  });
});

test('when dragging and cancel gets called, nothing happens', async ({page}) => {
  await page.goto(url);
  await page.evaluate(async () => {
    drake.start(document.getElementById('item1'));
    drake.cancel();
  });

  const list = page.locator('#container > div');
  await expect(list).toHaveCount(3);
});

test('when dragging a copy and cancel gets called, default does not revert', async ({page}) => {
  await page.goto(url2);

  await page.evaluate(async () => {
    const container1Element = document.getElementById('item1');
    drake.start(container1Element);
    document.getElementById('container2').appendChild(container1Element);
  });
  const dragendPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('dragend', (item) => {
        f(item === document.getElementById('item1'))
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
    drake.cancel();
  });

  const dropResult = await dropPromise;
  await expect(dropResult[0], 'drop was invoked with item').toEqual(true);
  await expect(dropResult[1], 'drop was invoked with final container').toEqual(true);
  await expect(dropResult[2], 'drop was invoked with source container').toEqual(true);

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'dragend was invoked with item').toEqual(true);
});

test('when dragging a copy and cancel gets called, revert is executed', async ({page}) => {
  await page.goto(url2);

  await page.evaluate(async () => {
    const container1Element = document.getElementById('item1');
    drake.start(container1Element);
    document.getElementById('container2').appendChild(container1Element);
  });
  const dragendPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('dragend', (item) => {
        f(item === document.getElementById('item1'))
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
    drake.cancel(true);
  });

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'dragend got called').toEqual(true);

  const cancelResult = await cancelPromise;
  await expect(cancelResult[0], 'cancel was invoked with item').toEqual(true);
  await expect(cancelResult[1], 'cancel was invoked with container').toEqual(true);
});

test('.cancel() emits "cancel" when not moved', async ({page}) => {
  await page.goto(url);

  const dragendPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('dragend', (item) => {
        f(item === document.getElementById('item1'))
      });
    })
  });
  const cancelPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('cancel', (target, container) => {
        f([
          target === document.getElementById('item1'),
          container === document.getElementById('container'),
        ])
      });
    })
  });

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(300, 102);

  await page.evaluate(async () => {
    drake.cancel();
  });

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'item is a reference to moving target').toEqual(true);

  const cancelResult = await cancelPromise;
  await expect(cancelResult[0], 'item is a reference to moving target').toEqual(true);
  await expect(cancelResult[1], 'container matches expected div').toEqual(true);
});
