const { MessageEmbed } = require('discord.js');
const Main = require('../Manager/Main.json')
const raviwen = require('../Manager/Raviwen.json')
const moment = require('moment')
const db = require('quick.db')


module.exports.config = { 
    name: 'say',
    aliases: ['sunucu-istatik']
}

module.exports.raviwen = async(client, message, args, config) => {
    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)

    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.BanYT,raviwen.Yetkili.jailYT,raviwen.Yetkili.muteYT,raviwen.Yetkili.vmuteYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.')).then(x => x.delete({timeout: 2000}))


    const taglı = message.guild.members.cache.filter(r => r.user.username.includes(Main.Tag)).size
    const online = message.guild.members.cache.filter(r => r.presence.status != 'offline').size
    const toplam = message.guild.memberCount
    const ses = message.guild.channels.cache.filter(channel => channel.type == 'voice').map(channel => channel.members.size).reduce((a,b) => a + b)
    const booster = message.guild.roles.cache.get(raviwen.Roller.Booster).members.size

    message.channel.send(new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
    .setFooter(message.author.username, message.author.avatarURL({dynamic:true}))
    .setDescription(`**Sunucu İstatikleri**
    \`˃\` Sunucumuz da toplam **${toplam}** üye bulunuyor.
    \`˃\` Sunucumuz da toplam **${online}** aktif üye bulunuyor.
    \`˃\` Ses kanallarında **${ses}** üye sohbet ediyor.
    \`˃\` Tagımızı alan **${taglı}** üye bulunuyor.
    \`˃\` Boost basarak destek olan **${booster}** üye bulunuyor.
    `)
    
    )
};