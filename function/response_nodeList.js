async function embedResponse(array, rawPage){

    const length = array.length
    const { MessageEmbed } = require('discord.js')
    const page = Math.ceil(rawPage)
    var response = []
    var count = 0
    
    for(i = 1;i<=page ;i++){
        
        if(i==page){
            if(length % 5 == 0){
                var inc = 5
            }else{
                var inc = length % 5
            }
            
            
        }else{
            var inc = 5
        }  
        
        const Embed = new MessageEmbed()
            .setColor('#0048BA')
            .setTitle("LIST NODES  -  PAGE "+i+"/"+page)
            .setURL('https://digital-cloud.tech')
            for(j=count;j<count+inc;j++){
                const name = array[j].attributes.name
                const id = array[j].attributes.id
                
                Embed.addFields(
                    { name: 'Nodes Name', value: "```"+name+"```", inline: true },
                    { name: 'Nodes ID', value: "```"+id+"```", inline: true },
                    { name: '======================', value: '======================' },
                )
            }
            
            count = count + 5
            response.push(Embed)

    }
    
return response;



}
module.exports = { embedResponse }