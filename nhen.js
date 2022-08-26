const fetch =  require('node-fetch');
const { load }= require('cheerio');
const str_replace = require('str_replace');
async function start() {
    function ran(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
        }
var url = ('http://www.xxxhentaipics.com/hentai/all/top/' + (ran(1,34)) +'')

const response = await fetch(url);
const body = await response.text();

let $ = load(body);

const title = $('.pm_portfolio_featured_image_wrapper > img');

let row =''

title.each((_, e) => {
    row += 'http:' + $(e).attr('data-src') + '';
    row += '\n'
});
//const res = str_replace('\n', '', row)
const res = str_replace('http:undefined', 'https://media.discordapp.net/attachments/927421589916631098/1006496104671613038/2831361782.jpg', row)
console.log(res)
}

start();