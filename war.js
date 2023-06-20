"use strict"
const { default:makeWASocket, WA_DEFAULT_EPHEMERAL, makeCacheableSignalKeyStore, AnyMessageContent, MessageOptions, delay, downloadMediaMessage, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, MessageRetryMap, useMultiFileAuthState, MessageType, proto} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom')
const MAIN_LOGGER = require('@whiskeysockets/baileys/lib/Utils/logger');
const { createSticker, StickerTypes } = require('wa-sticker-formatter')
const { exec } = require("child_process")
const pino = require('pino')
const qrcode = require('qrcode-terminal');
const str_replace = require('str_replace');
const gTTS = require('gtts');
const translate = require('translate-google');
const { id } = require('translate-google/languages');
let msgRetryCounterMap;
msgRetryCounterMap = MessageRetryMap;
const logger = pino();
const useStore = !process.argv.includes('--no-store')
const store = useStore ? makeInMemoryStore({ logger }) : undefined
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store?.writeToFile('./baileys_store_multi.json')
}, 10_000)
const startSock = async() => {
	const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
	const { version, isLatest } = await fetchLatestBaileysVersion()
	
	const sock = makeWASocket({
		version,
		printQRInTerminal: true,
		auth: state,
		keys: makeCacheableSignalKeyStore(state.keys, pino({level: "error"})),
		msgRetryCounterMap,
		logger,
		//browser: Browsers.baileys('Desktop'),
		//browser: browsers.macOS('Desktop'),
		browser: ['chrome', 'Desktop', '10'],
		syncFullHistory: true,
		getMessage: async key => {
			if(store) {
				const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
				return msg?.message || undefined
			}

			// only if store is present
			return {
				conversation: 'hello'
			}
		}
	})
sock.ev.on('call', async (node) => {
	const { from, id, status } = node[0]
	if (status == 'offer') {
		const stanza = {
			tag: 'call',
			attrs: {
				from: sock.user.id,
				to: from,
				id: sock.generateMessageTag(),
			},
			content: [
				{
					tag: 'reject',
					attrs: {
						'call-id': id,
						'call-creator': from,
						count: '0',
					},
					content: undefined,
				},
			],
		}
		await sock.query(stanza)
	}
})
sock.ev.process(
		async(events) => {
			if(events['connection.update']) {
				const update = events['connection.update']
				const { connection, lastDisconnect } = update
				if(connection === 'close') {
					
				}
				if(lastDisconnect?.error?.output?.statusCode === DisconnectReason.restartRequired) {
						startSock()
				}
				if(lastDisconnect?.error?.output?.statusCode === DisconnectReason.timedOut) {
				}
				else if(connection === 'open') {
				
				}
			}
			if(events['creds.update']) {
				await saveCreds()
			}
			if(events['chats.set']) {
				const { chats, isLatest } = events['chats.set']
				//console.log(`recv ${chats.length} chats (is latest: ${isLatest})`)
			}
			if(events['call']) {
				
			}
			if(events['messages.set']) {
				const { messages, isLatest } = events['messages.set']
				//console.log(`recv ${messages.length} messages (is latest: ${isLatest})`)
			}

			if(events['contacts.set']) {
				const { contacts, isLatest } = events['contacts.set']
				//console.log(`recv ${contacts.length} contacts (is latest: ${isLatest})`)
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
						const didiz = (msg.key.participant)
						const didix = str_replace('@s.whatsapp.net','', didi)
						const didiy = str_replace('@s.whatsapp.net','', didiz)
						const allc = (msg.key.remoteJid || msg.key.participant);
						const didiw = str_replace('@s.whatsapp.net','', allc)
						const alls = (msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.message?.listResponseMessage?.title || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption)
						const list = (msg.message?.listResponseMessage?.title);
						const stsx = (msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption);
						const btrx = (msg.message?.buttonsResponseMessage?.selectedDisplayText);
						const sendMessageWTyping = async(msg, didi, options={}) => {
							await sock.presenceSubscribe(didi)
							await delay(500)

							await sock.sendPresenceUpdate('composing', didi)
							await delay(2000)

							await sock.sendPresenceUpdate('paused', didi)

							await sock.sendMessage(didi, msg, options)
						}
						
						console.log(`nomor : ${didix} nama : ${namez} [pesan : ${alls}]`)
						//fs.appendFileSync('db.json', ''+msg+'\n' ,(err)=> {
						  //if(err){
						//	console.log('error',err);
						  //}
						  //console.log('DONE');
						//})
						
						if(alls === 'menu' || alls === 'menus' || alls === 'Menus' || alls === '.menus' || alls === 'Help' || alls === 'help'  || alls === 'Menu' || alls === '.menu' || alls === 'p' || alls === 'P' ) {
							await sock.readMessages([msg.key])
								//async function menn() {
									exec('cat menu.txt', async(error, stdout, stderr) => {
									if (error) {
										console.log(`error: ${error.message}`);
										return;
									}
									if (stderr) {
										console.log(`stderr: ${stderr}`);
										return;
									}
									await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
									})
									
						}
						else if (body === '1' || group === '1'){
                            				await sock.readMessages([msg.key])
							await sendMessageWTyping({text: "hallo"}, msg.key.remoteJid, {quoted:msg }, { ephemeralExpiration: WA_DEFAULT_EPHEMERAL })
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
						else if (alls?.startsWith('ct')) {
							var msg1 = (alls?.slice(3))
							const msg2 = str_replace('@','', msg1)
							const msg3 = str_replace(' ','', msg2)
							const msg4 = str_replace('-','', msg3)
							const msgy = str_replace('+','', msg4)
							console.log(msgy);
							const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
										+ 'VERSION:3.0\n' 
										+ `FN:${msgy}\n` // full name
										+ `ORG:${msgy};\n` // the organization of the contact
										+ `TEL;type=CELL;type=VOICE;waid=${msgy}:+${msgy}\n` // WhatsApp ID + phone number
										+ 'END:VCARD'
							await sock.sendMessage(
								msg.key.remoteJid,
								{ 
									contacts: { 
										displayName: `${msgy}`, 
										contacts: [{ vcard }] 
									}
								}, {quoted: msg})
							
						}
						else if (alls?.startsWith('cz')) {
							//var msgy = (alls?.slice(3))
							//console.log(msgy);
							const p = didiy.substr(0, 2)+ ' ' + didiy.substr(2, 3)+ ' ' + didiy.substr(5, 4)+ ' ' + didiy.substr(9, 6);
							const q = didix.substr(0, 2)+ ' ' + didix.substr(2, 3)+ ' ' + didix.substr(5, 4)+ ' ' + didix.substr(9, 6);
							console.log(p);
							console.log(q);
							if (didi.includes('@g.us')) {
								const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
										+ 'VERSION:3.0\n' 
										+ `FN:${p}\n` // full name
										+ `ORG:${p};\n` // the organization of the contact
										+ `TEL;type=CELL;type=VOICE;waid=${didiy}:+${p}\n` // WhatsApp ID + phone number
										+ 'END:VCARD'	
								await sock.sendMessage(
								msg.key.remoteJid,
								{ 
									contacts: { 
										displayName: `${p}`, 
										contacts: [{ vcard }] 
									}
								}, {quoted: msg})
							}
							else {
								const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
										+ 'VERSION:3.0\n' 
										+ `FN:${q}\n` // full name
										+ `ORG:${q};\n` // the organization of the contact
										+ `TEL;type=CELL;type=VOICE;waid=${didix}:+${q}\n` // WhatsApp ID + phone number
										+ 'END:VCARD'
								await sock.sendMessage(
								msg.key.remoteJid,
								{ 
									contacts: { 
										displayName: `${q}`, 
										contacts: [{ vcard }] 
									}
								}, {quoted: msg})
							}
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
								gtts.save(`/root/mnt/home/clonerxyz/botwatest/dlyt/${name}.mp3`, function (err, result){
									if(err) { throw new Error(err); }
									console.log("Text to speech converted!");
									async function spkz(){
									await sendMessageWTyping({audio: {url: `/root/mnt/home/clonerxyz/botwatest/dlyt/${name}.mp3`}, mimetype: 'audio/mp4'}, msg.key.remoteJid)
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
											author: 'aleya gita', // author name
											categories: ['😘', '🎉'], 
											type: StickerTypes.FULL, // sticker type
											quality: 50, // quality of the output file
										}
										const generateSticker = await createSticker(mediaData, stickerOptions)
									//await sendMessageWTyping({sticker: {url: `/root/mnt/home/clonerxyz/botwatest/img/${name}.webp`}, stickerOptions}, msg.key.remoteJid)
									await sendMessageWTyping({ sticker: generateSticker }, msg.key.remoteJid)
									//await sendMessageWTyping({sticker: {url: `${str2}`}}, msg.key.remoteJid)
									}
								else {await sendMessageWTyping({text: `kecepetan mas sabar`}, msg.key.remoteJid, { quoted: msg })}
								
								
								
							})
                        }
						else if (alls?.startsWith('sts') || alls?.startsWith('Sts')){
                            await sock.readMessages([msg.key])
								const name = Math.random().toString(36).slice(8);
								const pathget =  (msg.message?.imageMessage?.mimetype || msg.message?.videoMessage?.mimetype)
								const size = (msg.message?.videoMessage?.fileLength)
								console.log(pathget)
								if ( size > 5000000) {
									await sendMessageWTyping({text: `kegedean mas file nya`}, msg.key.remoteJid)
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
								await writeFile(`/root/mnt/home/clonerxyz/botwatest/img/${name}.${pathclean}`, buffer)
								//await writeFile(`/root/mnt/home/clonerxyz/botwatest/img/${name}.${pathclean}`, getMedia)
								const folder = ('/root/mnt/home/clonerxyz/botwatest/img/')
								//exec('ffmpeg -i '+folder+name+'.'+pathclean+' '+folder+name+'.webp', async(error, stdout, stderr) => {
								exec('ffmpeg -i '+folder+name+'.'+pathclean+' -v quiet -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -compression_level 6 -loop 0 -preset default -an -vsync 0  '+folder+name+'.webp', async(error, stdout, stderr) => {
									if (error) {
										console.log(`error: ${error.message}`);
										//return;
									}
									if (stderr) {
										console.log(`stderr: ${stderr}`);
										//return;
									}
									if (fs.existsSync(`/root/mnt/home/clonerxyz/botwatest/img/${name}.webp`)) {
										//const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
										//const mediaData = await fs.readFileSync(`/root/mnt/home/clonerxyz/botwatest/img/${name}.webp`)
										//const sticker = new Sticker(mediaData, {
										//	pack: 'vtuber kesayangan kita', // The pack name
										//	author: 'aleya gita', // The author name
										//	type: StickerTypes.FULL, // 'full'
										//	categories: ["🤩", "🎉"], // The sticker category
										//	id: `${name}`, // The sticker id
											//quality: 50, // The quality of the output file
											//background: '#000000'
										//  });
									//await sticker.toFile(`/root/mnt/home/clonerxyz/botwatest/img/${name}2.webp`)
									//const generateSticker = await createSticker(mediaData, stickerOptions)
									await sock.sendMessage(msg.key.remoteJid, {sticker: fs.readFileSync(`/root/mnt/home/clonerxyz/botwatest/img/${name}.webp`)});
									//await sendMessageWTyping({sticker: {url: `/root/mnt/home/clonerxyz/botwatest/img/${name}.webp`}, stickerOptions}, msg.key.remoteJid)
									//await sock.sendMessage(msg.key.remoteJid, await sticker.toMessage());
									//await sendMessageWTyping({ sticker: generateSticker },  msg.key.remoteJid)
									}
									else {await sendMessageWTyping({text: `kegedean mas file nya`}, msg.key.remoteJid)}
								})
								//await delay(6000)
							}
								
                        			}
						
						else if (alls?.startsWith('fc') || alls?.startsWith('Fc')){
                            				await sock.readMessages([msg.key])
							const fcz = (list?.slice(2) || body?.slice(2) || group?.slice(2))
							const fcx = (list?.slice(3) || body?.slice(3) || group?.slice(3))
							console.log(msg.key.remoteJid);
							if (msg.key.remoteJid === '6282246901096@s.whatsapp.net' || msg.key.remoteJid === '6282246901096-1604388272@g.us'){
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
							else if(msg.key.remoteJid !== '628xxxx(ownernumberhere)@s.whatsapp.net' || msg.key.remoteJid !== '6282246901096-1604388272@g.us'){
								await sendMessageWTyping({text: `sabar dulu ya `}, msg.key.remoteJid, { quoted: msg })
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
						else if (alls?.startsWith('info') || alls?.startsWith('info')){
                            				await sock.readMessages([msg.key])
							exec('ls /root/bail/here/baileys_auth_info | grep 62 | wc -l', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								await sendMessageWTyping({text: `user yang connect : ${stdout} `}, msg.key.remoteJid)
								
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

