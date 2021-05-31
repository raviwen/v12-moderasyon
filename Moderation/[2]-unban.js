const { MessageEmbed } = require('discord.js');
const Main = require('../Manager/Main.json')
const raviwen = require('../Manager/Raviwen.json')
const moment = require('moment')

module.exports.config = { 
    name: 'unban',
    aliases: ['bankaldır','ban-kaldır']
}

module.exports.raviwen = async(client, message, args, config) => {
    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.BanYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.'))

    let uye = args[0]
    let sebep = args.splice(1).join(' ');
    if(!uye) return message.channel.send(embed.setDescription(`Yanlış veya sunucumuzda banlı olmayan bir üye belirttiniz. (Sadece ID)`)).then(x => x.delete({timeout: 2000}))
    if(!sebep) return message.channel.send(embed.setDescription(`Bir sebep belirtmen gerekiyor.`)).then(x => x.delete({timeout: 2000}))
   message.guild.fetchBans().then(yasaklar => {
    if(yasaklar.size == 0) return message.channel.send(embed.setDescription(`Sunucuda banlı üye bulunmuyor.`)).then(x => x.delete({timeout: 2000}))
    let yasakliuye = yasaklar.find(yasakli => yasakli.user.id == uye)
    if(!yasakliuye) return message.channel.send(embed.setDescription(`Üye sunucuda yasaklı değil.`)).then(x => x.delete({timeout: 2000}))
})
    let atılmaay = moment(Date.now()).format("MM")
    let atılmagün = moment(Date.now()).format("DD")
    let atılmasaat = moment(Date.now()).format("HH:mm:ss")
    let banatılma = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    moment.locale("tr")


    const kaldırma = embed.setDescription(`
    \`Üyenin yasağı kaldırıldı.\` \n
    Yetkili: ${message.author}(\`${message.author.id}\`)
    Üye: <@${uye}>(\`${uye}\`)
    Sebep: \`${sebep}\`
    Tarih: \`${banatılma}\`
    `)
    .setFooter(Main.Footer)
    .setThumbnail(message.guild.iconURL({ dynamic: true}))
    client.channels.cache.get(raviwen.Log.BanLog).send(kaldırma)

    message.guild.members.unban(uye)
};