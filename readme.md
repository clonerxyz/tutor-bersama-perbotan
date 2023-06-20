## Epilouge

<div align="center">

<img width="10%"  src="https://github.com/clonerxyz/tutor-bersama-perbotan/blob/master/cantik.png"><br/>

<b>Big thanks</b> for the parent of god for all bot nowdays : [Baileys](https://github.com/WhiskeySockets/Baileys) module for whatsapp.

> NOTE : Incase not 100 % safe and for sure use its just for testing only

</div>

## how to install 

just :

> npm install

## how we recommended requirment

- lastest node js ver | lastest npm version
- vps with 24 Hours /30 days /12 month uptime (500 Mb RAM | 2 core cpus or shared | 5 Gb disk storage )
- recommendedly using linux, all distro's is accepted based on you knowladge
- [Supervisor](https://www.npmjs.com/package/supervisor) module for stable with error/ crash everytime 
- Install ffmpeg on your instance for re arange video.mp4/image.jpeg to wbep to sticker purpose
- [yt-dlp] (https://github.com/yt-dlp/yt-dlp) for youtube's purpose
- apt-get install libcairo2-dev libpango1.0-dev libgif-dev build-essential g++ (if u debian based its require for pass canvas installation)

## how to run 
- first off all be sure supervisor is globally added on your instance (npm install supervisor -g)
- just run : 

> supervisor war.js

## simple explanation
- query builder for get text
> const alls = (msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.message?.listResponseMessage?.title || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption) 
- query builder for get jid
> const didi = (msg.key.remoteJid)
- query builder for get name 
> const namez = (msg.pushName);


- forward function
> else if (alls?.startsWith('cl')){
							const txt = (alls?.split("|")[1])
							const it = (alls?.split("|")[2])
							//console.log(`${it} ${txt}`)
							await sock.readMessages([msg.key])
							await sendMessageWTyping({text: `${txt}`}, it)
                        }

> usage cl |test|6282xxxxxxx@s.whatsapp.net // for personal | cl |test|1203630xxxxx@g.us // for group

> group id and personal id stored in keyid.txt

another feature explanation on other days thanks

or sent me DM : clonerxyz#0061(discord) or u can go to official discord baileys : https://discord.gg/WeJM5FP9GG or lookup on docs https://whiskeysockets.github.io/Baileys/

## all menu

> check it on menu.txt file

## demo bot 

> *Demo bot : https://youtube.com/shorts/qXYll6iPRUE?feature=share*

## big thanks

[Baileys](https://github.com/WhiskeySockets/Baileys)

License: [MIT](https://en.wikipedia.org/wiki/MIT_License)
