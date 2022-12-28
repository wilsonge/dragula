'use strict';

const { test, expect } = require('@playwright/test');
const url = '/test/scenarios/empty.html';
const url2 = '/test/scenarios/empty-v2.html';

test('drake defaults to no containers', async ({page}) => {
  await page.goto(url);
  await page.evaluate(async () => { initDragula() });

  const containersList = await page.evaluate(() => drake.containers);
  expect(containersList, 'drake.containers is an empty array').toEqual([]);
});

test('drake reads containers from array argument', async ({page}) => {
  await page.goto(url);
  await page.evaluate(async () => {
    const el = document.createElement('div');
    const containers = [el];
    initDragula(containers);
  });

  const containersList = await page.evaluate(() => drake.containers);
  expect(containersList, 'drake.containers has one item').toHaveLength(1);
});

test('drake reads containers from array in options', async ({page}) => {
  await page.goto(url2);
  await page.evaluate(async () => {
    const el = document.createElement('div');
    const containers = [el];
    initDragula({ containers: containers });
  });

  const containersList = await page.evaluate(() => drake.containers);
  expect(containersList, 'drake.containers has one item').toHaveLength(1);
});

test('containers in options take precedent', async ({page}) => {
  await page.goto(url);
  await page.evaluate(async () => {
    const el = document.createElement('div');
    const containers = [el];
    initDragula([], {containers: containers});
  });

  const containersList = await page.evaluate(() => drake.containers);
  expect(containersList, 'drake.containers has one item').toHaveLength(1);
});
