//const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium',args: ['--no-sandbox'],})
//const page = await browser.newPage()
//const prettier = require("prettier")
const str_replace = require('str_replace');
const puppeteer = require('puppeteer')
const crawl = async (url) => {
  try {
    //console.log(`Crawling ${url}`)
    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium',args: ['--no-sandbox'],})
    const page = await browser.newPage()
    await page.goto(url)
    const selector = '.home_index > a'
    await page.waitForSelector(selector)
    const links = await page.$$eval(selector, am => am.filter(e => e.href).map(e => e.href))
    //console.log(links.toString().replace('', '                     '))
    //console.table(links.str_replace)
    result = str_replace(',', '\n\n\n', links);
    result2 = str_replace('https://62.182.83.93/', 'https://anoboy.digital/', result);
    console.log(result2);
    //console.log(prettier.format(JSON.stringify(links),{ semi: false, parser: "json" }));
    await browser.close()
  } catch (err) {
    console.log(err)
  }
}

crawl('https://62.182.83.93/')
