const { MessageEmbed } = require('discord.js');
const db = require('quick.db')
const Main = require('../Manager/Main.json')
const raviwen = require('../Manager/Raviwen.json')
const moment = require('moment')

module.exports.config = { 
    name: 'isim',
    aliases: ['isim-değiştir','setnickname']
}

module.exports.raviwen = async(client, message, args, config) => {

    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)
    
    //
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.registerYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.'))
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let Name = args[1]
    let Age = args[2]
    if(!uye) return message.channel.send(yanlis.setDescription('Bir kullanıcı belirtmelisin. <@Raviwen/ID>'))
    if(!Name || !Age ) return message.channel.send(yanlis.setDescription(`Yanlış kullanım. ${Main.Prefix}e <@Raviwen/ID> <İsim> <Yaş>`))
    if(Age < Main.Minyaş) return message.channel.send(yanlis.setDescription(`${Main.Minyaş} Yaşından küçük üyeler kayıt edilemez.`))
    //let cpuan = db.get(`cezapuan.${uye.id}.${message.guild.id}`); // Datadan kişinin ceza puanını çeker.
    //if(cpuan > 80) return message.channel.send(yanlis.setDescription(`Kişinin Ceza Puanı: \`${cpuan}\` Olduğu için kayıt edilemiyor. `))  // Sayısı değiştirerek kayıt olmasını engelleyebilirsiniz. 
    if(uye.id === message.author.id) return message.channel.send(yanlis.setDescription('Kendinizi kayıt edemezsiniz.'))
    if(uye.id === message.guild.ownerID ) return message.channel.send(yanlis.setDescription('Sunucu sahibini kayıt edemezsin.'))
    if(uye.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(yanlis.setDescription('Belirttiğiniz kullanıcı sizden Üst veya Aynı konumda bulunuyor.'))

    const İsim = `${uye.user.username.includes(Main.Tag) ? Main.Tag : Main.UnTag} ${Name} | ${Age}`

    message.channel.send(new MessageEmbed().setFooter(Main.Footer).setColor('RANDOM')
    .setDescription(`${uye} Üyesinin ismini \`${İsim}\` olarak güncelledim.`)
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
    )

    db.push(`isim.${uye.id}`, {
        userID: uye.id,
        isimleri: İsim,
        role: 'İsim Değiştirme',
        teyitciid: message.author.id,
        teyitcisim: message.author.username
    })
};