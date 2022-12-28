'use strict';

const { test, expect } = require('@playwright/test');
const url = '/test/scenarios/basic.html';
const url2 = '/test/scenarios/copy.html';
const url3 = '/test/scenarios/mirror.html';
const url4 = '/test/scenarios/double-column.html';
const url5 = '/test/scenarios/empty.html';

test.describe('drag event gets emitted when clicking an item', () => {
  testCase('works for left/wheel clicks', {}, {}, true);
  testCase('works when clicking buttons by default', {}, {tag: 'button'}, true);
  testCase('works when clicking anchors by default', {}, {tag: 'a'}, true);
  testCase('fails for right clicks', {rightClick: true}, {}, false);
  testCase('fails for meta-clicks', {metaKey: true}, {}, false);
  testCase('fails for ctrl-clicks', {ctrlKey: true}, {}, false);
  testCase('fails when clicking containers', {}, {containerClick: true}, false);
  testCase('fails whenever invalid returns true', {}, {invalid: true}, false);
  testCase('fails whenever moves returns false', {}, {moves: true}, false);

  function testCase(desc, eventOptions, options, passes) {
    test(desc, async ({page}) => {
      await page.goto(url5);

      await page.evaluate(async ([o]) => {
        const div = document.createElement('div');
        div.id = 'container';
        div.style.border = "10px solid #0000FF";

        const item = document.createElement(o.tag || 'div');
        item.id = 'item';
        item.style.border = "10px solid #FF0000";
        item.padding = "10px";

        initDragula([div], o)
        div.appendChild(item);
        document.body.appendChild(div);
      }, [options]);

      let dragPromise;

      if (passes) {
        dragPromise = page.evaluate(() => {
          return new Promise(f => {
            drake.on('drag', (item, container) => {
              f([
                item === document.getElementById('item'),
                container === document.getElementById('container'),
              ])
            });
          })
        });
      }

      let y;

      if (options.containerClick) {
        y = 150
      } else {
        y = 110
      }

      await page.mouse.move(30, y);

      if (eventOptions.ctrlKey) {
        await page.keyboard.down('Control')
      }

      if (eventOptions.metaKey) {
        await page.keyboard.down('Meta')
      }

      await page.mouse.down({button: eventOptions.rightClick === true ? 'right' : 'left'});
      await page.mouse.move(30, y+100);

      if (eventOptions.ctrlKey) {
        await page.keyboard.up('Control')
      }

      if (eventOptions.metaKey) {
        await page.keyboard.up('Meta')
      }

      if (passes) {
        const dragResult = await dragPromise;
        await expect(dragResult[0], 'first argument is selected item').toEqual(true);
        await expect(dragResult[1], 'second argument is container').toEqual(true);
      }

      const draggingState = await page.evaluate(() => drake.dragging);
      expect(draggingState, 'final state is: drake is ' + (passes ? '' : 'not ') + 'dragging').toEqual(passes);
    });
  }
});

test('when already dragging, mousedown/mousemove ends (cancels) previous drag', async ({page}) => {
  await page.goto(url);
  await page.evaluate(async () => {
    drake.start(document.getElementById('item1'));
  });

  // Once we've set up our initial item - add some listeners for the tests. It's especially important the drag listener
  // is only registered after the start command above is run.
  const dragendPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('dragend', (item) => {
        f(item === document.getElementById('item1'))
      });
    })
  });
  const dragCancelPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('cancel', (item, source) => {
        f([
          item === document.getElementById('item1'),
          source === document.getElementById('container')
        ])
      });
    })
  });
  const dragPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('drag', (item, container) => {
        f([
          item === document.getElementById('item2'),
          container === document.getElementById('container')
        ])
      });
    })
  });

  // Drag the second item down.
  await page.mouse.move(300, 150);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(300, 200);

  // Validate final state
  const dragResult = await dragPromise;
  await expect(dragResult[0], 'first argument is selected item').toEqual(true);
  await expect(dragResult[1], 'second argument is container').toEqual(true);
  await expect(await dragendPromise, 'dragend invoked with correct item').toEqual(true);
  const cancelResult = await dragCancelPromise;
  await expect(cancelResult[0], 'cancel invoked with correct item').toEqual(true);
  await expect(cancelResult[1], 'cancel invoked with correct source').toEqual(true);
  const list = page.locator('#container > div');
  await expect(list).toHaveCount(3);
  const draggingState = await page.evaluate(() => drake.dragging);
  expect(draggingState).toEqual(true);
});

test('when already dragged, ends (drops) previous drag', async ({page}) => {
  await page.goto(url4);

  await page.evaluate(async () => {
    drake.start(document.getElementById('item1'));
  });

  await page.evaluate(async () => {
    document.getElementById('container2').appendChild(document.getElementById('item1'));
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
      drake.on('drop', (item, target, source) => {
        f([
          item === document.getElementById('item1'),
          target === document.getElementById('container2'),
          source === document.getElementById('container1'),
        ])
      });
    })
  });
  const dragPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('drag', (item, container) => {
        f([
          item === document.getElementById('item2'),
          container === document.getElementById('container1')
        ])
      });
    })
  });

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(850, 100);

  const draggingState = await page.evaluate(() => drake.dragging);
  expect(draggingState).toEqual(true);

  const dragResult = await dragPromise;
  await expect(dragResult[0], 'first argument is selected item').toEqual(true);
  await expect(dragResult[1], 'second argument is container').toEqual(true);
  await expect(await dragendPromise, 'dragend invoked with correct item').toEqual(true);
  const dropResult = await dropPromise;
  await expect(dropResult[0], 'drop invoked with correct item').toEqual(true);
  await expect(dropResult[1], 'drop invoked with correct source').toEqual(true);
  await expect(dropResult[2], 'drop invoked with correct target').toEqual(true);
});

