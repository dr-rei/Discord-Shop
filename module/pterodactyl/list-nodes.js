const { SlashCommandBuilder } = require("@discordjs/builders");
const Pterodactyl = require("./function/pterodactyl");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("list-nodes")
    .setDescription("Show all nodes"),
  async execute(interaction, config) {
    const permissions = require("../permission.js");
    const channel = interaction.client.channels.cache.get(interaction.channel.id);
    const denied = require("../../function/permissionDenied.js");
    const allowed = await permissions.slashRolePermission(config.permission.ptero, interaction);
    if (!allowed) {
      denied.permissionDenied(interaction);
    } else {
      await interaction.reply('Running...')
      const pterodactyl = new Pterodactyl.PterodactylApp(interaction, config.ptero.panelUrl, config.ptero.appAPIKey);

      const res = await pterodactyl.listNodes();
      if (!res) {
        console.log("Failed to get list nodes");
      } else {
        const list = res.data;
        const length = list.length;
        const pageData = 8;
        const page = Math.ceil(length / pageData);
        
        for (var i = 0; i < page; i++) {
          const embed = new MessageEmbed().setColor("#0000ff").setTitle(`Nodes List - Page ${i + 1}/${page}`);
          for (var j = 0; j < pageData; j++) {
            if (list[j + (pageData * i + 1)]) {
              embed.addField(`Nodes Name`, "```" + list[j + (pageData * i + 1)].attributes.name + "```",true);
              embed.addField(`ID`, "```" + list[j + (pageData * i + 1)].attributes.id + "```", true);
              embed.addField("========================", "========================");
            }
            
          }
          await channel.send({ embeds: [embed] });
          await interaction.reply("Complete");
        }
      }
    }
  },
};
