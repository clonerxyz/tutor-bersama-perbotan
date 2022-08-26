const puppeteer = require("puppeteer")
const str_replace = require('str_replace');
const args = process.argv.slice(2);
const url = str_replace('\[', ' ', args)
;(async () => {
  
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium',args: ['--no-sandbox'],})
  //const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(url)

  /* Run javascript inside the page */
  const data = await page.evaluate(() => {
    const list = []
    const items = document.querySelectorAll(".yuRUbf")

    for (const item of items) {
      list.push({
        link: item.querySelector(".yuRUbf > a").getAttribute('href'),
        desc: item.querySelector(".yuRUbf > a > h3").innerHTML,
        //link: item.querySelector(".dXiKIc > a").getAttribute('href'),
      })
    }

    return list
  })
  //const output = str_replace('\[', ' ', data)
  console.log(data)
  await browser.close()
})()
