function envRead(){
    
}

function configRead() {
    const fs = require('fs');
    const yaml = require('js-yaml');
    try {
        let fileContents = fs.readFileSync('config.yml', 'utf8');
        let data = yaml.load(fileContents);
        
        
        if(data.useYMLConfig = true){
            console.log("Reading data from config.yml")
            return data
        }else if(useYMLConfig = false){
            console.log("You YML Config Set To False! Using .env data instead...")
        }
        
    } catch (e) {
        console.log('config.yml not found automaticly use .env variable');
    }
        
}
module.exports = { configRead }