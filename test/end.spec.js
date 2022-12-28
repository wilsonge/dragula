'use strict';

const { test, expect } = require('@playwright/test');
const url = '/test/scenarios/basic.html';
const url2 = '/test/scenarios/double-column.html';

test.describe('end does not throw when not dragging', () => {
  test('a single time', async ({page}) => {
    await page.goto(url);

    await page.evaluate(async () => {
      drake.end();
    });
  });
  test('multiple times', async ({page}) => {
    await page.goto(url);

    await page.evaluate(async () => {
      drake.end();
      drake.end();
      drake.end();
      drake.end();
    });
  });
});

test('when already dragging, .end() ends (cancels) previous drag', async ({page}) => {
  await page.goto(url);

  await page.evaluate(async () => {
    drake.start(document.getElementById('item1'));
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
      drake.on('cancel', (item, source) => {
        f([
          item === document.getElementById('item1'),
          source === document.getElementById('container'),
        ])
      });
    })
  });

  await page.evaluate(async () => {
    drake.end();
  });

  const cancelResult = await cancelPromise;
  await expect(cancelResult[0], 'cancel invoked with correct item').toEqual(true);
  await expect(cancelResult[1], 'cancel invoked with correct source').toEqual(true);

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'dragend invoked with correct item').toEqual(true);

  const draggingState = await page.evaluate(() => drake.dragging);
  expect(draggingState, 'final state is: drake is not dragging').toEqual(false);
});

test('when already dragged, ends (drops) previous drag', async ({page}) => {
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
    drake.end();
  });

  const dropResult = await dropPromise;
  await expect(dropResult[0], 'drop was invoked with item').toEqual(true);
  await expect(dropResult[1], 'drop was invoked with final container').toEqual(true);
  await expect(dropResult[2], 'drop was invoked with source container').toEqual(true);

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'dragend invoked with correct item').toEqual(true);

  const draggingState = await page.evaluate(() => drake.dragging);
  expect(draggingState, 'final state is: drake is not dragging').toEqual(false);
});

test('.end() emits "cancel" when not moved', async ({page}) => {
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
      drake.on('cancel', (item, source) => {
        f([
          item === document.getElementById('item1'),
          source === document.getElementById('container'),
        ])
      });
    })
  });

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(300, 102);

  await page.evaluate(async () => {
    drake.end();
  });

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'dragend invoked with correct item').toEqual(true);

  const cancelResult = await cancelPromise;
  await expect(cancelResult[0], 'cancel invoked with correct item').toEqual(true);
  await expect(cancelResult[1], 'cancel invoked with correct source').toEqual(true);
});

test('.end() emits "drop" when moved', async ({page}) => {
  await page.goto(url2);

  const dragendPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('dragend', (item) => {
        console.log('dragend');
        f(item === document.getElementById('item1'))
      });
    })
  });

  const dropPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('drop', (target, parent, source) => {
        console.log('drop');
        f([
          target === document.getElementById('item1'),
          parent === document.getElementById('container2'),
          source === document.getElementById('container1'),
        ])
      });
    })
  });

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(800, 100);

  await page.evaluate(async () => {
    drake.end();
  });

  const dropResult = await dropPromise;
  await expect(dropResult[0], 'item is a reference to moving target').toEqual(true);
  await expect(dropResult[1], 'target matches expected div').toEqual(true);
  await expect(dropResult[2], 'container matches expected div').toEqual(true);

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'item is a reference to moving target').toEqual(true);
});
