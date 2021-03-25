const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   GroupSettingChange,
   waChatKey,
   mentionedJid,
   processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal") 
const moment = require("moment-timezone") 
const fs = require("fs") 
const { color, bgcolor } = require('./lib/color')
const { help } = require('./lib/help')
const { donar } = require('./lib/donar')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
//const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const bienvenida = JSON.parse(fs.readFileSync('./src/bienvenida.json'))
//const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
//const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:1.0.1\n' 
            + 'FN:MR8UG Editor\n' 
            + 'ORG: Pengembang XBot;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=50247648466:+502 4764-8466\n' 
            + 'END:VCARD' 
prefix = '#'
blocked = []
contador=0   

/********** LOAD FILE **************/

/********** END FILE ***************/
  
const time = moment().tz('America/Guatemala').format("HH:mm:ss")
const arregloMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const mes = arregloMeses[moment().format('MM') - 1]
const config = {
    XBOT: 'MR8UG', 
    instagram: 'https://www.instagram.com/carlos.ecampos/', 
    numero: '50247648466', //ingresa tu numero de telefon incluyendo el codigo de pais sin el + -> <502 12345678>
    youtube: 'https://soundcloud.com/mr8ug/fly-day-chinatown-mr8ug-edit', 
    whatsapp: 'Comming soon', 
    fecha: `Fecha: ${moment().format('DD')} ${mes} ${moment().format('YYYY')}`,
    hora: time
}

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Hora ${pad(minutes)} Minuto ${pad(seconds)} Segundo`
}


const { fecha, hora, instagram, whatsapp, youtube, numero, ontime } = config



const { exec } = require("child_process")

const client = new WAConnection()

client.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ${time} ] QR generado, escanee con Whatsapp Web QR Reader...`)
})

