const Discord = require("discord.js");
const moment = require('moment');
const config = require('./config.json')
const client = new Discord.Client();

require('events').EventEmitter.defaultMaxListeners = Infinity; 



client.on("ready", async () => {
  client.user.setPresence({ activity: { name: config.Settings.Durum }, status: "idle" });
  let botVoiceChannel = client.channels.cache.get(config.Settings.VoiceID);
  if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));});
  

client.login(config.Settings.Token).catch(err => console.log('Tokene bağlanamadım. Lütfen değiştir veya yeni token gir'));
client.once('ready', () => {
  console.log('Bot Başarıyla Aktifleştirildi.')
})
//// Sunucu Güncelleme

client.on("guildUpdate", async (oldGuild, newGuild) => {
    let yetkili = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
    if (!yetkili || !yetkili.executor ) return;


      const sunucuisim = new Discord.MessageEmbed()
      .setTitle('**[Sunucu Güncellendi]**')
      .setDescription(`Sunucuyu Güncelleyen: ${yetkili.executor} \`${yetkili.executor.id}\``)
      .setColor("#00ffdd")
      .setTimestamp()
      .setFooter(config.Settings.botDurum)
      let kanal = client.channels.cache.get(config.Channels.sunucugüncelleme);
      kanal.send(sunucuisim).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 31. Satır '));
  });

//// Kanal Oluşturma

