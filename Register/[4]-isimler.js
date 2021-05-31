const { MessageEmbed } = require('discord.js');
const db = require('quick.db')
const raviwen = require('../Manager/Raviwen.json')
const Main = require('../Manager/Main.json')

module.exports.config = { 
    name: 'isimler',
    aliases: ['history','geçmiş']
}

module.exports.raviwen = async(client, message, args, config) => {

    let yanlis = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor('RED').setFooter(Main.Footer)
    //
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.registerYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(yanlis.setDescription('Gerekli yetkilere sahip değilsin.'))
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(yanlis.setDescription(`Bir üye belirtmen gerekiyor.`))

    var sayı = 1
    var page = 1
    let isimdata = db.get(`isim.${uye.id}`)
    if(!isimdata) return message.channel.send(yanlis.setDescription(`Kişinin veritabanına kayıtlı herhangi bir bilgisi bulunamadı.`))
    isimdata = isimdata.reverse();
    let numara = isimdata.length || '0';
    let isimler = isimdata.filter(x => x.userID === uye.id).map(x => `${sayı++}- \`${x.isimleri}\`  (${x.role})`).join("\n")
    if(isimler === null) isimler = "Kullanıcı hiç kayıt olmamış"
    if(isimler === undefined) isimler = "Kullanıcı hiç kayıt olmamış"

    var msg = await message.channel.send(new MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
    .setDescription(`Toplam ${numara} Geçmiş ismi bulunuyor.`)
    .addField(`İsimler`, `${isimler.slice(page == 1 ? 0 : page * 786 - 786, page * 786)} ** **`)
    .setColor('RANDOM')
    )


    if (isimler.length > 10) {
        await msg.react(`◀`);
        await msg.react(`🔴`);
        await msg.react(`▶`);
        let collector = msg.createReactionCollector((react, uye) => ["◀", "▶", "🔴"].some(e => e == react.emoji.name) && uye.id == message.member.id, {time: 200000});
        
        collector.on("collect", (react, uye) => {
        if (react.emoji.name == "▶") {
        if (isimler.slice((page + 1) * 786 - 786, (page + 1) * 786).length <= 0) return;
        page += 1;
        let newList = isimler.slice(page == 1 ? 0 : page * 786 - 786, page * 786);
        msg.edit(new MessageEmbed()
        .setDescription(`Toplam ${numara} Geçmiş İsmi bulunmakta.`)
        .addField(`İsimler`, `${newList} ** **`)
        .setColor("RANDOM")
        .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })));
        }
        if (react.emoji.name == "◀") {
        if (isimler.slice((page - 1) * 786 - 786, (page - 1) * 786).length <= 0) return;
        page -= 1;
        let newList = isimler.slice(page == 1 ? 0 : page * 786 - 786, page * 786);
        msg.edit(new MessageEmbed()
        .setDescription(`Toplam ${numara} Geçmiş İsmi bulunmakta.`)
        .addField(`İsimler`, `${newList} ** **`)
        .setColor("RANDOM")
        .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })));
        }
        if (react.emoji.name == "🔴") {
        msg.delete();
        collector.stop();}})}


    

};