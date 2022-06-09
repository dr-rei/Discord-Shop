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
    } else {
        console.log("ERROR YML DATA");
        process.exit(1);
    }
}
module.exports = { configRead };
