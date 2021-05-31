const { MessageEmbed } = require('discord.js');
const db = require('quick.db')
const raviwen = require('../Manager/Raviwen.json')
const Main = require('../Manager/Main.json')

module.exports.config = { 
    name: 'kayıtlarım',
    aliases: ['kayıtlar','kstat']
}

module.exports.raviwen = async(client, message, args, config) => {
    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)
    
    //
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.registerYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.'))
    
    let kullanıcı = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;


        let erkek = db.fetch(`yetkili.${message.author.id}.erkek`);
        let kadın = db.fetch(`yetkili.${message.author.id}.kadın`);
        let kayıtlar = db.fetch(`yetkili.${message.author.id}.toplam`); 
        if(erkek === null) erkek = "0"  
        if(erkek === undefined) erkek = "0"
        if(kadın === null) kadın = "0"
        if(kadın === undefined) kadın = "0"
        if(kayıtlar === null) kayıtlar = "0"
        if(kayıtlar === undefined) kayıtlar = "0"


        const kaytla = new MessageEmbed()
        .setThumbnail(message.guild.iconURL({dynamic:true}))
        .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
        .setDescription(`
        \`˃\` Toplam Kayıtların: \`${kayıtlar}\`
        \`˃\` Erkek Kayıtların: \`${erkek}\`
        \`˃\` Toplam Kadın Kayıtların: \`${kadın}\`
        `)
        message.channel.send(kaytla)


};