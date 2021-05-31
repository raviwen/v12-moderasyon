const { MessageEmbed } = require('discord.js');
const Main = require('../Manager/Main.json')
const raviwen = require('../Manager/Raviwen.json')
const moment = require('moment')
const ms = require('ms')
const db = require('quick.db')

module.exports.config = { 
    name: 'unmute',
    aliases: ['umute','mute-kaldır']
}

module.exports.raviwen = async(client, message, args, config) => {

    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.muteYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.'))
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(yanlis.setDescription('Belirttiğiniz üyeyi bulamadım.')).then(x => x.delete({timeout: 2000}))
    let sebep = args.splice(1).join(" ")
    if(!sebep) return message.channel.send(yanlis.setDescription('Bir sebep belirtmen gerekiyor.')).then(x => x.delete({timeout: 2000}))

    let muteli = db.fetch(`muteli.${uye.id}.${message.guild.id}`)
    if(!muteli) {
    if(muteli == 'muteli'){
    db.delete(`muteli.${uye.id}.${message.guild.id}`)
    db.delete(`süre.${uye.id}.${message.author.id}`)
    client.channels.cache.get(raviwen.Log.MuteLog).send(new MessageEmbed().setDescription(`${uye} Kişisinin mutesi \`${sebep}\` sebebiyle ${message.author} Tarafından kaldırıldı.`))
    await uye.roles.remove(raviwen.Roller.Muted)
    message.channel.send(yanlis.setDescription(`Başarıyla ${uye} Adlı üyenin mutesini kaldırdınız.`)).then(x => x.delete({timeout: 2000}))
    }} else {
        message.channel.send(yanlis.setDescription('Kişinin bir mutesi bulunmuyor.')).then(x => x.delete({timeout: 2000}))
    }

};