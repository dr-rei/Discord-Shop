async function permissionDenied(interaction) {
  const { MessageEmbed } = require("discord.js");
  

  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setDescription("***PERMISSION DENIED!***");
    await interaction.reply({ embeds: [embed] })

}
module.exports = { permissionDenied };