client.on('channelCreate', (channel) => {
    if(!channel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
    if(!channel.guild) return;
    channel.guild.fetchAuditLogs().then(logs => { 
     let userID = logs.entries.first().executor.id;
       let kanaloluşturma = new Discord.MessageEmbed() 
       .setTitle('**[Kanal Oluşturuldu]**')
       .setColor('GREEN')
       .setDescription(`Kanal ID: \`${channel.id}\` \n Kanalı Oluşturan: <@!${userID}> \`${userID}\``)
       .addField("Kanal ismi:", channel.name, true)
       .addField("Kanal Tipi:", `\`${channel.type}\``, false)
       .setTimestamp()
       .setFooter(config.Settings.botDurum)
       let kanal = client.channels.cache.get(config.Channels.kanaloluşturma);
       kanal.send(kanaloluşturma).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 50. Satır '));
    })
  })
//// Kanal Düzenleme


client.on('channelUpdate', (oldChannel, newChannel) => {
    if(!oldChannel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
    oldChannel.guild.fetchAuditLogs().then(logs => { 
        if(oldChannel.name !== newChannel.name) {
     let userID = logs.entries.first().executor.id;
     let kanaldüzenleme = new Discord.MessageEmbed() 
       .setTitle('**[Kanal Güncellendi]**')
       .setColor('RED')
       .setDescription(`Kanal ID: \`${oldChannel.id}\` \n Kanalı Silen: <@!${userID}> \`${userID}\``)
       .addField("Eski Kanal İsmi:", oldChannel.name)
       .addField("Yeni Kanal İsmi:", newChannel.name)
       .setTimestamp()
       .setFooter(config.Settings.botDurum)
       let kanal = client.channels.cache.get(config.Channels.kanaldüzenleme);
       kanal.send(kanaldüzenleme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 70. Satır '));
        }
    })
})

//// Kanal Sİlme

client.on('channelDelete', (channel) => {
    if(!channel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
    if(!channel.guild) return;
    channel.guild.fetchAuditLogs().then(logs => { 
     let userID = logs.entries.first().executor.id;
     let kanalsilme = new Discord.MessageEmbed() 
       .setTitle('**[Kanal Silindi]**')
       .setColor('RED')
       .setDescription(`Kanal ID: \`${channel.id}\` \n Kanalı Silen: <@!${userID}> \`${userID}\``)
       .addField("Kanal İsmi:", channel.name, true)
       .addField("Kanal Tipi:", channel.type, false)
       .setTimestamp()
       .setFooter(config.Settings.botDurum)
       let kanal = client.channels.cache.get(config.Channels.kanalsilme);
       kanal.send(kanalsilme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 91. Satır '));
    })
  })
//// Ban Atma
client.on('guildBanAdd', async (guild, banatılan) => {
    let ban = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
    if(!ban || !ban.executor) return;

    const banatma = new Discord.MessageEmbed()
    .setTitle('**[Bir Kullanıcı Banlandı]**')
    .setColor('RED')
    .setDescription(`Banlanan Üye ID: \`${banatılan.id}\` \nÜyeyi Banlayan: ${ban.executor} \`${ban.executor.id}\``)
    .addField(`Banlanan Üye:`, banatılan)
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    let kanal = client.channels.cache.get(config.Channels.banatma);
    kanal.send(banatma).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 107. Satır '));
})
//// Ban Kaldırma
client.on('guildBanRemove', async (guild, unbanned) => {
    let bankaldır = await guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first());
    if(!bankaldır || !bankaldır.executor) return;

    const bankaldırma = new Discord.MessageEmbed()
    .setTitle('**[Bir Kullanıcını Banı Kaldırıldı]**')
    .setColor('RED')
    .setDescription(`Banı Kaldırılan ID: \`${unbanned.id}\` \nÜyeyinin Banını Kaldıran: ${bankaldır.executor} \`${bankaldır.executor.id}\``)
    .addField(`Banı Kaldırılan Üye:`, unbanned)
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    let kanal = client.channels.cache.get(config.Channels.bankaldırma);
    kanal.send(bankaldırma).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 122. Satır '));
})
//// Bot Ekleme
client.on('guildMemberAdd', async botekleme => {
    let ravi = await botekleme.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first());
    if (!botekleme.user.bot || !ravi || !ravi.executor) return;

    const eklenenbot = new Discord.MessageEmbed()
    .setTitle('**[Bot Eklendi]**')
    .setColor('GREEN')
    .setDescription(`Eklenen Bot ID: \`${botekleme.id}\` \n Botu Ekleyen: ${ravi.executor} \`${ravi.executor.id}\``)
    .addField('Eklenen Bot:', botekleme )
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    let kanal = client.channels.cache.get(config.Channels.botekleme);
    kanal.send(eklenenbot).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 137. Satır '));

})
//// Rol Oluşturma

client.on('roleCreate', (role) => {
    if(!role.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
     role.guild.fetchAuditLogs().then(logs => { 
     let userID = logs.entries.first().executor.id;
     let rololuşturma = new Discord.MessageEmbed() 
       .setTitle('**[Rol Oluşturuldu]**')
       .setColor('GREEN')
       .addField("Oluşturulan Rol:", role.name, true)
       .setDescription(`Rol ID: \`${role.id}\` \n Rolü Oluşturan: **__<@!${userID}>__**  \`${userID} \``)
       .setTimestamp()
       .setFooter(config.Settings.botDurum)
       let kanal = client.channels.cache.get(config.Channels.rololuşturma);
       kanal.send(rololuşturma).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 154. Satır '));
    })
  })

//// Rol Güncelleme

client.on('roleUpdate', (oldRole, newRole) => {
    if(!oldRole.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
    oldRole.guild.fetchAuditLogs().then(logs => { 
     let userID = logs.entries.first().executor.id;
     if(oldRole.name !== newRole.name) {
      let rolgüncelleme = new Discord.MessageEmbed() 
         .setTitle('**[Rol Güncellendi]**')
         .setColor('RED')
         .addField(`Eski İsmi:`, oldRole.name)
         .addField(`Yeni İsmi:`, newRole.name)
         .setDescription(`Rol ID: **${oldRole.id}**\n Rolü Güncelleyen: <@${userID}>  \`${userID}\``)
         .setTimestamp()
         .setFooter(config.Settings.botDurum)
         let kanal = client.channels.cache.get(config.Channels.rolgüncelleme);
         kanal.send(rolgüncelleme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 174. Satır '));
      }
    })
   })
//// Rol Silme

client.on('roleDelete', (role) => {
  if(!role.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
  role.guild.fetchAuditLogs().then(logs => {
   let userID = logs.entries.first().executor.id;
     let rolsilme = new Discord.MessageEmbed() 
     .setTitle('**[Rol Silindi]**')
     .setColor('RED')
     .addField("Silinen Rolün İsmi:", role.name, true)
     .setDescription(`Rol ID: \`${role.id}\` \n Rolü Silen: <@!${userID}> \`${userID}\`  `)
     .setTimestamp()
     .setFooter(config.Settings.botDurum)
     let kanal = client.channels.cache.get(config.Channels.rolsilme);
     kanal.send(rolsilme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 192. Satır '));
  })
})

//// Webhook Oluşturma
client.on('webhookUpdate', async webhook => {
      let webhookoluşturma = await webhook.guild.fetchAuditLogs({type: 'WEBHOOK_CREATE'}).then(audit => audit.entries.first());
      if(!webhookoluşturma || !webhookoluşturma.executor) return;
   const webhookcreate = new Discord.MessageEmbed()
   .setTitle('**[Webhook İşlemi Gerçekleştirildi]**')
   .setColor('GREEN')
   .addField('Webhook İşlemi Gerçekleşen Kanal', webhook)
   .setDescription(`Webhook İşlemi Gerçekleştiren Üye: ${webhookoluşturma.executor} \`${webhookoluşturma.executor.id}\``)
   .setTimestamp()
   .setFooter(config.Settings.botDurum)
   let kanal = client.channels.cache.get(config.Channels.webhook);
   kanal.send(webhookcreate).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 208. Satır '));
})
//// Emoji Oluşturma
client.on('emojiCreate', async emoji => {
    const keevzcim = await emoji.guild.fetchAuditLogs({type: "EMOJI_CREATE"}).then(log => log.entries.first());
    if(!keevzcim || !keevzcim.executor) return;
    const emojioluşturma = new Discord.MessageEmbed()
    .setTitle('**[Bir Emoji Oluşturuldu]**')
    .setColor('GREEN')
    .setDescription(`Emoji Oluşturan Üye: ${keevzcim.executor} \`${keevzcim.executor.id}\``)
    .addField(`Oluşturulan Emoji İsmi:`, emoji.name)
    .addField(`Oluşturulan Emoji Görsel:`, emoji)
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    let kanal = client.channels.cache.get(config.Channels.emojioluşturma);
    kanal.send(emojioluşturma).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 223. Satır '));
})
//// Emoji Düzenleme
client.on('emojiUpdate', async (oldEmoji, newEmoji) => {
    const keevzcim = await oldEmoji.guild.fetchAuditLogs({type: "EMOJI_UPDATE"}).then(log => log.entries.first());
    if(!keevzcim || !keevzcim.executor) return;
    const emojigüncelleme = new Discord.MessageEmbed()
    .setTitle('**[Bir Emoji Güncellendi]**')
    .setColor('GREEN')
    .setDescription(`Emojiyi Güncelleyen Üye: ${keevzcim.executor} \`${keevzcim.executor.id}\``)
    .addField(`Eski Emoji İsmi:`, oldEmoji.name )
    .addField(`Yeni Emoji İsmi:`, newEmoji.name)
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    let kanal = client.channels.cache.get(config.Channels.emojigüncelleme);
    kanal.send(emojigüncelleme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 238. Satır '));
})
//// Emoji Silme
client.on('emojiDelete', async emoji => {
    const keevzcim = await emoji.guild.fetchAuditLogs({type: "EMOJI_DELETE"}).then(log => log.entries.first());
    if(!keevzcim || !keevzcim.executor) return;
    
    const emojisilme = new Discord.MessageEmbed()
    .setTitle('**[Bir Emoji Silindi]**')
    .setColor('RED')
    .setDescription(`Emoji Silen Üye: ${keevzcim.executor} \`${keevzcim.executor.id}\``)
    .addField(`Silinen Emoji İsmi:`, emoji.name)
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    let kanal = client.channels.cache.get(config.Channels.emojisilme);
    kanal.send(emojisilme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. keevzcim.js / 253. Satır '));
})




///----------------------------------------------------------------------------------------------------//












client.on("guildMemberRoleAdd", async (member, role) => {
  let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} üyesine **${role.name}** rolü eklendi\n\n\`\`\`Rol: ${role.name} (${role.id})\nKullanıcı: ${member.user.tag} (${member.user.id})\nRol Eklenme: ${moment(Date.now()).locale("tr").format("LLL")}\`\`\``)
    client.channels.cache.get(client.channels.cache.find(x => x.name == "rol-log").id).send(embed)
client.channels.cache.get(client.channels.cache.find(x => x.name == "rol-log-basit").id).send(`:key: ${member.user.tag} (\`${member.user.id}\`) üyesine \`${role.name}\` rolü eklendi.`)

});

client.on("guildMemberRoleRemove", async (member, role) => {

  let embed = new Discord.MessageEmbed()
    .setColor("RED")
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} üyesinin **${role.name}** rolü kaldırıldı\n\n\`\`\`Rol: ${role.name} (${role.id})\nKullanıcı: ${member.user.tag} (${member.user.id})\nRol Eklenme: ${moment(Date.now()).locale("tr").format("LLL")}\`\`\``)
client.channels.cache.get(client.channels.cache.find(x => x.name == "rol-log").id).send(embed)
client.channels.cache.get(client.channels.cache.find(x => x.name == "rol-log-basit").id).send(`${member.user.tag} (\`${member.user.id}\`) üyesinden \`${role.name}\` rolü kaldırıldı.`)

});

client.on("guildMemberUpdate", async function (oldMember, newMember) {
  if (oldMember.displayName === newMember.displayName) return;

  let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    .setThumbnail(newMember.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(newMember.user.tag, newMember.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${newMember} üyesinin sunucu içi ismi değiştirildi.

Nick Değişimi:
Önce: ${oldMember.displayName}
Sonra: ${newMember.displayName}

\`\`\`Kullanıcı: ${newMember.user.tag} (${newMember.user.id})\nDeğişim Tarihi: ${moment(Date.now()).locale("tr").format("LLL")}\`\`\``)

  client.channels.cache.get(client.channels.cache.find(x => x.name == "isim-log").id).send(embed)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "isim-log-basit").id).send(`${newMember.user.tag} (\`${newMember.user.id}\`) üyesinin sunucu içi ismi değişti \`${oldMember.displayName}\` **>** \`${newMember.displayName}\``).catch(() => {});
});

client.on("guildMemberAdd", async (member) => {
  let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} sunucuya katıldı.\n\nHesap Kurulma: ${moment(member.createdTimestamp).locale("tr").format("LLL")}\n\n\`\`\`Kullanıcı: ${member.user.tag} (${member.user.id})\nSunucuya Katılma: ${moment(member.joinedAt).locale("tr").format("LLL")}\`\`\``)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "giriş-çıkış-log").id).send(embed)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "giriş-çıkış-log-basit").id).send(`${member.user.tag} (\`${member.id}\`) katıldı. \`${member.guild.memberCount}\` kişi olduk.`);
})
client.on("guildMemberRemove", async (member) => {
  let embed = new Discord.MessageEmbed()
    .setColor("RED")
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} sunucudan ayrıldı.\n\nHesap Kurulma: ${moment(member.createdTimestamp).locale("tr").format("LLL")}\n\n\`\`\`Kullanıcı: ${member.user.tag} (${member.user.id})\nSunucuya Katılma: ${moment(member.joinedAt).locale("tr").format("LLL")}\`\`\`\nSunucudan ayrıldığında ki rolleri:\n${member.roles.cache.filter(rol => rol.name != "@everyone").map(x => x).join(",")}`)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "giriş-çıkış-log").id).send(embed)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "giriş-çıkış-log-basit").id).send(`:outbox_tray: ${member.user.tag} (\`${member.id}\`) ayrıldı. \`${member.guild.memberCount}\` kişi olduk.`);
})
client.on("guildMemberUpdate", async (oldMember, newMember) => {

  // ROL EKLEME BASİT

})

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (client.channels.cache.find(x => x.name == "ses-log-basit")) {
    let oldChannel = oldState.channel;
    let newChannel = newState.channel;



    let logKanali = client.channels.cache.find(x => x.name == "ses-log-basit");
    let logKanali2 = client.channels.cache.find(x => x.name == "ses-log");
    let logKanali3 = client.channels.cache.find(x => x.name == "ses-mic-log");
    if (!oldState.channelID && newState.channelID) {
      let kanalGiris = new Discord.MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(config.Settings.botDurum)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalına giriş yaptı.

Kanala Girdiği Anda:
Mikrofonu: **${newState.mute == true ? "Kapalı" : "Açık"}**
Kulaklığı: **${newState.deaf == true ? "Kapalı" : "Açık"}**

\`\`\`Girdiği Kanal: #${newChannel.name} (${newChannel.id}) \nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Girdiği Kanalda Bulunan Üyeler:
${newChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`) == 0 ? "Üye Yoktur" : newChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}
`)
      logKanali2.send(kanalGiris)
      return logKanali.send(`:telephone: ${newState.member.user.tag} (\`${newState.id}\`) üyesi **${newChannel.name}** kanalına giriş yaptı.`).catch(() => {});
    }



    if (oldState.channelID && !newState.channelID) {

      let kanalCikis = new Discord.MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(config.Settings.botDurum)
        .setDescription(`
${newState.member} üyesi **${oldChannel}** kanalından ayrıldı.

Kanaldan Çıktığı Anda:
Mikrofonu: **${newState.mute == true ? "Kapalı" : "Açık"}**
Kulaklığı: **${newState.deaf == true ? "Kapalı" : "Açık"}**

\`\`\`Çıktığı Kanal: #${oldChannel.name} (${oldChannel.id}) \nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(oldChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Çıktığı Kanalda Bulunan Üyeler:
${oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`) == 0 ? "Üye Yoktur" : oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}
`)

      logKanali2.send(kanalCikis)
      return logKanali.send(`:telephone: ${newState.member.user.tag} (\`${newState.member.user.id}\`) üyesi **${oldChannel.name}** kanalından ayrıldı.`).catch(() => {});
    }

    if (oldState.channelID && newState.channelID && oldState.channelID != newState.channelID) {
      let kanalDegisme = new Discord.MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(config.Settings.botDurum)
        .setDescription(`
${newState.member} üyesi **${oldChannel}** kanalından **${newChannel}** kanalına geçiş yaptı.

Kanal Değiştirdiği Anda:
Mikrofonu: **${newState.mute == true ? "Kapalı" : "Açık"}**
Kulaklığı: **${newState.deaf == true ? "Kapalı" : "Açık"}**

\`\`\`Eski Kanal: #${oldChannel.name} (${oldChannel.id})\nYeni Kanal: #${newChannel.name} (${newChannel.id}) \nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Eski Kanalında Bulunan Üyeler:
${oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`) == 0 ? "Üye Yoktur" : oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}

