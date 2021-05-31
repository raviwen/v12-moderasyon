const { MessageEmbed } = require('discord.js');
const Main = require('../Manager/Main.json')
const raviwen = require('../Manager/Raviwen.json')
const moment = require('moment')
const ms = require('ms')
const db = require('quick.db')


module.exports.config = { 
    name: 'unjail',
    aliases: ['un-jail','cezakaldır']
}

module.exports.raviwen = async(client, message, args, config) => {

    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.jailYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.'))
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(yanlis.setDescription('Belirttiğiniz üyeyi bulamadım.')).then(x => x.delete({timeout: 2000}))
    let sebep = args.splice(1).join(" ")
    if(!sebep) return message.channel.send(yanlis.setDescription('Bir sebep belirtmen gerekiyor.')).then(x => x.delete({timeout: 2000}))
    let cezalı = db.fetch(`cezalı.${uye.id}.${message.guild.id}`)
    if(cezalı == 'cezalı') {
    await db.delete(`cezalı.${uye.id}.${message.guild.id}`)
    await db.delete(`süre.${uye.id}.${message.guild.id}`)
    client.channels.cache.get(raviwen.Log.MuteLog).send(new MessageEmbed().setDescription(`${uye} Kişisinin mutesi ${message.author} Tarafından kaldırıldı.`))
    await uye.roles.remove(raviwen.Roller.Jailed)
    await uye.roles.add(raviwen.Register.unreg)
    message.channel.send(yanlis.setDescription(`Başarıyla ${uye} Adlı üyenin jail cezasını kaldırdınız.`)).then(x => x.delete({timeout: 2000}))
    } else {
        message.channel.send(yanlis.setDescription('Kişinin jail cezası bulunmuyor.')).then(x => x.delete({timeout: 2000}))
    }
};
