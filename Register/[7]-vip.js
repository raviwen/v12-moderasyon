const { MessageEmbed } = require('discord.js');
const db = require('quick.db')
const raviwen = require('../Manager/Raviwen.json')
const Main = require('../Manager/Main.json')
const moment = require('moment')

module.exports.config = { 
    name: 'vip',
    aliases: ['vip-ver','vipver']
}

module.exports.raviwen = async(client, message, args, config) => {

    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)
    //
    if(![raviwen.Yetkili.AbilityYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.'))
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(yanlis.setDescription(`Bir üye belirtmen gerekiyor.`))

    let atılmaay = moment(Date.now()).format("MM")
    let atılmagün = moment(Date.now()).format("DD")
    let atılmasaat = moment(Date.now()).format("HH:mm:ss")
    let kayıttarihi = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    moment.locale("tr")

    await uye.roles.add(raviwen.Roller.VIP)
    message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic:true})).setDescription(`Kişiye başarıyla <@&${raviwen.Roller.VIP}> rolü verildi.`))
    client.channels.cache.get(raviwen.Log.RegisterLog).send(new MessageEmbed().setColor('RANDOM').setDescription(`Bir üyeye VIP Rolü verildi. \n Rolü Veren : ${message.author} (\`${message.author.id}\`) \n Rolü Alan: ${uye}(\`${uye.id}\`) \n Verilen Roller: <@&${raviwen.Roller.VIP}> \n Tarih: \`${kayıttarihi}\``))
    
    db.push(`isim.${uye.id}`, {
        userID: uye.id,
        isimleri: uye.user.username,
        role: raviwen.Roller.VIP,
        teyitciid: message.author.id,
        teyitcisim: message.author.username
    })
};