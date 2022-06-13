const { SlashCommandBuilder } = require("@discordjs/builders");
const Pterodactyl = require("./function/pterodactyl");
const { MessageEmbed } = require("discord.js");
const cloudflare = require("./function/cloudflare");
const BasicFunction = require('./function/basic')
var psl = require("psl");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-nodes")
        .setDescription("Create Nodes")
        .addIntegerOption((option) => option.setName("location-id").setDescription("Input Nodes Location ID").setRequired(true))
        .addStringOption((option) => option.setName("node-domain").setDescription("Input Domain or IP to connect to Nodes").setRequired(true))
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
                .addChoices({ name: "yes", value: "true" }, { name: "no", value: "false" })
        )
        .addIntegerOption((option) => option.setName("memory").setDescription("Set Nodes Memory"))
        .addIntegerOption((option) => option.setName("memory-overallocate").setDescription("Set Nodes Memory Overallocate"))
        .addIntegerOption((option) => option.setName("disk").setDescription("Set Nodes Disk"))
        .addIntegerOption((option) => option.setName("disk-overallocate").setDescription("Set Nodes Disk Overallocate"))
        .addIntegerOption((option) => option.setName("upload-size").setDescription("Set upload size limit"))
        .addIntegerOption((option) => option.setName("sftp").setDescription("Set Daemon SFTP port"))
        .addIntegerOption((option) => option.setName("daemon-port").setDescription("Set Daemon Port"))
        .addStringOption((option) => option.setName("connect-domain").setDescription("Input domain the allocation will use for Cloudflare Integration"))
        .addStringOption((option) => option.setName("ipv4").setDescription("Input IPv4 addresses for Cloudflare Integration")),
    async execute(interaction, config) {
        
        const permissions = require("../permission.js");
        const denied = require("../../function/permissionDenied.js");
        const allowed = await permissions.slashRolePermission(config.permission.ptero, interaction);
        if (!allowed) {
            denied.permissionDenied(interaction);
        } else {
            await interaction.reply("Runing...");
            const locationId = interaction.options.getInteger("location-id");
            const nodeDomain = interaction.options.getString("node-domain");
            const name = interaction.options.getString("name");
            const ssl = interaction.options.getString("ssl");
            const GETuseProxy = interaction.options.getString("use-proxy");
            var useProxy;
            if (GETuseProxy) {
                useProxy = GETuseProxy === "true";
            }
            const memory = interaction.options.getInteger("memory");
            const memoryOverallocate = interaction.options.getInteger("memory-overallocate");
            const disk = interaction.options.getInteger("disk");
            const diskOverallocate = interaction.options.getInteger("disk-overallocate");
            const uploadSize = interaction.options.getInteger("upload-size");
            const daemonSFTP = interaction.options.getInteger("sftp");
            const daemonPort = interaction.options.getInteger("daemon-port");
            const connectDomain = interaction.options.getString("connect-domain");
            const ip = interaction.options.getString("ipv4");
            const pterodactyl = new Pterodactyl.PterodactylApp(interaction, config);
            const basicfunction = new BasicFunction.basicFunctionObj(interaction, config)

            const data = await pterodactyl.createNode(
                name,
                locationId,
                nodeDomain,
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
            if (!data) {
                console.log("Failed Creating New Node");
            } else {
                const channel = interaction.client.channels.cache.get(interaction.channel.id);

                const embed = new MessageEmbed()
                    .setColor("#00ff40")
                    .setDescription(`**SUCCESS!** - New Node Created!`)
                    .addField(`Node Name :`, "```" + data.attributes.name + "```", true)
                    .addField(`Node ID :`, "```" + data.attributes.id + "```", true);

                await channel.send({ embeds: [embed] });

                if (!config.ptero.cloudflare.integrateCloudflare) {
                    await interaction.editReply("Create Node Complete...");
                }
                else if (!ip) { 
                    console.log('Cant register to cloudflare if you not fill ipv4 field.')
                    await interaction.editReply("Create Node Complete...\nFailed to register to Cloudflare");
                }
                else {
                    const cf = new cloudflare.cloudflareAPI(interaction, config);
                    const zoneList = await cf.zonesList();
                    console.log('Start registering Node Domain')
                    const resultNodeDomain = await basicfunction.cloudflare.RegisterDNSValidator(cf, nodeDomain, ip, zoneList);
                    if (resultNodeDomain) {
                        if (!connectDomain) {
                            console.log('User not fill the Connect Domain field. So the process stop here! Process Complete')
                            await interaction.editReply("Create Node Complete...\nRegister to Cloudflare Complete");
                        }
                        else if (nodeDomain == connectDomain) {
                            console.log("Register Second domain terminated! The node domain and conncet domain is same!");
                            await interaction.editReply("Create Node Complete...\nFailed to register to Cloudflare");
                        }
                        else {
                            console.log('Start registering Connect Domain')
                            const resultConncetDomain = await basicfunction.cloudflare.RegisterDNSValidator(cf, connectDomain, ip, zoneList);
                            if (!resultConncetDomain) {
                                await interaction.editReply("Create Node Complete...\nFailed to register to Cloudflare");
                            }
                            else {
                                await interaction.editReply("Create Node Complete...\nRegister to Cloudflare Complete");
                            }
                        }
                        
                    } else {
                        await interaction.editReply("Create Node Complete...\nFailed to register to Cloudflare");
                    }
                }
            }
        }
    },
};