test('when copying, emits cloned with the copy', async ({page}) => {
  await page.goto(url2);

  await page.evaluate(async () => {
    drake.start(document.querySelector('.copyable'));
  });
  const clonedPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('cloned', (mirror, target, type) => {
        const subItem = document.querySelector('.copyable');
        f([
          subItem !== mirror,
          mirror.tagName === subItem.tagName,
          mirror.innerHTML === subItem.innerHTML,
          mirror.nodeType === subItem.nodeType,
          target === subItem,
          type === 'copy',
        ])
      });
    });
  });
  const dragPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('drag', (item, container) => {
        const subItem = document.querySelector('.copyable');

        f([
          item === subItem,
          container === document.getElementById('container')
        ])
      });
    })
  });

  await page.mouse.move(180, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(180, 102);

  const clonedResult = await clonedPromise;
  await expect(clonedResult[0], 'first argument is not exactly the target').toEqual(true);
  await expect(clonedResult[1], 'first argument has same tag as target').toEqual(true);
  await expect(clonedResult[2], 'first argument has same inner html as target').toEqual(true);
  await expect(clonedResult[3], 'first argument has same node type as target').toEqual(true);
  await expect(clonedResult[4], 'second argument is clicked item').toEqual(true);
  await expect(clonedResult[5], 'type is copy').toEqual(true);

  const dragResult = await dragPromise;
  await expect(dragResult[0], 'first argument is selected item').toEqual(true);
  await expect(dragResult[1], 'second argument is container').toEqual(true);

  const draggingState = await page.evaluate(() => drake.dragging);
  expect(draggingState).toEqual(true);
});

test('when dragging, element gets gu-transit class', async ({page}) => {
  await page.goto(url);

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(300, 102);

  // TODO: We'd prefer to search for item1 having the class gu-transit - but currently have multiple id's on the page
  //       we should fix this in the future.
  await expect(page.locator('.gu-transit')).toHaveId('item1')
});

test('when dragging, body gets gu-unselectable class', async ({page}) => {
  await page.goto(url);

  // Drag the second item down.
  await page.mouse.move(300, 150);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(300, 200);

  const locator = page.locator('body');
  await expect(locator).toHaveClass(['gu-unselectable']);
});

test('when dragging, element gets a mirror image for show', async ({page}) => {
  await page.goto(url);

  const clonedPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('cloned', (mirror, target) => {
        f([
          document.getElementById('item1').className === 'gu-transit',
          mirror.className === 'gu-mirror',
          mirror.innerHTML === document.getElementById('item1').innerHTML,
          target === document.getElementById('item1'),
        ])
      });
    })
  });

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(300, 102);

  const clonedResult = await clonedPromise;
  await expect(clonedResult[0], 'item does not have gu-mirror class').toEqual(true);
  await expect(clonedResult[1], 'mirror only has gu-mirror class').toEqual(true);
  await expect(clonedResult[2], 'mirror is passed to \'cloned\' event').toEqual(true);
  await expect(clonedResult[3], 'cloned lets you know that the mirror is a clone of the dragged item').toEqual(true);
});

test('when dragging, mirror element gets appended to configured mirrorContainer', async ({page}) => {
  await page.goto(url3);

  const clonedPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('cloned', (mirror, target) => {
        f(mirror.parentNode === document.getElementById('mirrorContainer'))
      });
    })
  });

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(300, 102);

  await expect(await clonedPromise, 'mirrors parent is the configured mirrorContainer').toEqual(true);
});

test('when dragging stops, element gets gu-transit class removed', async ({page}) => {
  await page.goto(url);

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(300, 102);

  // TODO: We'd prefer to search for item1 having the class gu-transit - but currently have multiple id's on the page
  //       we should fix this in the future.
  await expect(page.locator('.gu-transit')).toHaveId('item1')

  await page.evaluate(async () => {
    drake.end();
  });

  await expect(page.locator('#item1')).toHaveClass('')
});

test('when dragging stops, body becomes selectable again', async ({page}) => {
  await page.goto(url);

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(300, 102);

  await expect(page.locator('body')).toHaveClass('gu-unselectable')

  await page.evaluate(async () => {
    drake.end();
  });

  await expect(page.locator('body')).toHaveClass('')
});

test('when drag begins, check for copy option', async ({page}) => {
  await page.goto(url2);
  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(0, 2);
  // Second time to ensure copy condition is only asserted once
  await page.mouse.move(0, 4);

  await page.evaluate(async () => {
    drake.end();
  });

  const checked = page.evaluate(() => {
    return new Promise(f => f(timesChecked))
  });
  await expect(await checked, 'check only evaluated once').toEqual(1);

  const firstTest = page.evaluate(() => {
    return new Promise(f => f(check1Test))
  });
  await expect(await firstTest, 'dragged element classname is copyable').toEqual(true);

  const secondTest = page.evaluate(() => {
    return new Promise(f => f(check2Test))
  });
  await expect(await secondTest, 'source container classname is contains').toEqual(true);
});

test('mousedown emits "drag" for items', async ({page}) => {
  await page.goto(url);

  const dragPromise = page.evaluate(() => {
    return new Promise(f => {
      drake.on('drag', (item, container) => {
        f([
          item === document.getElementById('item1'),
          container === document.getElementById('container')
        ])
      });
    })
  });

  await page.mouse.move(300, 100);
  await page.mouse.down({button: 'left'});
  await page.mouse.move(300, 102);

  const dragResult = await dragPromise;
  await expect(dragResult[0], 'item is a reference to moving target').toEqual(true);
  await expect(dragResult[1], 'container matches expected div').toEqual(true);
});
