const { MessageEmbed } = require('discord.js');
const Main = require('../Manager/Main.json')
const raviwen = require('../Manager/Raviwen.json')
const moment = require('moment')
const ms = require('ms')
const db = require('quick.db')


module.exports.config = { 
    name: 'jail',
    aliases: ['cezalandır']
}

module.exports.raviwen = async(client, message, args, config) => {

    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.jailYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.')).then(x => x.delete({timeout: 2000}))
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(yanlis.setDescription('Belirttiğiniz üyeyi bulamadım.')).then(x => x.delete({timeout: 2000}))
    let zaman = args[1]
    if(!zaman) return message.channel.send(yanlis.setDescription(`Bir zaman belirtmen gerekiyor.`)).then(x => x.delete({timeout: 2000}))
    let sebep = args.splice(2).join(" ")
    if(!sebep) return message.channel.send(yanlis.setDescription('Bir sebep belirtmen gerekiyor.')).then(x => x.delete({timeout: 2000}))

    let timereplace = args[1];
    let time = timereplace.replace(/y/, ' Yıl').replace(/d/, ' Gün').replace(/s/, ' Saniye').replace(/m/, ' Dakika').replace(/h/, ' Saat')
    var tarih = new Date(Date.now())
    var tarih2 = ms(timereplace)
    var tarih3 = Date.now() + tarih2
    let atılmaay = moment(Date.now()).format("MM")
    let atılmagün = moment(Date.now()).format("DD")
    let atılmasaat = moment(Date.now()).format("HH:mm:ss")
    let bitişay = moment(tarih3).format("MM")
    let bitişgün = moment(tarih3).format("DD")
    let bitişsaat = moment(tarih3).format("HH:mm:ss")
    let jailatılma = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    let jailbitiş = `\`${bitişgün} ${bitişay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${bitişsaat}\``
    moment.locale("tr")

    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.add(`cezapuan.${uye.id}.${message.guild.id}`, +28);
    let cpuan = db.get(`cezapuan.${uye.id}.${message.guild.id}`);
    db.add(`cezaid.${message.guild.id}`, +1);
    db.push(`moderasyon.${uye.id}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID, Komut: 'JAİL',Puan: '+28', Tarih: jailatılma, Sebep: sebep, Süre: time})
    db.set(`moderasyon.${cezaID}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID, Komut: 'JAİL',Puan: '+28', Tarih: jailatılma, Sebep: sebep, Süre: time})

    db.set(`cezalı.${uye.id}.${message.guild.id}`, 'cezalı')
    db.set(`süre.${uye.id}.${message.guild.id}`, zaman)

    await uye.roles.cache.has(raviwen.Roller.Booster) ? uye.roles.set([raviwen.Roller.Booster, raviwen.Roller.Jailed]) : uye.roles.set([raviwen.Roller.Jailed])
    let baban = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
    .setFooter(`${uye.user.username} Adlı üyenin toplam ${cpuan} Bulunuyor.`)
    .setThumbnail(message.guild.iconURL({dyanmic:true}))
    .setTitle(`Bir üye cezalandırıldı..`)
    .setDescription(`
    Ceza ID: \`#${cezaID}\`
    Yetkili: ${message.author} (\`${message.author.id}\`)
    Cezalı: ${uye} (\`${uye.id}\`)
    Süre: \`${zaman}\`
    Sebep: \`${sebep}\`
    Jail Atılma: \`${jailatılma}\`
    Jail Bitiş: \`${jailbitiş}\`
    `)
    client.channels.cache.get(raviwen.Log.JailLog).send(baban)
    message.channel.send(yanlis.setDescription(`Üyeyi başarıyla cezalandırıldı.`))

    setTimeout(async() => {
        let cezalı = db.fetch(`cezalı.${uye.id}.${message.guild.id}`)
        if(!cezalı) return;
        if(cezalı == 'cezalı') {
            client.channels.cache.get(raviwen.Log.MuteLog).send(new MessageEmbed().setDescription(`${uye} Kişinin jail cezası sona erdi. Tekrardan kayıt olup ailemize kayıt olabilir.`))
            await db.delete(`cezalı.${uye.id}.${message.guild.id}`)
            await db.delete(`süre.${uye.id}.${message.author.id}`)
            await uye.roles.remove(raviwen.Roller.Jailed)
            await uye.roles.add(raviwen.Register.unreg)
        }
    }, ms(zaman));
};
