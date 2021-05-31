const { MessageEmbed } = require('discord.js');
const db = require('quick.db')

module.exports.config = { 
    name: 'c-info',
    aliases: ['ceza','info']
}

module.exports.raviwen = async(client, message, args, config) => {
    let cezaID = db.get(`cezaid.${message.guild.id}`)
    let embed = new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic:true})).setColor('RANDOM').setTimestamp()
    let ID = Number(args[0])
    if(!ID) return message.channel.send(embed.setDescription('Geçerli bir numara belirtmen gerekiyor.'))
    let cezainfo = db.fetch(`moderasyon.${cezaID}.${message.guild.id}`)
    if(!cezainfo) return message.channel.send(embed.setDescription(`Belirtilen ID ile ceza bulunmuyor. \`!#${ID}\``))
    
    let ceza = embed.setDescription(`
    Ceza ID: \`#${ID}\`
    ❯ Ceza Bilgisi: \`${cezainfo.Komut}\`
    ❯ Yetkili: <@${cezainfo.Yetkili}> (\`${cezainfo.Yetkili}\`)
    ❯ Üye: <@${cezainfo.Cezalı}> (\`${cezainfo.Cezalı}\`)
    ❯ Sebep: \`${cezainfo.Sebep}\`
    ❯ Tarih: \`${cezainfo.Sebep}\`
    ❯ Puan: \`${cezainfo.Puan}\`
    ❯ Süre: \`${cezainfo.Süre}\`
    `)
    message.channel.send(ceza)
};