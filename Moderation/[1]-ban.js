const { MessageEmbed } = require('discord.js');
const Main = require('../Manager/Main.json')
const raviwen = require('../Manager/Raviwen.json')
const moment = require('moment')
const db = require('quick.db')


module.exports.config = { 
    name: 'ban',
    aliases: ['yasakla']
}

module.exports.raviwen = async(client, message, args, config) => {
    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)
    
    //
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.BanYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.')).then(x => x.delete({timeout: 2000}))
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(yanlis.setDescription('Belirttiğiniz üyeyi bulamadım.')).then(x => x.delete({timeout: 2000}))
    let sebep = args.splice(1).join(" ")
    if(!sebep) return message.channel.send(yanlis.setDescription('Bir sebep belirtmen gerekiyor.')).then(x => x.delete({timeout: 2000}))

    let atılmaay = moment(Date.now()).format("MM")
    let atılmagün = moment(Date.now()).format("DD")
    let atılmasaat = moment(Date.now()).format("HH:mm:ss")
    let banatılma = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    moment.locale("tr")

    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.add(`cezapuan.${uye.id}.${message.guild.id}`, +40);
    let cpuan = db.get(`cezapuan.${uye.id}.${message.guild.id}`);

    db.add(`cezaid.${message.guild.id}`, +1);
    db.push(`moderasyon.${uye.id}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID,Komut: 'Sunucudan Yasaklandı',Puan: '+40', Tarih: banatılma, Sebep: sebep, Süre: 'BAN'})
    db.set(`moderasyon.${cezaID}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID,Komut: 'Sunucudan Yasaklandı',Puan: '+40', Tarih: banatılma, Sebep: sebep, Süre: 'BAN'})

    const CezaLog = new MessageEmbed()
    .setFooter(Main.Footer)
    .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
    .setColor('RANDOM')
    .setDescription(`
    \`Üye sunucudan yasaklandı.\` \n\n
    Ceza ID: \`${cezaID}\`
    Yetkili: ${message.author} (\`${message.author.id}\`)
    Cezalı: ${uye} (\`${uye.id}\`)
    Sebep: \`${sebep}\`
    Tarih: \`${banatılma}\`
    `)
    client.channels.cache.get(raviwen.Log.BanLog).send(CezaLog)
    client.channels.cache.get(raviwen.Log.CezaPuanLog).send(`${message.author} Adlı yetkili ${uye} adlı üyeye uyguladığı işlemle +40 Puan eklendi. \n Uyenın toplam puanı : \`${cpuan || 0}\``)

    uye.ban({ reason: `#${cezaID} ile ${message.author.id} ID'li yetkili tarafından banlandı.`})
};