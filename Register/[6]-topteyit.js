const { MessageEmbed } = require('discord.js');
const db = require('quick.db')
const raviwen = require('../Manager/Raviwen.json')
const Main = require('../Manager/Main.json')

module.exports.config = { 
    name: 'topteyit',
    aliases: ['top-teyit','kayıt-liste']
}

module.exports.raviwen = async(client, message, args, config) => {
    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)
    
    //
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.registerYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.'))
    let uye = message.mentions.users.first() || message.author;
    let top = message.guild.members.cache.filter(uye => db.get(`yetkili.${uye.id}.toplam`)).array().sort((uye1, uye2) => Number(db.get(`yetkili.${uye2.id}.toplam`))-Number(db.get(`yetkili.${uye1.id}.toplam`))).slice(0, 15).map((uye, index) => (index+1)+" • <@"+ uye +"> | \`" + db.get(`yetkili.${uye.id}.toplam`) +"\` Kayıta Sahip.").join('\n');
    message.channel.send(new MessageEmbed().setAuthor(`Top Teyit Listesi`, message.guild.iconURL({dynamic: true})).setTimestamp().setColor("#38ff3d").setFooter(message.member.displayName+" tarafından istendi!", message.author.avatarURL).setDescription(top));



};