Yeni Kanalında Bulunan Üyeler:
${newChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}
`)
      logKanali2.send(kanalDegisme)
      return logKanali.send(`:telephone: ${newState.member.user.tag} üyesi **${oldChannel.name}** kanalından **${newChannel.name}** kanalına geçiş yaptı`).catch(() => {});
    }


    if (oldState.channelID && !oldState.selfDeaf && newState.selfDeaf) {
      let embed = new Discord.MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(config.Settings.botDurum)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında kendini sağırlaştırdı.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)
      return logKanali3.send(embed).catch(() => {});
    }

    if (oldState.channelID && oldState.selfDeaf && !newState.selfDeaf) {
      let embed = new Discord.MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(config.Settings.botDurum)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında kendi sağırlaştırmasını kaldırdı.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)
      return logKanali3.send(embed).catch(() => {});
    }

    if (oldState.channelID && oldState.selfMute && !newState.selfMute) {

      let embed = new Discord.MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(config.Settings.botDurum)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında susturmasını kaldırdı.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)

      return logKanali3.send(embed).catch(() => {});
    }
    if (oldState.channelID && !oldState.selfMute && newState.selfMute) {
      let embed = new Discord.MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(config.Settings.botDurum)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında kendini susturdu.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)
      return logKanali3.send(embed).catch(() => {});
    }







  };
});


client.on("messageDelete", async (message) => {
  if (message.author.bot) return;
  let embed = new Discord.MessageEmbed()
    .setThumbnail(message.author.avatarURL({
      dynamic: true
    }))
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    .setAuthor(message.author.tag, message.author.avatarURL({
      dynamic: true
    }))
    .setDescription(`
