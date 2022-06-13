const { SlashCommandBuilder } = require("@discordjs/builders");
const randInt = require("../../function/randomInteger");
const Pterodactyl = require("./function/pterodactyl");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-allocation")
        .setDescription("Create Allocation")
        .addIntegerOption((option) => option.setName("nodes-id").setDescription("Input the nodes ID").setRequired(true))
        .addStringOption((option) => option.setName("ip").setDescription("Input the ip (example : 0.0.0.0)").setRequired(true))
        .addIntegerOption((option) => option.setName("total").setDescription("Input Total Allocation That Will Generated").setRequired(true))
        .addIntegerOption((option) => option.setName("min-range").setDescription("Minimun range for allocation port").setRequired(true))
        .addIntegerOption((option) => option.setName("max-range").setDescription("Maximum range for allocation port").setRequired(true))
        .addStringOption((option) => option.setName("alias").setDescription("Input the alias (example : yourdomain.com)").setRequired(false)),
    async execute(interaction, config) {
        const permissions = require("../permission.js");
        const denied = require("../../function/permissionDenied.js");
        const allowed = await permissions.slashRolePermission(config.permission.ptero, interaction);
        if (!allowed) {
            denied.permissionDenied(interaction);
        } else {
            await interaction.reply("Running..");
            const nodeId = interaction.options.getInteger("nodes-id");
            const allocationLimit = interaction.options.getInteger("total");
            const minRange = interaction.options.getInteger("min-range");
            const maxRange = interaction.options.getInteger("max-range");
            const ip = interaction.options.getString("ip");
            const alias = interaction.options.getString("alias");
            const channelId = interaction.channel.id;
            const channel = interaction.client.channels.cache.get(channelId);
            const pterodactyl = new Pterodactyl.PterodactylApp(interaction, config);
            const response = await pterodactyl.listNodesAllocation(nodeId);
            if (!response) {
                console.log("ERROR - Failed to get current registered allocation!");
            } else {
                var validAllocation = [];

                const registeredAllocation = response.data;
                var failed = false;
                var x = 0;
                for (var i = 0; i < allocationLimit; ) {
                    const newAllocation = randInt.getRndInteger(minRange, maxRange);
                    let findRegistered = registeredAllocation.find((reg) => reg.attributes.port === newAllocation);
                    let findValid = validAllocation.find((valid) => valid === newAllocation);

                    if (!findRegistered && !findValid) {
                        console.log("store port " + newAllocation);
                        validAllocation.push(`${newAllocation}`);
                        i++;
                    } else {
                        console.log("failed to register " + newAllocation + " port, because there is duplicate!");
                        x++;
                    }

                    if (x == 10) {
                        console.log("Failed to randomize port after 10 tries! The minimum and maximum range is to narow");
                        failed = true;
                        break;
                    }
                }
                if (failed) {
                    await interaction.editReply("Failed... The minimum and maximum range is to narow");
                } else {
                    console.log("This port will registered to the nodes..");
                    validAllocation.sort();
                    console.log("Registering the allocation....");
                    console.log(validAllocation);
                    const createAllocation = await pterodactyl.createNodesAllocation(nodeId, ip, validAllocation, alias);
                    if (!createAllocation) {
                        console.log("Register Allocation Failed");
                        
                    } else {
                        console.log("Allocation registered...");
                        await pterodactyl.embedDefaultSuccessReply();
                        if (!config.ptero.cloudflare.integrateCloudflare) {
                            await interaction.editReply("Complete...");
                        } else {
                            
                        }
                    }
                }
            }
        }
    },
};
