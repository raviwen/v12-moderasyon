const { MessageEmbed } = require('discord.js');
const db = require('quick.db')
const Main = require('../Manager/Main.json')
const raviwen = require('../Manager/Raviwen.json')
const moment = require('moment')

module.exports.config = { 
    name: 'kadın',
    aliases: ['k','woman']
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
    let cpuan = db.get(`cezapuan.${uye.id}.${message.guild.id}`); // Datadan kişinin ceza puanını çeker.
    //if(cpuan > 80) return message.channel.send(yanlis.setDescription(`Kişinin Ceza Puanı: \`${cpuan}\` Olduğu için kayıt edilemiyor. `))  // Sayısı değiştirerek kayıt olmasını engelleyebilirsiniz. 
    if(uye.id === message.author.id) return message.channel.send(yanlis.setDescription('Kendinizi kayıt edemezsiniz.'))
    if(uye.id === message.guild.ownerID ) return message.channel.send(yanlis.setDescription('Sunucu sahibini kayıt edemezsin.'))
    if(uye.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(yanlis.setDescription('Belirttiğiniz kullanıcı sizden Üst veya Aynı konumda bulunuyor.'))

    const İsim = `${uye.user.username.includes(Main.Tag) ? Main.Tag : Main.UnTag} ${Name} | ${Age}`

    db.add(`yetkili.${message.author.id}.kadın`, 1)
    db.add(`yetkili.${message.author.id}.toplam`, 1)
    let reg = db.fetch(`yetkili.${message.author.id}.toplam`)

    let atılmaay = moment(Date.now()).format("MM")
    let atılmagün = moment(Date.now()).format("DD")
    let atılmasaat = moment(Date.now()).format("HH:mm:ss")
    let kayıttarihi = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    moment.locale("tr")

    await uye.setNickname(`${İsim}`)
    await uye.roles.add(raviwen.Register.k1)
    await uye.roles.add(raviwen.Register.k2)
    await uye.roles.add(raviwen.Register.k3)
    await uye.roles.remove(raviwen.Register.unreg)

    message.channel.send(new MessageEmbed().setColor('RANDOM').setFooter(`${message.author.username} Adlı yetkilinin toplam \`${reg}\` kaydı bulunuyor.`).setAuthor(message.author.username, message.author.avatarURL({ dynamic: true})).setThumbnail(message.guild.iconURL({ dynamic: true })).setDescription(`${uye} Adlı kişi ${message.author} tarafından <@&${raviwen.Register.k1}> Rolü verilerek kayıt edildi. \n  Kişinin yeni ismi: \`${İsim}\` \n Üyenin Ceza Puanı: \`${cpuan || 0}\``))
    client.channels.cache.get(raviwen.Log.RegisterLog).send(new MessageEmbed().setColor('RANDOM').setDescription(`Bir üye kayıt edildi. \n Kayıt Eden: ${message.author} (\`${message.author.id}\`) \n Kayıt Edilen: ${uye}(\`${uye.id}\`) \n Verilen Roller: <@&${raviwen.Register.k1}>,<@&${raviwen.Register.k2}>,<@&${raviwen.Register.k3}> \n Tarih: \`${kayıttarihi}\``))


    db.push(`isim.${uye.id}`, {
        userID: uye.id,
        isimleri: İsim,
        role: `<@&${raviwen.Register.k1}>`,
        teyitciid: message.author.id,
        teyitcisim: message.author.username
    })
};