${message.author} üyesi ${message.channel} kanalında mesajını sildi.

**__Silinen Mesaj:__**
${message.content.length > 0 ? message.content : "Silinen mesaj yoktur"}

**__Silinen Mesajdaki Resimler:__**
${ message.attachments.size > 0 ? message.attachments.filter(({ proxyURL }) => /\.(gif|jpe?g|png|webp)$/i.test(proxyURL)).map(({ proxyURL }) => proxyURL) : "Silinen resim yoktur"}

\`\`\`Kanal: #${message.channel.name} (${message.channel.id})\nKullanıcı: ${message.author.tag} (${message.author.id})\nMesaj ID: ${message.id}\nMesaj Atılma: ${moment(message.createdTimestamp).locale("tr").format("LLL")}\`\`\`
`)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "mesaj_silme_log").id).send(embed)
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot) return;
  let embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(config.Settings.botDurum)
    .setAuthor(newMessage.author.tag, newMessage.author.avatarURL({
      dynamic: true
    }))
    .setDescription(`
${newMessage.author} üyesi ${newMessage.channel} kanalında bir mesajı düzenledi.

**__Düzenlenmeden Önce:__**
${oldMessage.content}
**__Düzenlendikten Sonra:__**
${newMessage.content}

\`\`\`Kanal: #${newMessage.channel.name} (${newMessage.channel.id})\nKullanıcı: ${newMessage.author.tag} (${newMessage.author.id})\nMesaj ID: ${newMessage.id}\nMesaj Atılma: ${moment(newMessage.createdTimestamp).locale("tr").format("LLL")}\`\`\`
`)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "mesaj-log").id).send(embed)
});


///----------------------------------------------------------------------------------------------------//
