const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Pterodactyl = require("./function/pterodactyl");

module.exports = {
    data: new SlashCommandBuilder().setName("delete-node").setDescription("Delete the node!"),

    async execute(interaction, config) {
        
        const permissions = require("../permission.js");
        const denied = require("../../function/permissionDenied.js");
        const allowed = await permissions.slashRolePermission(config.permission.ptero, interaction);
        if (!allowed) {
            denied.permissionDenied(interaction);
        } else {
            await interaction.reply('Running...')
            const pterodactyl = new Pterodactyl.PterodactylApp(interaction, config);

            const data = await pterodactyl.deleteNode(75)
            if (data) {
                await interaction.editReply('Deleted!')
                console.log(data)
            }
            else {
                
            }
        }
    },
};
