const { SlashCommandBuilder } = require("@discordjs/builders");
const Pterodactyl = require("./function/pterodactyl");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-nodes")
        .setDescription("Create Nodes")
        .addIntegerOption((option) => option.setName("location-id").setDescription("Input Nodes Location ID").setRequired(true))
        .addStringOption((option) => option.setName("url").setDescription("Input URL or IP to connect to Nodes").setRequired(true))
        .addStringOption((option) => option.setName("name").setDescription("Input Nodes Name"))
        .addStringOption((option) =>
            option
                .setName("ssl")
                .setDescription("Communicate Over SSL")
                .addChoices({ name: "https", value: "https" }, { name: "http", value: "http" })
        )
        .addStringOption((option) =>
            option
                .setName("use-proxy")
                .setDescription("Are the url using proxy ?")
                .addChoices({ name: "yes", value: 'true' }, { name: "no", value: 'false' })
        )
        .addIntegerOption((option) => option.setName("memory").setDescription("Set Nodes Memory"))
        .addIntegerOption((option) => option.setName("memory-overallocate").setDescription("Set Nodes Memory Overallocate"))
        .addIntegerOption((option) => option.setName("disk").setDescription("Set Nodes Disk"))
        .addIntegerOption((option) => option.setName("disk-overallocate").setDescription("Set Nodes Disk Overallocate"))
        .addIntegerOption((option) => option.setName("upload-size").setDescription("Set upload size limit"))
        .addIntegerOption((option) => option.setName("sftp").setDescription("Set Daemon SFTP port"))
        .addIntegerOption((option) => option.setName("daemon-port").setDescription("Set Daemon Port")),
    async execute(interaction, config) {
        const permissions = require("../permission.js");
        const denied = require("../../function/permissionDenied.js");
        const allowed = await permissions.slashRolePermission(config.permission.ptero, interaction);
        if (!allowed) {
            denied.permissionDenied(interaction);
        } else {
            await interaction.reply('Runing...')
            const locationId = interaction.options.getInteger("location-id");
            const url = interaction.options.getString("url");
            const name = interaction.options.getString("name");
            const ssl = interaction.options.getString("ssl");
            const GETuseProxy = interaction.options.getString("use-proxy");
            var useProxy
            if (GETuseProxy) {
                useProxy = (GETuseProxy === 'true')
            }
            const memory = interaction.options.getInteger("memory");
            const memoryOverallocate = interaction.options.getInteger("memory-overallocate");
            const disk = interaction.options.getInteger("disk");
            const diskOverallocate = interaction.options.getInteger("disk-overallocate");
            const uploadSize = interaction.options.getInteger("upload-size");
            const daemonSFTP = interaction.options.getInteger("sftp");
            const daemonPort = interaction.options.getInteger("daemon-port");

            const pterodactyl = new Pterodactyl.PterodactylApp(interaction, config);
            const data = await pterodactyl.createNode(
                name,
                locationId,
                url,
                ssl,
                useProxy,
                memory,
                memoryOverallocate,
                disk,
                diskOverallocate,
                uploadSize,
                daemonSFTP,
                daemonPort
            );
            if (data) {
                const channel = interaction.client.channels.cache.get(interaction.channel.id);

                const embed = new MessageEmbed()
                    .setColor("#00ff40")
                    .setDescription(`**SUCCESS!** - New Node Created!`)
                    .addField(`Node Name :`, "```" + data.attributes.name + "```", true)
                    .addField(`Node ID :`, "```" + data.attributes.id + "```", true)
                
                await interaction.editReply("Complete...");
                await channel.send({ embeds: [embed] });
                
            }
            else {
                console.log('Failed Creating New Node')
            }
            
        }
    },
};