client.on('credentials-updated', () => {
   const authInfo = client.base64EncodedAuthInfo()
   console.log(`Credenciales actualizadas!`)

   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')

client.connect();

// client.on('user-presence-update', json => console.log(json.id + ' presence is => ' + json.type)) || console.log(`${time}: Bot by ig:@affis_saputro123`)

client.on('group-participants-update', async (anu) => {
		if (!bienvenida.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				cadena = `Hola @${num.split('@')[0]}\Bienvenido al grupo *${mdata.subject}* tome asiento...`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: cadena, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				cadena = `En paz descanse, soldado🥳 @${num.split('@')[0]} espero vuelva.²`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: cadena, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('America/Guatemala').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			msgs = {
				wait: '❬❗❭ Awanta, estoy chiquito',
				success: '️❬ ✔ ❭ Nicee 🖤',
				error: {
					stick: 'F, ya la cagué verdad?, intenta de nuevo. ',
					Iv: 'Enlace invalido'
				},
				only: {
					group: '❬❗❭ SOLO GRUPOS ',
					ownerG: '❬❗❭ SOLO JEFES ',
					ownerB: '❬❗❭  SOLO JEFES ',
					admin: '❬❗❭ SOLO ADMINS ',
					Badmin: '❬❗❭ EL BOT DEBE SER ADMIN '
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["50236077811@s.whatsapp.net"] //numero de servidor
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupDesc = isGroup ? groupMetadata.desc : ''
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? bienvenida.includes(from) : false
			//const isNsfw = isGroup ? nsfw.includes(from) : fals
		 //= isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (cadena) => {
				client.sendMessage(from, cadena, text, {quoted:mek})
			}
			const sendMess = (hehe, cadena) => {
				client.sendMessage(hehe, cadena, text)
			}
			const mentions = (cadena, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, cadena.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, cadena.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'puedo':
					bisakah = body.slice(1)
					const bisa =['Pues si wey no mames','Hijole no se va poder','Intenta de nuevo']
					const keh = bisa[Math.floor(Math.random() * bisa.length)]
					client.sendMessage(from, 'Pregunta : *'+bisakah+'*\n\Respuesta : '+ keh, text, { quoted: mek })
					break
				case 'cuando':
					kapankah = body.slice(1)
					const kapan =['Mañana', 'Pasado mañana', 'En un rato', '4 días más', '5 días más', '6 días más', '1 semana mas', '2 semanas más', '3 semanas más' , '1 mes más', '2 meses nuevamente', '3 meses nuevamente', '4 meses nuevamente', '5 meses nuevamente', '6 meses nuevamente', '1 año más', '2 años más', ' 3 años más ',' 4 años más ',' 5 años más ',' 6 años más ',' 1 siglo más ',' 3 días más ']
					const koh = kapan[Math.floor(Math.random() * kapan.length)]
					client.sendMessage(from, 'Pregunta : *'+kapankah+'*\n\Respuesta : '+ koh, text, { quoted: mek })
					break
				case 'sinotalvez':
					apakah = body.slice(1)
					const apa =['Si','No','Puede ser','Prueba de nuevo']
					const kah = apa[Math.floor(Math.random() * apa.length)]
					client.sendMessage(from, 'Pregunta : *'+apakah+'*\n\Respuesta : '+ kah, text, { quoted: mek })
					break
				case 'probabilidad':
					rate = body.slice(1)
					const ra =['4','9','17','28','34','48','59','62','74','83','97','100','29','94','75','82','41','39']
					const te = ra[Math.floor(Math.random() * ra.length)]
					client.sendMessage(from, 'Pregunta : *'+rate+'*\n\Respuesta : '+ te+'%', text, { quoted: mek })
					break
				case 'speed':
				case 'ping':
					await client.sendMessage(from, `Pong!!!!\nSpeed: ${processTime(t, moment())} _Second_`)
					break
				case 'help': 
				case 'menu':
					client.sendMessage(from, help(prefix), text)
					break
				
				case 'donate':
					client.sendMessage(from, donar(), text)
					break
				
				case 'info':
					me = client.user
					uptime = process.uptime()
					cadena = `*Nombre de BOT* : ${me.name}\n*OWNER* : *MR8UG*\n*AUTHOR* : MR8UG\n*Numero de BOT* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Total Block Contact* : ${blocked.length}\n*El bot esta activo* : ${kyun(uptime)}`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: cadena, contextInfo:{mentionedJid: [me.jid]}})
					break
				case 'blocklist': 
					cadena = '𝗕𝗟𝗢𝗖𝗞 𝗟𝗜𝗦𝗧 :\n'
					for (let block of blocked) {
						cadena += `┣➢ @${block.split('@')[0]}\n`
					}
					cadena += `𝗧𝗼𝘁𝗮𝗹 : ${blocked.length}`
					client.sendMessage(from, cadena.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
                
                              
                case 'verdad':
					const trut =['¿Qué es lo que más miedo te da? ¿Por qué?','¿Alguna vez has engañado a tu pareja?','¿Has hecho una escena ridícula en un parque?','¿Has conducido borracho alguna vez?','¿Has estafado a alguien?','¿Has robado algo alguna vez?','¿Has estado en una comisaría detenido alguna vez?','¿Alguna vez has hablado contigo mismo en voz alta?','¿Has escuchado o visto algo que no existe?','¿Has tenido la sensación de no estar solo cuando no hay nadie más en la habitación? ¿Cuándo?','¿Has mentido alguna vez? ¿Cuál ha sido la mentira más elaborada que has dicho y porque tuviste que hacerlo?','¿Te han humillado alguna vez? ¿Cuándo?','¿Has hecho trampa en la escuela alguna vez?','¿Te ha gustado alguno de los profesores de la escuela? ¿Cuál?','¿Te has escapado de clases en alguna oportunidad?','¿Cómo crees que será la boda de tus sueños?','¿Cuál es tu película favorita y por qué?','¿Cuál es la parte de tu cuerpo que más te gusta? ¿Y la que menos te gusta?','¿Qué es lo que te molesta de tu pareja?','El chico que te gusta te ha invitado a salir. ¿A dónde te gustaría ir por primera vez?','¿Cuál es el mayor tiempo que has estado sin bañarte y por qué razón?','¿Cuál es el mayor tiempo que has estado sin bañarte y por qué razón?','¿Cuál ha sido el mejor sueño que has tenido dormido? ¿Y despierto?','¿Qué cosas de niño pequeño aún haces?','¿Qué cosas más te molestan de tus padres?','¿Cuál ha sido la anécdota más absurda que te han contado tus abuelos?','¿Cuál es tu comida preferida y quién la ha preparado?','¿Cuál es la parte del cuerpo que miras en alguien del sexo opuesto?','¿Quién es tu cantante favorito?','¿Qué cambiarías de tu aspecto físico?','¿Qué película de Pixar o Disney es tu favorita y por qué?','¿Cuál es el primer recuerdo de tu infancia?','¿Cuál es el mejor recuerdo de tu vida?','¿Cuál es tu mayor secreto?','¿Qué edad tenías cuando diste tu primer beso?','¿Cambiarías de novio o novia por 1 millón de dólares?','¿En qué condiciones le mentirías a tu mejor amigo?','¿Alguna vez has dicho una mentira mientras jugabas a “verdad o reto”? ¿Cuál?','¿Podrías estar una semana sin tu celular?','¿Qué ha sido lo más horrible que has dicho en público?','¿Te has extraviado alguna vez de niño?','¿Qué se lo peor que has hecho en tu vida?','¿Qué es lo más loco que has hecho sin que tus padres se enteren?','¿Qué es en lo primero que piensas cuando te despiertas?','¿Qué es lo último que piensas por las noches?','¿Has ayudado a alguien sin conocerlo alguna vez?','¿Qué harías si ganaras la lotería hoy mismo?','¿Qué harías si te enteraras de que te queda una semana de vida?','Si fueras invisible, ¿a dónde irías?','Si pudieras volar, ¿a dónde viajarías?','Si pudieras viajar en el tiempo, ¿a dónde irías? ¿y en el espacio?','¿Cuánto tiempo has tardado en comer un plato de comida muy desagradable y quién te lo ha preparado?','¿Qué comida te produce náuseas?','¿Qué harías si te enteras de que el niño que te gusta se mudará la semana entrante a otro país?','¿Cómo reaccionarías si mañana suspenden las clases para siempre?','Si te enteras de que morirás mañana, ¿a quién visitarías y qué le dirías?','Si pudieras hablar con algún familiar que ha fallecido, ¿qué le preguntarías?','¿Cómo reaccionarías si encontraras mucho dinero en la calle pero con los datos del dueño para devolverlo?','¿Quién ha sido el peor profesor y por qué?','¿Qué actor o cantante famoso te parece lindo y por qué?','Entre los presentes, ¿quién te parece lindo y por qué?']
					const ttrth = trut[Math.floor(Math.random() * trut.length)]
					truteh = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
					client.sendMessage(from, truteh, image, { caption: '*Verdad*\n\n'+ ttrth, quoted: mek })
					break
				case 'reto':
					const dare =['Aun no tengo retos programados.. pero prueba con #verdad']
					const der = dare[Math.floor(Math.random() * dare.length)]
					tod = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
					client.sendMessage(from, tod, image, { quoted: mek, caption: '*Reto*\n\n'+ der })
					break				
				
                
                case 'bug':
                     const pesan = body.slice(5)
                      if (pesan.length > 300) return client.sendMessage(from, 'Mucho texto... Maximo 300 caracteres', msgType.text, {quoted: mek})
                        var nomor = mek.participant
                       const teks1 = `*[REPORT]*\nNomor : @${nomor.split("@s.whatsapp.net")[0]}\nPesan : ${pesan}`
                      var options = {
                         text: teks1,
                         contextInfo: {mentionedJid: [nomor]},
                     }
                    client.sendMessage('50247648466@s.whatsapp.net', options, text, {quoted: mek})
                    reply('Se han informado problemas al propietario del Bot, no se respondera a los informes falsos.')
                    break
                
				
				case 'qrmaker':
					if (args.length < 1) return reply('Y el texto? .-.')
                    cadena = `${body.slice(9)}`
                    //if (cadena.length > 10) return client.sendMessage(from, 'Mucho texto, maximo 10 letras', text, {quoted: mek})
                    buff = await getBuffer(`https://docs-jojo.herokuapp.com/api/qrcode?text=${cadena}`, {method: 'get'})
                    client.sendMessage(from, buff, image, {quoted: mek, caption: `${cadena}`})
			     	
					break
				
                
                
                
					 
				case 'ytmp4':
					if (args.length < 1) return reply('Y el zelda del vidio? .-.')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(msgs.error.Iv)
					anu = await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					cadena = `*Title* : ${anu.title}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: cadena})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {mimetype: 'video/mp4', filename: `${anu.title}.mp4`, quoted: mek})
					break
				case 'ytmp3':
					if (args.length < 1) return reply('Y el zelda del vidio? .-.')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(msgs.error.Iv)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/ytmp3?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					cadena = `*Title* : ${anu.title}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: cadena})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mpeg', filename: `${anu.title}.mp3`, quoted: mek})
					break

				
				
				case 'shorturl':
					if (args.length < 1) return reply('y el texto?')
					if(!isUrl(args[0]) ) return reply(msgs.error.Iv)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/shorturl-at?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					//buffer = await getBuffer(anu.result)
					reply(anu.result)
					break
                
				case 'web2pdf':
					if (args.length < 1) return reply('y el texto?')
					if(!isUrl(args[0]) ) return reply(msgs.error.Iv)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/shorturl-at?url=https://docs-jojo.herokuapp.com/api/ssweb_pdf?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					//buffer = await getBuffer(anu.result)
					//client.sendMessage(from, 'PDF: https://docs-jojo.herokuapp.com/api/ssweb_pdf?url='+args[0], text, {quoted: mek})
					reply(anu.result)
					break
                
				case 'ocr': 
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(msgs.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(cadena => {
								reply(cadena.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Enviar foto con description ${prefix}𝗼𝗰𝗿')
					}
					break
				case 'stiker': 
				case 'sticker':
				case 's':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Incio : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(msgs.error.stick)
							})
							.on('end', function () {
								console.log('Terminado')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(msgs.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`F, vuelve a intentarlo`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
							} else {
						reply(`Enviar imagen con texto ${prefix}sticker como respuesta o etiqueta de imagen`)
					}
					break
				case 'getses':
					if (!isOwner) return reply(msgs.only.ownerB)
						const sesPic = await client.getSnapshot()
						client.sendFile(from, sesPic, 'session.png', '^_^...', id)
					break	
				case 'gtts':	
				case 'tts':
					if (args.length < 1) return client.sendMessage(from, 'Codigo de idioma necesario', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, 'Cual es el texto que quieres que diga?', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 300
					? reply('Chucha tampoco tan largo bro😤')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('F, vuelve a intentarlo')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(msgs.only.ownerB)
					prefix = args[0]
					reply(`Prefijo cambiado correctamente: ${prefix}`)
					break 
				
				
				
				case 'linkgc':
				    if (!isGroup) return reply(msgs.only.group)
				    //if (!isBotGroupAdmins) return reply(msgs.only.Badmin)
				    linkgc = await client.groupInviteCode (from)
				    yeh = `https://chat.whatsapp.com/${linkgc}\n\nLink de Grupo *${groupName}*`
				    client.sendMessage(from, yeh, text, {quoted: mek})
			        break

				case 'tagall':
					if (!isGroup) return reply(msgs.only.group)
					//if (!isGroupAdmins) return reply(msgs.only.admin)
					members_id = []
					cadena = (args.length > 1) ? body.slice(8).trim() : ''
					cadena += '\n\n'
					for (let mem of groupMembers) {
						cadena += `┣➥ @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(cadena, members_id, true)
					break
				
                    
				case 'admin':
				case 'owner':
				case 'creator':
					client.sendMessage(from, {displayname: "ELJEFE", vcard: vcard}, MessageType.contact, { quoted: mek})
					client.sendMessage(from, 'Eh perro, no me spamee',MessageType.text, { quoted: mek} )
					break    
				
				case 'listadmin':
					if (!isGroup) return reply(msgs.only.group)
					cadena = `Listar Administradores de Grupo *${groupMetadata.subject}*\n𝗧𝗼𝘁𝗮𝗹 : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						cadena += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(cadena, groupAdmins, true)
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('Respuesta/Etiqueta sticker')
					reply(msgs.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('F, intenta de nuevo')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'duh '})
						fs.unlinkSync(ran)
					})
					break

				case 'deshabilitados':
					reply('* Accion deshabilitada por el dueño para ahorrar recursos...* ')
					break

				default:
					if (isGroup && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), 'Commando sin Registro: ', color(sender.split('@')[0]))
						if (contador >=150){
							reply('Si no me usan me voy a mimir >:u')
							contador=0
						}else{
							contador=contador+1
						}

					}
					break
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
