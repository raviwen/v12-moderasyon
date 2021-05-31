const { MessageEmbed } = require('discord.js');

module.exports.config = { 
    name: 'avatar',
    aliases: ['avatar']
}

module.exports.raviwen = async(client, message, args, config) => {

    let uye = message.mentions.users.first() || message.guild.members.cache.get() || message.author;

    message.channel.send(new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({dyamic:true}))
    .setTitle(`**AVATAR**`)
    .setImage(uye.displayAvatarURL({ dynamic: true, size: 512 }))
    )
};