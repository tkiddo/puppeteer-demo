const puppeteer = require('puppeteer');
const pois = require('./result.json');
const fs = require('fs');
const path = require('path');

async function getData(page, poi, result) {
  await page.evaluate(() => {
    document.querySelector('#localvalue').value = '';
  });

  const input = poi.area + poi.position;
  await page.type('#localvalue', input);

  await page.click('#localsearch');

  await page.waitForTimeout(1000);

  const item = await page.evaluate(() => {
    const target = document.querySelector('#no_0 > p');
    if (target) {
      const arr = target.innerText.split('：');
      return arr[arr.length - 1];
    } else {
      return '';
    }
  });

  const cords = item.split(',');

  result.push({ ...poi, coordinates: [Number(cords[0]), Number(cords[1])] });
}

module.exports = async function () {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(0);

  await page.setViewport({ width: 2000, height: 800 });

  await page.goto('http://api.map.baidu.com/lbsapi/getpoint/');

  const result = [];

  for (let i = 0, len = pois.length; i < len; i++) {
    await getData(page, pois[i], result);
  }

  await page.close();

  await browser.close();

  fs.writeFile(path.resolve(__dirname, 'cords.json'), JSON.stringify(result, null, 2), () => {});
};
