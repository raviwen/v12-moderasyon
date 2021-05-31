const { MessageEmbed } = require('discord.js');
const Main = require('../Manager/Main.json')
const db = require('quick.db')
module.exports.config = { 
    name: 'kilitle',
    aliases: ['kanal-kilitle']
}

module.exports.raviwen = async(client, message, args, config) => {
    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setFooter(Main.Footer)

    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.').setColor('RED')).then(x => x.delete({timeout: 2000}))

    if(db.get(`kilitli`)){
        message.channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: true });
        message.channel.send(yanlis.setDescription(`Kanalın kilidi açıldı.`).setColor('RED').setThumbnail(message.guild.iconURL({dynamic:true})))
        db.delete(`kilitli`)
    } else {
        message.channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false });
        message.channel.send(yanlis.setDescription(`Kanal kilitlendi.`).setColor('GREEN').setThumbnail(message.guild.iconURL({dynamic:true})))
        db.set(`kilitli`, true)
    }
};