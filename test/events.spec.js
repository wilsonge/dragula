'use strict';

const { test, expect } = require('@playwright/test');
const url = '/test/scenarios/basic.html';
const url2 = '/test/scenarios/copy.html';
const url3 = '/test/scenarios/spill-revert.html';

test('mousedown emits "cloned" for mirrors', async ({page}) => {
  await page.goto(url);

  const clonedPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('cloned', (mirror, target, type) => {
        const subItem = document.getElementById('item1');

        f([
          type === 'mirror',
          mirror !== subItem,
          mirror.nodeType === subItem.nodeType,
          target === subItem,
        ])
      });
    });
  });

  await page.mouse.move(180, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(180, 200);

  const clonedResult = await clonedPromise;
  await expect(clonedResult[0], 'type should be mirror').toEqual(true);
  await expect(clonedResult[1], 'mirror is not a reference to item').toEqual(true);
  await expect(clonedResult[2], 'mirror of original is provided').toEqual(true);
  await expect(clonedResult[3], 'original item is provided').toEqual(true);
});

test('mousedown emits "cloned" for copies', async ({page}) => {
  await page.goto(url2);

  const clonedPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('cloned', (copy, target, type) => {
        const subItem = document.querySelector('.copyable');

        f([
          type === 'copy',
          copy !== subItem,
          copy.nodeType === subItem.nodeType,
          target === subItem,
        ])
      });
    });
  });

  await page.mouse.move(180, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(180, 200);

  const clonedResult = await clonedPromise;
  await expect(clonedResult[0], 'type should be clone').toEqual(true);
  await expect(clonedResult[1], 'copy is not a reference to item').toEqual(true);
  await expect(clonedResult[2], 'copy of original is provided').toEqual(true);
  await expect(clonedResult[3], 'original item is provided').toEqual(true);
});

test('.cancel() emits "cancel" when reverts', async ({page}) => {
  await page.goto(url3);

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

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(850, 100);

  await page.evaluate(async () => {
    document.getElementById('container2').appendChild(document.getElementById('item1'));
    drake.cancel();
  });

  const dragendResult = await dragendPromise;
  await expect(dragendResult, 'item is a reference to moving target').toEqual(true);

  const cancelResult = await cancelPromise;
  await expect(cancelResult[0], 'cancel was invoked with item').toEqual(true);
  await expect(cancelResult[1], 'cancel was invoked with container').toEqual(true);
});
