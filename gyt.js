const str_replace = require('str_replace');
//const fs = require('fs')
const puppeteer = require('puppeteer')
const args = process.argv.slice(2);
const url = str_replace('\[', ' ', args)
const crawl = async (url) => {
  try {
    //console.log(`Crawling ${url}`)
    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium',args: ['--no-sandbox'],})
    const page = await browser.newPage()
    await page.goto(url)
    //const selector = '.style-scope.ytd-video-renderer'
    const selector2 = '#video-title'
    //await page.waitForSelector(selector)
    await page.waitForSelector(selector2)
    //const list = []
    //const links = await page.$$eval(selector2, am => am.filter(e => e.href).map(e => e.href))
    const links2 = await page.$$eval(selector2, list =>list.map(n => n.getAttribute('aria-label')))
    const links3 = await page.$$eval(selector2, list =>list.map(n => n.getAttribute('href')))
    //list.push({links,links2})
    let text = "";
    for (let i = 0; i < 6 ; i++) {
      text += links2[i] + " - https://www.youtube.com" + links3[i] +"\n";
      text += "\n";
    }
    console.log(text);
    await browser.close()
  }
   catch (err) {
    console.log(err)
  }
}

crawl(url)
