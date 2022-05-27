function envRead() {
  require("dotenv").config();
  console.log("Reading data from .env file...");
  var envData, ptero, general;
  // READ GENERAL
  console.log("Reading General settings...");

  if (
    process.env.botToken &&
    process.env.botClientId &&
    process.env.serverGuildId &&
    process.env.serverOwner
  ) {
    general = {
      botToken: process.env.botToken,
      botClientId: process.env.botClientId,
      serverGuildId: process.env.serverGuildId,
      serverOwner: process.env.serverOwner,
    };
    console.log("General settings read Complete!");
  } else {
    console.log(
      "General env data missing! Make sure all required env variable are filled!"
    );
    process.exit(1);
  }

  // READY PTERODACTYL DATA

  if (process.env.usePterodactyl) {
    console.log("Reading Petrodactyl settings...");

    ptero = {
      usePterodactyl: process.env.usePterodactyl,
      appAPIKey: process.env.appAPIKey,
      panelUrl: process.env.panelUrl,
    };

    console.log("Pterodactyl settings read Complete!");
  } else {
    console.log(
      "usePterodactyl variable set to false or not found!. The module will be disabled!"
    );
    ptero = {
      usePterodactyl: false,
    };
  }

  envData = {
    general: general,
    ptero: ptero,
  };

  return envData;
}

function configRead() {
  const fs = require("fs");
  const yaml = require("js-yaml");
  var data;
  try {
    console.log("Reading data from config.yml");
    let fileContents = fs.readFileSync("config.yml", "utf8");
    data = yaml.load(fileContents);
  } catch (e) {
    console.log("config.yml not found automaticly use .env variable");
  }

  if (data.useYMLConfig == true) {
    console.log("Complete!");
    return data;
  } else if (data.useYMLConfig == false) {
    console.log("The YML Config Set To False! Using .env data instead...");
    const env = envRead();
    return env;
  } else {
    console.log("ERROR YML DATA");
    process.exit(1);
  }
}
module.exports = { configRead };
