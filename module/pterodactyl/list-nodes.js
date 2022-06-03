const { SlashCommandBuilder } = require("@discordjs/builders");
const Nodeactyl = require("nodeactyl");
const embedResponse = require("../../function/response_nodeList");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-nodes")
    .setDescription("Show all nodes"),
  async execute(interaction, config) {
    const permissions = require("../permission.js");
    const denied = require("../../function/permissionDenied.js");
    const allowed = await permissions.slashRolePermission(
      config.permission.ptero,
      interaction
    );
    if (!allowed) {
      denied.permissionDenied(interaction);
    } else {
      const application = new Nodeactyl.NodeactylApplication(
        config.ptero.panelUrl,
        config.ptero.appAPIKey
      );
      const response = await application.getAllNodes();
      const channelId = interaction.channel.id;
      const channel = interaction.client.channels.cache.get(channelId);
      const page = response.data.length / 5;
      const embed = await embedResponse.embedResponse(response.data, page);
      for (i = 0; i < page; i++) {
        channel.send({ embeds: [embed[i]] });
      }

      await interaction.reply("Command Running!");
    }
  },
};
