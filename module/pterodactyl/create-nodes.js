const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder().setName("create-nodes").setDescription("Create Allocation"),

    async execute(interaction, config) {
        const permissions = require("../permission.js");
        const denied = require("../../function/permissionDenied.js");
        const allowed = await permissions.slashRolePermission(config.permission.ptero, interaction);
        if (!allowed) {
            denied.permissionDenied(interaction);
        } else {
            //dev
        }
    },
};
