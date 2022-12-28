'use strict';

const { test, expect } = require('@playwright/test');
const url = '/test/scenarios/basic.html';
const url2 = '/test/scenarios/copy.html';

test.describe('remove does not throw when not dragging', () => {
  test('a single time', async ({page}) => {
    await page.goto(url);
    await page.evaluate(async () => {
      drake.remove();
    });
  });

  test('multiple times', async ({page}) => {
    await page.goto(url);
    await page.evaluate(async () => {
      drake.remove();
      drake.remove();
      drake.remove();
      drake.remove();
    });
  });
});

test('when dragging and remove gets called, element is removed', async ({page}) => {
  await page.goto(url);

  await page.evaluate(async () => {
    drake.start(document.getElementById('item1'));
    drake.remove();
  });

  const childrenLength = await page.evaluate(() => document.getElementById('container').children.length);
  expect(childrenLength, 'item got removed from container').toEqual(2);

  const draggingState = await page.evaluate(() => drake.dragging);
  expect(draggingState, 'drake has stopped dragging').toEqual(false);
});

test('when dragging and remove gets called, remove event is emitted', async ({page}) => {
  await page.goto(url);

  await page.evaluate(async () => {
    window.backupItem = document.getElementById('item1');
    drake.start(window.backupItem);
  });

  const dragendPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('dragend', (item) => {
        f(
          item === window.backupItem,
        )
      });
    })
  });

  const removePromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('remove', (target, container) => {
        f([
          target === window.backupItem,
          container === document.getElementById('container'),
        ])
      });
    })
  });

  await page.evaluate(async () => {
    drake.remove();
  });

  const removeResult = await removePromise;
  await expect(removeResult[0], 'remove was invoked with item').toEqual(true);
  await expect(removeResult[1], 'remove was invoked with container').toEqual(true);

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'dragend item is a reference to moving target').toEqual(true);
});

test('when dragging a copy and remove gets called, cancel event is emitted', async ({page}) => {
  await page.goto(url2);

  await page.evaluate(async () => {
    window.backupItem = document.querySelector('.copyable');
  });

  await page.mouse.move(180, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(180, 102);

  const dragendPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('dragend', (item) => {
        f(true)
      });
    })
  });

  const cancelPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('cancel', (item, source) => {
        f([
          item.className === 'copyable gu-transit',
          item !== window.backupItem,
          item.nodeType === window.backupItem.nodeType,
          source === null,
        ])
      });
    })
  });

  await page.evaluate(async () => {
    drake.remove();
  });

  const cancelResult = await cancelPromise;
  await expect(cancelResult[0], 'cancel was invoked with item').toEqual(true);
  await expect(cancelResult[1], 'item is a copy and not the original').toEqual(true);
  await expect(cancelResult[2], 'item is a copy of item').toEqual(true);
  await expect(cancelResult[3], 'cancel was invoked with container').toEqual(true);

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'dragend got called').toEqual(true);
});
