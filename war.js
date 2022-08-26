"use strict"
const { default:makeWASocket, AnyMessageContent, MessageType, delay, downloadMediaMessage, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, MessageRetryMap, useMultiFileAuthState } = require('@adiwajshing/baileys');
const app = require('express')();
const { writeFile }  = require('fs/promises')
const { Boom } = require('@hapi/boom')
const MAIN_LOGGER = require('@adiwajshing/baileys/lib/Utils/logger');
const { createSticker, StickerTypes } = require('wa-sticker-formatter')
const { exec } = require("child_process")
const pino = require('pino')
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const d_t = new Date();
const str_replace = require('str_replace');
const gTTS = require('gtts');
let seconds = d_t.getSeconds();
const translate = require('translate-google');
const startSock = async() => {
	const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
	const { version, isLatest } = await fetchLatestBaileysVersion()
	const sock = makeWASocket({
		version,
		printQRInTerminal: true,
		auth: state,
		//msgRetryCounterMap,
		logger: pino({ level: 'silent', })
		
	})
sock.ev.process(
		async(events) => {
			if(events['connection.update']) {
				const update = events['connection.update']
				const { connection, lastDisconnect } = update
				if(connection === 'close') {
					
				}
				else if(connection === 'open') {
				
				}
			}
			if(events['messages.upsert']) {
				const upsert = events['messages.upsert']
				//console.log('recv messages ', JSON.stringify(upsert, undefined, 2))
				
				if(upsert.type === 'notify') {
					try {
					for(const msg of upsert.messages) {   
						const body = (msg.message?.extendedTextMessage?.text);
						const group = (msg.message?.conversation);
						const namez = (msg.pushName);
						const didi = (msg.key.remoteJid)
						const didix = str_replace('@s.whatsapp.net','', didi)
						const alls = (msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.message?.listResponseMessage?.title || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption)
						const list = (msg.message?.listResponseMessage?.title);
						const stsx = (msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption);
						const sendMessageWTyping = async(msg, didi) => {
							await sock.presenceSubscribe(didi)
							await delay(500)

							await sock.sendPresenceUpdate('composing', didi)
							await delay(2000)

							await sock.sendPresenceUpdate('paused', didi)

							await sock.sendMessage(didi, msg)
						}
						console.log(`nomor : ${didix} nama : ${namez} [pesan : ${alls}]`)
						fs.appendFileSync('keyid.txt', ''+didix+'\n' ,(err)=> {
						  if(err){
							console.log('error',err);
						  }
						  //console.log('DONE');
						})
						//const stsx = (msg.message?.videoMessage?.caption);
						if(alls === 'menu' || alls === 'Menu' || alls === '.menu' || alls === 'p' || alls === 'P' ) {
							await sock.readMessages([msg.key])
							const buttons = [
							  {buttonId: 'id1', buttonText: {displayText: 'about aleya'}, type: 1},
							  {buttonId: 'id2', buttonText: {displayText: 'menus'}, type: 1},
							]
							const buttonMessage = {
								image: {url: './cantik.png'},
 								caption : "intro bot mu",
								footerText: ' ',
								headerType: 4,
								buttons: buttons,
							}
							
							await sendMessageWTyping(buttonMessage, msg.key.remoteJid)
						}
						else if(msg.message?.buttonsResponseMessage?.selectedButtonId === 'id2' || body === 'menus' || group === 'menus' )
						{
	                    await sock.readMessages([msg.key])
	                        const sections = [
								{
								title: " ",
								rows: [
									{title:'how to use klik here'},
									{title:'tle aku cinta kamu'},
									{title:'tlj arigato'},
									{title:'tli another world'},
									{title:'update anime'},
									{title:'strg'},
									{title:'rmeme'},
									{title:'nh'},
									{title:'gs siapa yang paling ganteng di indonesia'},
									{title:'ys indonesia raya'},
									{title:'strd'},
									{title:'vn'},
									{title:'spk test'},
									{title:'sts'},
									{title:'yt https://youtu.be/tPEE9ZwTmy0'},
									{title:'ymp3 https://youtu.be/tPEE9ZwTmy0'}
								]
								},
							]
							  
							  const listMessage = {
							  text: "intro bot mu",
							  ListType: 2,
							  buttonText : "MENU",
							  sections
							}

							await sendMessageWTyping(listMessage, msg.key.remoteJid)
						}
                        else if (msg.message?.buttonsResponseMessage?.selectedButtonId === 'id1'){
                            await sock.readMessages([msg.key])
                            await sendMessageWTyping({text: "𝙏𝙝𝙚 𝙬𝙤𝙧𝙡𝙙 𝙞𝙨𝙣'𝙩 𝙥𝙚𝙧𝙛𝙚𝙘𝙩. 𝘽𝙪𝙩 𝙞𝙩'𝙨 𝙩𝙝𝙚𝙧𝙚 𝙛𝙤𝙧 𝙪𝙨, 𝙙𝙤𝙞𝙣𝙜 𝙩𝙝𝙚 𝙗𝙚𝙨𝙩 𝙞𝙩 𝙘𝙖𝙣. 𝙩𝙝𝙖𝙩'𝙨 𝙬𝙝𝙖𝙩 𝙢𝙖𝙠𝙚𝙨 𝙞𝙩 𝙨𝙤 𝙙𝙖𝙢𝙣 𝙗𝙚𝙖𝙪𝙩𝙞𝙛𝙪𝙡.\n ~ 𝙍𝙤𝙮 𝙈𝙪𝙨𝙩𝙖𝙣𝙜 (𝙁𝙪𝙡𝙡 𝙈𝙚𝙩𝙖𝙡 𝘼𝙡𝙘𝙝𝙚𝙢𝙞𝙨𝙩).\n\n\n 𝙎𝙤 𝙝𝙚𝙧𝙚 𝙞'𝙢 𝘼𝙡𝙚𝙮𝙖 𝙜𝙞𝙩𝙖 𝙩𝙤 𝙘𝙪𝙧𝙚 𝙮𝙤𝙪𝙧 𝙙𝙚𝙥𝙧𝙚𝙨𝙨𝙞𝙤𝙣 \n\n version bot : v1.9.2-lite"}, msg.key.remoteJid)
                        }
						else if (alls?.startsWith('cl')){
							const txt = (alls?.split("|")[1])
							const it = (alls?.split("|")[2])
							//console.log(`${it} ${txt}`)
							await sock.readMessages([msg.key])
							await sendMessageWTyping({text: `${txt}`}, it)
                        }
						else if (body === '1' || group === '1'){
                            await sock.readMessages([msg.key])
							
                            await sendMessageWTyping({text: "hallo"}, msg.key.remoteJid)
                        }
						else if (alls?.startsWith('tle') || alls?.startsWith('Tle')){
                            await sock.readMessages([msg.key])
							const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
							translate(''+it+'', {from: 'auto', to: 'en'}).then( async res => {
								console.log(res)
								await sendMessageWTyping({text: `${res}`}, msg.key.remoteJid)
							}).catch( async err => {
								console.error(err)
								await sendMessageWTyping({text: `${err}`}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('tlj') || alls?.startsWith('Tlj')){
                            await sock.readMessages([msg.key])
							const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
							translate(''+it+'', {from: 'auto', to: 'ja'}).then( async res => {
								console.log(res)
								await sendMessageWTyping({text: `${res}`}, msg.key.remoteJid)
							}).catch( async err => {
								console.error(err)
								await sendMessageWTyping({text: `${err}`}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('tli') || alls?.startsWith('Tli')){
                            await sock.readMessages([msg.key])
							const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
							translate(''+it+'', {from: 'auto', to: 'id'}).then( async res => {
								console.log(res)
								await sendMessageWTyping({text: `${res}`}, msg.key.remoteJid)
							}).catch( async err => {
								console.error(err)
								await sendMessageWTyping({text: `${err}`}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('how') || alls?.startsWith('How')){
                            await sock.readMessages([msg.key])
							exec('cat menu.txt', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								
								await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('strg') || alls?.startsWith('Strg')){
                            await sock.readMessages([msg.key])
							exec('ls ./doujin | shuf -n 1', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								const str2 = stdout.replace(/\r?\n|\r/g, "");
								await sendMessageWTyping({image: {url: `./doujin/${str2}`}}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('vn') || alls?.startsWith('Vn')){
                            await sock.readMessages([msg.key])
							exec('ls ./vn | shuf -n 1', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								const str2 = stdout.replace(/\r?\n|\r/g, "");
								await sendMessageWTyping({audio: {url: `./vn/${str2}`}, mimetype: 'audio/mp4'}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('spk') || alls?.startsWith('Spk')){
                            await sock.readMessages([msg.key])
							const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
							if (it === ''){
							await sendMessageWTyping({text: `kata-kata nya kakak belom`}, msg.key.remoteJid)
							}
							else {
								//const speech = ``+ it +`` ;
								console.log(it)
								const name = Math.random();
								const gtts = new gTTS(it, 'id');
								gtts.save(`./content/${name}.mp3`, function (err, result){
									if(err) { throw new Error(err); }
									console.log("Text to speech converted!");
									async function spkz(){
									await sendMessageWTyping({audio: {url: `./content/${name}.mp3`}, mimetype: 'audio/mp4'}, msg.key.remoteJid)
									}
									spkz()
								});
								
								 
							}
                        }
						else if (alls?.startsWith('strd') || alls?.startsWith('Strd')){
                            await sock.readMessages([msg.key])
							const name = Math.random().toString(36).slice(8);
							
							exec(''+name+'=$(ls ./doujin | shuf -n 1) && ffmpeg -i  ./doujin/"$'+name+'" -v quiet ./doujin/'+name+'.webp  && ls ./doujin/'+name+'.webp', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								const str2 = stdout.replace(/\r?\n|\r/g, "");
								if (str2 === './doujin/'+name+'.webp'){
									const mediaData = await fs.readFileSync(`${str2}`)
										const stickerOptions = {
											pack: 'vtuber kesayangan kita', // pack name
											author: 'nama bot mu', // author name
											categories: ['😘', '🎉'], 
											type: StickerTypes.FULL, // sticker type
											quality: 100, // quality of the output file
										}
										const generateSticker = await createSticker(mediaData, stickerOptions)
									//await sendMessageWTyping({sticker: {url: `./img${name}.webp`}, stickerOptions}, msg.key.remoteJid)
									await sendMessageWTyping({ sticker: generateSticker }, msg.key.remoteJid)
									//await sendMessageWTyping({sticker: {url: `${str2}`}}, msg.key.remoteJid)
									}
								else {await sendMessageWTyping({text: `WHOOPS TO FAST DUDE !!!`}, msg.key.remoteJid)}
								
								
								
							})
                        }
						else if (alls?.startsWith('sts') || alls?.startsWith('Sts')){
                            await sock.readMessages([msg.key])
								const name = Math.random().toString(36).slice(8);
								const pathget =  (msg.message?.imageMessage?.mimetype || msg.message?.videoMessage?.mimetype)
								const size = (msg.message?.videoMessage?.fileLength)
								console.log(pathget)
								if ( size > 1000000) {
									await sendMessageWTyping({text: `WHOOPS TO Large DUDE !!!`}, msg.key.remoteJid)
								}
								else {
								
								const path = str_replace('image/', '', pathget);
								const pathclean = str_replace('video/', '', path);
								const buffer = await downloadMediaMessage(
									msg,
									'buffer',
									{ },
									{ 
										//logger,
										// pass this so that baileys can request a reupload of media
										// that has been deleted
										reuploadRequest: sock.updateMediaMessage
									}
								)
								// save to file
								await writeFile(`./img${name}.${pathclean}`, buffer)
								const folder = ('./img')
								exec('ffmpeg -i '+folder+name+'.'+pathclean+' -v quiet -vcodec libwebp -filter:v fps=fps=20 -lossless 0  -compression_level 3 -q:v 70 -loop 1 -preset picture -an -vsync 0  '+folder+name+'.webp', async(error, stdout, stderr) => {
									if (error) {
										console.log(`error: ${error.message}`);
										//return;
									}
									if (stderr) {
										console.log(`stderr: ${stderr}`);
										//return;
									}
									if (fs.existsSync(`./img${name}.webp`)) {
										const mediaData = await fs.readFileSync(`./img${name}.webp`)
										const stickerOptions = {
											pack: 'vtuber kesayangan kita', // pack name
											author: 'nama bot mu', // author name
											type: StickerTypes.FULL, // sticker type
											quality: 100, // quality of the output file
										}
										const generateSticker = await createSticker(mediaData, stickerOptions)
									//await sendMessageWTyping({sticker: {url: `./img${name}.webp`}, stickerOptions}, msg.key.remoteJid)
									await sendMessageWTyping({ sticker: generateSticker }, msg.key.remoteJid)
									}
									else {await sendMessageWTyping({text: `WHOOPS TO LARGE !!!`}, msg.key.remoteJid)}
								})
								//await delay(6000)
							}
								
                        }
						else if (alls?.startsWith('nh') || alls?.startsWith('Nh')){
                            await sock.readMessages([msg.key])
							try {
							exec('node nhen.js | shuf -n 1', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								const str4 = stdout.replace(/\r?\n|\r/g, "");
								if (str4 === '') {
								await sendMessageWTyping({text: `WHOOPS TO FAST DUDE !!!`}, msg.key.remoteJid)
								}
								else {
								await sendMessageWTyping({image: {url: `${str4}`}}, msg.key.remoteJid)
								}
							})
						}catch (e) {
							await sendMessageWTyping({text: `WHOOPS TO FAST DUDE !!!`}, msg.key.remoteJid)
							}
							
                        }
						else if (alls?.startsWith('rmeme') || alls?.startsWith('Rmeme')){
                            await sock.readMessages([msg.key])
							exec('node meme.js', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								const str3 = stdout.replace(/\r?\n|\r/g, "");
								await sendMessageWTyping({image: {url: `${str3}`}}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('update anime') || alls?.startsWith('Update anime')){
                            await sock.readMessages([msg.key])
							exec('node anime.js', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
							})
                            
                        }
						else if (alls?.startsWith('gs') || alls?.startsWith('Gs')){
                            await sock.readMessages([msg.key])
							const linkz = (list?.slice(2) || body?.slice(2) || group?.slice(2))
							const query = ('https://google.com/search?q=' + linkz + '')
							exec("node ggl2.js " + query + "", async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								//console.log(`stdout: ${stdout}`);
								const output = str_replace('\[', ' ', stdout)
								const output1 = str_replace('\'', ' ', output)
								const output2 = str_replace('\,', ' ', output1)
								const output3 = str_replace('\{', ' ', output2)
								const output4 = str_replace('\}', ' ', output3)
								const output5 = str_replace('\]', ' ', output4)
								await sendMessageWTyping({text: `${output5}`}, msg.key.remoteJid)
							})	
                            
                        }
						else if (alls?.startsWith('ys') || alls?.startsWith('Ys')){
                            await sock.readMessages([msg.key])
							const ysz = (list?.slice(2) || body?.slice(2) || group?.slice(2))
							const query = ('https://www.youtube.com/results?search_query=' + ysz + '')
							const { exec } = require("child_process")
							exec("node gyt.js " + query + "", async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								//console.log(`stdout: ${stdout}`);
								await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
							})	
												
                        }
						else if (alls?.startsWith('yt') || alls?.startsWith('Yt')){
							await sock.readMessages([msg.key])
							const ysz = (list?.slice(2) || body?.slice(2) || group?.slice(2))
							const name = Math.random().toString(36).slice(8);
							const { exec } = require("child_process")
							
							exec('cp ./dlyt/rc1kd.mp4 ./dlyt/'+name+'.mp4 && ./yt-dlp -f "(mp4)[height<480]" -o ./dlyt/'+name+'.mp4 --max-filesize 56121471 --force-overwrites ' + ysz + '', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
									await sendMessageWTyping({text: `who who dude calm`}, msg.key.remoteJid)
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
									await sendMessageWTyping({text: `who who dude calm`}, msg.key.remoteJid)
								}
								
									//const str_replace = require('str_replace');
									//const outyt = str_replace('\n','', stdout)
									await sendMessageWTyping({text: `proccess downloading..`}, msg.key.remoteJid)
									await delay (10000)
									if (fs.existsSync('./dlyt/'+name+'.mp4')) {
										await sendMessageWTyping({ video: { url: './dlyt/'+name+'.mp4' }, mimetype: 'video/mp4'}, msg.key.remoteJid)
									  }
									else {
										await sendMessageWTyping({text: `who who dude to large`}, msg.key.remoteJid)
									}
									
									
							})
						
													
							}
							else if (alls?.startsWith('ymp3') || alls?.startsWith('Ymp3')){
								await sock.readMessages([msg.key])
								const ysz = (list?.slice(4) || body?.slice(4) || group?.slice(4))
								const name = Math.random().toString(36).slice(8);
								const { exec } = require("child_process")
								exec('./yt-dlp -S "res:144" --extract-audio --audio-format mp3 -o ./dlyt/'+name+'.mp3 --max-filesize 56121471 --force-overwrites ' + ysz + '', async(error, stdout, stderr) => {
									if (error) {
										console.log(`error: ${error.message}`);
										//return;
										await sendMessageWTyping({text: `who who dude calm`}, msg.key.remoteJid)
									}
									if (stderr) {
										console.log(`stderr: ${stderr}`);
										//return;
										await sendMessageWTyping({text: `who who dude calm`}, msg.key.remoteJid)
									}
										//const str_replace = require('str_replace');
										//const outyt = str_replace('\n','', stdout)
										await sendMessageWTyping({text: `proccess downloading..`}, msg.key.remoteJid)
										await delay (10000)
										if (fs.existsSync('./dlyt/'+name+'.mp3')) {
										await sendMessageWTyping({ audio: { url: './dlyt/'+name+'.mp3' }, mimetype: 'audio/mp4'}, msg.key.remoteJid)
										}
										else {
											await sendMessageWTyping({text: `who who dude to large`}, msg.key.remoteJid)
										}
								})
														
								}
								else if (alls?.startsWith('td') || alls?.startsWith('Td')) {
									await sock.readMessages([msg.key])
									const it = (list?.slice(2) || body?.slice(2) || group?.slice(2))
									const str_replace = require('str_replace');
									//const output = str_replace(' ', '', it);
									const name = Math.random().toString(36).slice(8);
									const { exec } = require("child_process");
									exec(''+name+'=$(node tik.js' +it+ ') && curl "$'+name+'" -s -o ./vid/'+name+'.mp4 && ls ./vid | grep '+name+'.mp4', async (error, stdout, stderr) => {
										if (error) {
											await sendMessageWTyping({text: `who who dude calm`}, msg.key.remoteJid)
											//return;
										}
										if (stderr) {
											await sendMessageWTyping({text: `who who dude calm`}, msg.key.remoteJid)
											//return;
										}
										console.log(stdout)
										const yuu = str_replace('\n', '', stdout);
										const yuio = (''+name+'.mp4')
										if (yuu === yuio){
										await sendMessageWTyping({ video: { url: './vid/'+name+'.mp4' }, mimetype: 'video/mp4'}, msg.key.remoteJid)
										}
										else {
										await sendMessageWTyping({text: `who who dude calm`}, msg.key.remoteJid)
										}
									})
								}
						else if (alls?.startsWith('fc') || alls?.startsWith('Fc')){
                            await sock.readMessages([msg.key])
							const fcz = (list?.slice(2) || body?.slice(2) || group?.slice(2))
							const fcx = (list?.slice(3) || body?.slice(3) || group?.slice(3))
							console.log(msg.key.remoteJid);
							if (msg.key.remoteJid === '62xxx(owner number)@s.whatsapp.net'){
							const { exec } = require("child_process")
							exec(""+fcz+"", async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
									await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
									await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
								}
								//console.log(`stdout: ${stdout}`);
								await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
							})	
						}
							else if(msg.key.remoteJid !== '62xxx(owner number)@s.whatsapp.net'){
								await sendMessageWTyping({text: `who who calm dawn man`}, msg.key.remoteJid)
							}
												
                        }

						else if (alls?.startsWith('cpu') || alls?.startsWith('Cpu')){
                            await sock.readMessages([msg.key])
							exec('sh a.sh', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
							})
                            
                        }
						
					}
					
				}
				catch (e) {
					console.log(e);
					}
				}
			
			}
		}
	)

	return sock
}

startSock()