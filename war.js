"use strict"
const {
    default: makeWASocket,
    WA_DEFAULT_EPHEMERAL,
    makeCacheableSignalKeyStore,
    AnyMessageContent,
    MessageOptions,
    delay,
    downloadMediaMessage,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    MessageRetryMap,
    useMultiFileAuthState,
    MessageType,
    proto
} = require('@whiskeysockets/baileys');
const app = require('express')();
const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET =
    "";
const http = require('http').Server(app);
const port = process.env.PORT || 3017;
const {
    writeFile
} = require('fs/promises')
const {
    Boom
} = require('@hapi/boom')
const MAIN_LOGGER = require('@whiskeysockets/baileys/lib/Utils/logger');
const {
    createSticker,
    StickerTypes
} = require('wa-sticker-formatter')
const {
    exec
} = require("child_process")
const pino = require('pino')
const re = /.git.*/ig;
const proxy_list = [

]
let random_index = Math.floor(Math.random() * proxy_list.length);
const fs = require('fs');

function addLeadingZeros(n) {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}
let {
    req,
    params,
    tagNum,
    tagText
} = "";
const qrcode = require('qrcode-terminal');
const str_replace = require('str_replace');
const gTTS = require('gtts');
const translate = require('translate-google');
const {
    id
} = require('translate-google/languages');
let msgRetryCounterMap;
msgRetryCounterMap = MessageRetryMap;
const logger = pino();
const useStore = !process.argv.includes('--no-store')
const store = useStore ? makeInMemoryStore({
    logger
}) : undefined
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
    store?.writeToFile('./baileys_store_multi.json')
}, 10_000)
const startSock = async () => {
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState('baileys_auth_info')
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        printQRInTerminal: true,
        auth: state,
        keys: makeCacheableSignalKeyStore(state.keys, pino({
            level: "error"
        })),
        msgRetryCounterMap,
        logger,
        //browser: Browsers.baileys('Desktop'),
        //browser: browsers.macOS('Desktop'),
        browser: ['chrome', 'Desktop', '10'],
        syncFullHistory: true,
        getMessage: async key => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
                return msg?.message || undefined
            }

            // only if store is present
            return {
                conversation: 'hello'
            }
        }
    })

    app.get('/send/:tagNum/:tagText', (req, res) => {
        const sendid = async () => {
            const now = new Date();
            let formattedDate = now.getFullYear() + "-" + addLeadingZeros(now.getMonth() + 1) + "-" + addLeadingZeros(now.getDate()) + " " + addLeadingZeros(now.getHours()) + ":" + addLeadingZeros(now.getMinutes()) + ":" + addLeadingZeros(now.getSeconds())
            await sock.sendMessage(`${req?.params?.tagNum}@s.whatsapp.net`, {
                text: `${formattedDate}${req?.params?.tagText}`
            })
        }
        sendid();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            text: "" + req.params.tagText + ""
        }));
    });
    app.get('/sendz/:tagNum/:tagText', (req, res) => {
        const sendid = async () => {
            const now = new Date();
            let formattedDate = now.getFullYear() + "-" + addLeadingZeros(now.getMonth() + 1) + "-" + addLeadingZeros(now.getDate()) + " " + addLeadingZeros(now.getHours()) + ":" + addLeadingZeros(now.getMinutes()) + ":" + addLeadingZeros(now.getSeconds())
            await sock.sendMessage(`${req?.params?.tagNum}@s.whatsapp.net`, {
                text: `${req?.params?.tagText}`
            })
        }
        sendid();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            text: "" + req.params.tagText + ""
        }));
    });
    app.post("/sendj/:tagNum/:tagText", (req, res) => {
        const {
            username,
            password
        } = req.body;
        console.log(`${username} is trying to login ..`);

        if (username === "clonerxyz" && password === "Gratisselamaasik") {
            return res.json({
                token: jsonwebtoken.sign({
                    user: "clonerxyz"
                }, JWT_SECRET),
            });
        }

        return res
            .status(401)
            .json({
                message: "The username and password your provided are invalid"
            });
    });
    app.get('/sendg/:tagNum/:tagText', (req, res) => {
        const sendid = async () => {
            const now = new Date();
            let formattedDate = now.getFullYear() + "-" + addLeadingZeros(now.getMonth() + 1) + "-" + addLeadingZeros(now.getDate()) + " " + addLeadingZeros(now.getHours()) + ":" + addLeadingZeros(now.getMinutes()) + ":" + addLeadingZeros(now.getSeconds())
            await sock.sendMessage(`${req?.params?.tagNum}@g.us`, {
                text: `${formattedDate}${req?.params?.tagText}`
            })
        }
        sendid();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            text: "" + req.params.tagText + ""
        }));
    });
    //sock.ev.on('call', (m) => { const _call = m[0]; if (_call.status == 'offer') { sock.rejectCall(_call.id); } })
    sock.ev.on('call', async (node) => {
        const {
            from,
            id,
            status
        } = node[0]
        if (status == 'offer') {
            const stanza = {
                tag: 'call',
                attrs: {
                    from: sock.user.id,
                    to: from,
                    id: sock.generateMessageTag(),
                },
                content: [{
                    tag: 'reject',
                    attrs: {
                        'call-id': id,
                        'call-creator': from,
                        count: '0',
                    },
                    content: undefined,
                }, ],
            }
            await sock.query(stanza)
        }
    })
    sock.ev.process(
        async (events) => {
            if (events['connection.update']) {
                const update = events['connection.update']
                const {
                    connection,
                    lastDisconnect
                } = update
                if (connection === 'close') {

                }
                if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.restartRequired) {
                    startSock()
                }
                if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.timedOut) {} else if (connection === 'open') {

                }
            }
            if (events['creds.update']) {
                await saveCreds()
            }
            if (events['chats.set']) {
                const {
                    chats,
                    isLatest
                } = events['chats.set']
                //console.log(`recv ${chats.length} chats (is latest: ${isLatest})`)
            }
            if (events['call']) {

            }
            if (events['messages.set']) {
                const {
                    messages,
                    isLatest
                } = events['messages.set']
                //console.log(`recv ${messages.length} messages (is latest: ${isLatest})`)
            }

            if (events['contacts.set']) {
                const {
                    contacts,
                    isLatest
                } = events['contacts.set']
                //console.log(`recv ${contacts.length} contacts (is latest: ${isLatest})`)
            }

            if (events['messages.upsert']) {
                const upsert = events['messages.upsert']
                //console.log('recv messages ', JSON.stringify(upsert, undefined, 2))
                if (upsert.type === 'notify') {
                    try {
                        for (const msg of upsert.messages) {
                            const body = (msg.message?.extendedTextMessage?.text);
                            const group = (msg.message?.conversation);
                            const namez = (msg.pushName);
                            const didi = (msg.key.remoteJid)
                            const didiz = (msg.key.participant)
                            const didix = str_replace('@s.whatsapp.net', '', didi)
                            const didiy = str_replace('@s.whatsapp.net', '', didiz)
                            const allc = (msg.key.remoteJid || msg.key.participant);
                            const didiw = str_replace('@s.whatsapp.net', '', allc)
                            const alls = (msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.message?.listResponseMessage?.title || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption)
                            const list = (msg.message?.listResponseMessage?.title);
                            const stsx = (msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption);
                            const btrx = (msg.message?.buttonsResponseMessage?.selectedDisplayText);
                            const sendMessageWTyping = async (msg, didi, options = {}) => {
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
                            //      console.log('error',err);
                            //}
                            //console.log('DONE');
                            //})

                            if (alls === 'menu' || alls === 'menus' || alls === 'Menus' || alls === '.menus' || alls === 'Help' || alls === 'help' || alls === 'Menu' || alls === '.menu' || alls === 'p' || alls === 'P') {
                                await sock.readMessages([msg.key])
                                //async function menn() {
                                exec('cat menu.txt', async (error, stdout, stderr) => {
                                    if (error) {
                                        console.log(`error: ${error.message}`);
                                        return;
                                    }
                                    if (stderr) {
                                        console.log(`stderr: ${stderr}`);
                                        return;
                                    }
                                    await sendMessageWTyping({
                                        text: `${stdout}`
                                    }, msg.key.remoteJid)
                                })

                            } else if (body === '1' || group === '1') {
                                await sock.readMessages([msg.key])
                                await sendMessageWTyping({
                                    text: "hallo"
                                }, msg.key.remoteJid, {
                                    quoted: msg
                                }, {
                                    ephemeralExpiration: WA_DEFAULT_EPHEMERAL
                                })
                            } else if (alls?.startsWith('tle') || alls?.startsWith('Tle')) {
                                await sock.readMessages([msg.key])
                                const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
                                translate('' + it + '', {
                                    from: 'auto',
                                    to: 'en'
                                }).then(async res => {
                                    console.log(res)
                                    await sendMessageWTyping({
                                        text: `${res}`
                                    }, msg.key.remoteJid)
                                }).catch(async err => {
                                    console.error(err)
                                    await sendMessageWTyping({
                                        text: `${err}`
                                    }, msg.key.remoteJid)
                                })
                            } else if (alls?.startsWith('tlj') || alls?.startsWith('Tlj')) {
                                await sock.readMessages([msg.key])
                                const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
                                translate('' + it + '', {
                                    from: 'auto',
                                    to: 'ja'
                                }).then(async res => {
                                    console.log(res)
                                    await sendMessageWTyping({
                                        text: `${res}`
                                    }, msg.key.remoteJid)
                                }).catch(async err => {
                                    console.error(err)
                                    await sendMessageWTyping({
                                        text: `${err}`
                                    }, msg.key.remoteJid)
                                })
                            } else if (alls?.startsWith('tli') || alls?.startsWith('Tli')) {
                                await sock.readMessages([msg.key])
                                const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
                                translate('' + it + '', {
                                    from: 'auto',
                                    to: 'id'
                                }).then(async res => {
                                    console.log(res)
                                    await sendMessageWTyping({
                                        text: `${res}`
                                    }, msg.key.remoteJid)
                                }).catch(async err => {
                                    console.error(err)
                                    await sendMessageWTyping({
                                        text: `${err}`
                                    }, msg.key.remoteJid)
                                })
                            } else if (alls?.startsWith('how') || alls?.startsWith('How')) {
                                await sock.readMessages([msg.key])
                                exec('cat menu.txt', async (error, stdout, stderr) => {
                                    if (error) {
                                        console.log(`error: ${error.message}`);
                                        //return;
                                    }
                                    if (stderr) {
                                        console.log(`stderr: ${stderr}`);
                                        //return;
                                    }

                                    await sendMessageWTyping({
                                        text: `${stdout}`
                                    }, msg.key.remoteJid)
                                })
                            } else if (alls?.startsWith('sts') || alls?.startsWith('Sts')) {
                                await sock.readMessages([msg.key])
                                const name = Math.random().toString(36).slice(8);
                                const pathget = (msg.message?.imageMessage?.mimetype || msg.message?.videoMessage?.mimetype)
                                const size = (msg.message?.videoMessage?.fileLength)
                                console.log(pathget)
                                if (size > 5000000) {
                                    await sendMessageWTyping({
                                        text: `kegedean mas file nya`
                                    }, msg.key.remoteJid)
                                } else {

                                    const path = str_replace('image/', '', pathget);
                                    const pathclean = str_replace('video/', '', path);
                                    const buffer = await downloadMediaMessage(
                                        msg,
                                        'buffer', {}, {
                                            //logger,
                                            // pass this so that baileys can request a reupload of media
                                            // that has been deleted
                                            reuploadRequest: sock.updateMediaMessage
                                        }
                                    )

                                    // save to file
                                    await writeFile(`img/${name}.${pathclean}`, buffer)
                                    //await writeFile(`/root/mnt/home/clonerxyz/botwatest/img/${name}.${pathclean}`, getMedia)
                                    const folder = ('img/')
                                    //exec('ffmpeg -i '+folder+name+'.'+pathclean+' '+folder+name+'.webp', async(error, stdout, stderr) => {
                                    exec('ffmpeg -i ' + folder + name + '.' + pathclean + ' -v quiet -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -compression_level 6 -loop 0 -preset default -an -vsync 0  ' + folder + name + '.webp', async (error, stdout, stderr) => {
                                        if (error) {
                                            console.log(`error: ${error.message}`);
                                            //return;
                                        }
                                        if (stderr) {
                                            console.log(`stderr: ${stderr}`);
                                            //return;
                                        }
                                        if (fs.existsSync(`img/${name}.webp`)) {

                                            await sock.sendMessage(msg.key.remoteJid, {
                                                sticker: fs.readFileSync(`img/${name}.webp`)
                                            });

                                        } else {
                                            await sendMessageWTyping({
                                                text: `kegedean mas file nya`
                                            }, msg.key.remoteJid)
                                        }
                                    })
                                    //await delay(6000)
                                }

                            } else if (alls?.startsWith('git') || alls?.match(re)) {
                                await sock.readMessages([msg.key])
                                //const text = (body || group)
                                const axios = require('axios');
                                const lang = ('id')
                                async function doPostRequest() {
                                    let res = await axios.post('https://simsimi.vn/web/simtalk', {
                                        lc: `${lang}`,
                                        text: `${alls}`
                                    }, {
                                        headers: {
                                            'Content-Type': 'multipart/form-data'
                                        }
                                    })
                                    let data = res.data;
                                    const str = data?.success;
                                    const str2 = str.replace(/sim.*|ing|bi|ol|cok|sat|kau|eng/ig, "");
                                    //await sock.readMessages([msg.key])
                                    await sock.sendMessage(msg.key.remoteJid, {
                                        text: `${str2} `
                                    }, {
                                        quoted: msg
                                    })
                                }
                                doPostRequest();
                            } else if (alls?.startsWith('https://vm.') || alls?.startsWith('https://vt.') || alls?.startsWith('https://www.tiktok.com')) {
                                const axios = require('axios');
                                //const Cookies = require('cookiejar
                                const {
                                    JSDOM
                                } = require("jsdom");
                                const cheerio = require("cheerio");
                                await sendMessageWTyping({
                                    text: `jika lag tunggu beberapa saat atau coba lagi `
                                }, msg.key.remoteJid)
                                async function doPostRequest() {
                                    try {
                                        //let res2 = await axios.post('https://api.ttsave.app/',{id:`${alls}`,hash:`018e1cd2037e5addd7ab1c6a32f917a3`,mode:`video`,locale:`en`,loading_indicator_url:`https://ttsave.app/images/slow-down.gif`,unlock_url:`https://ttsave.app/en/unlock`})
                                        let res2 = await axios.post('https://tikdownloader.io/api/ajaxSearch', {
                                            q: `${alls}`,
                                            lang: `en`
                                        }, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        })
                                        let dataz = res2.data.data;
                                        //let datax = res2.data.id;
                                        const str2 = dataz;
                                        const str3 = new JSDOM(str2);
                                        const str4 = str3.window.document;
                                        const str5 = str4.querySelector(".dl-action a");
                                        //const str6 = str5 ? str5.dataset.href : null;
                                        //await sock.sendMessage(msg.key.remoteJid, { text: `${str5} ` }, { quoted: msg })
                                        await sendMessageWTyping({
                                            video: {
                                                url: `${str5}`
                                            },
                                            mimetype: 'video/mp4'
                                        }, msg.key.remoteJid, {
                                            quoted: msg
                                        })
                                    } catch (error) {
                                        console.error(error);
                                    }

                                }
                                doPostRequest();
                            }



                        }

                    } catch (e) {
                        console.log(e);
                    }
                }

            }
        }
    )

    return sock
}

startSock()
http.listen(port, () => {
    console.log(`server is runn`);
});
