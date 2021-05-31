const { MessageEmbed } = require('discord.js');
const raviwen = require('../Manager/Raviwen.json')
const Main = require('../Manager/Main.json')
const moment = require('moment')
module.exports.config = { 
    name: 'kayıtsız',
    aliases: ['unreg']
}

module.exports.raviwen = async(client, message, args, config) => {

    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)
    
    //
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.registerYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.'))
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(yanlis.setDescription(`Bir üye belirtmen gerekiyor.`))
    if(uye.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(yanlis.setDescription('Belirttiğiniz kullanıcı sizden Üst veya Aynı konumda bulunuyor.'))
    
    let atılmaay = moment(Date.now()).format("MM")
    let atılmagün = moment(Date.now()).format("DD")
    let atılmasaat = moment(Date.now()).format("HH:mm:ss")
    let kayıttarihi = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    moment.locale("tr")

    await uye.setNickname(uye.user.username)
    await uye.roles.cache.has(raviwen.Roller.Booster) ? uye.roles.set([raviwen.Roller.Booster, raviwen.Register.unreg]) : uye.roles.set([raviwen.Register.unreg]);

    message.channel.send(new MessageEmbed().setFooter(message.author.username, message.author.avatarURL({ dynamic: true })).setDescription(`Kişi başarıyla kayıtsıza atıldı.`))
    client.channels.cache.get(raviwen.Log.RegisterLog).send(new MessageEmbed().setColor('RANDOM').setDescription(`Bir üye kayıtsıza atıldı. \n Kayıtsıza Atan: ${message.author} (\`${message.author.id}\`) \n Kayıtsıza Atılan: ${uye}(\`${uye.id}\`) \n Verilen Roller: <@&${raviwen.Register.unreg}> \n Tarih: \`${kayıttarihi}\``))
}