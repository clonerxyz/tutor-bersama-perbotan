const str_replace = require('str_replace');
const fs = require('fs')
const puppeteer = require('puppeteer')
const crawl = async (url) => {
  try {
    //console.log(`Crawling ${url}`)
    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium',args: ['--no-sandbox'],})
    const page = await browser.newPage()
    await page.goto(url)
    const selector = 'td > img'
    await page.waitForSelector(selector)
    const links = await page.$$eval(selector, am => am.filter(e => e.src).map(e => e.src))
    const result = str_replace(',', '\n\n\n', links);
    //console.log(result);
    const pageNew = await browser.newPage()
    const response = await pageNew.goto(result, {timeout: 0, waitUntil: 'networkidle0'})
    const imageBuffer = await response.buffer()
	  var name = Math.random();
    await fs.promises.writeFile('./img'+name+'.jpg', imageBuffer)
    await page.close()
    await pageNew.close()
    await browser.close()
	console.log('./img'+name+'.jpg')
  } catch (err) {
    console.log(err)
  }
}

crawl('https://1cak.com/shuffle')
