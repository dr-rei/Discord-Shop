const { MessageEmbed } = require("discord.js");
var psl = require("psl");
class basicFunctionObj {
    constructor(interaction, config) {

        this.cloudflare = {
            RegisterDNSValidator: async function (cf, domainConnect, ip, zoneList) {
                console.log("Start registering domain to cloudflare");
                var parsedDomain = psl.parse(domainConnect);
                if (!parsedDomain) {
                    console.log('The domain that you registered is not valid!')
                }
                else {
                    let findDomainConnect = zoneList.find((zone) => zone.name === parsedDomain.domain);
                    if (!findDomainConnect) {
                        console.log(
                            `We cant find domain '${parsedDomain.domain}' which you registered as '${domainConnect}' in your Cloudflare Account!\nThe domain registration process to Cloudflare terminated`
                        );
                    } else {
                        console.log(
                            `We find '${parsedDomain.domain}' registered in your Cloudflare!\nStarting checking registered subdomain in domain '${parsedDomain.domain}'...`
                        );
                        const connectSubdomainList = await cf.dnsList(findDomainConnect.id);
                        if (!connectSubdomainList) {
                            console.log("Failed to list all DNS in your domain");
                        } else {
                            let findDNS = connectSubdomainList.find((DNS) => DNS.name === domainConnect && DNS.type === "A");

                            if (!findDNS) {
                                //create
                                console.log(`Subdomain '${parsedDomain.subdomain}' not found in the DNS list...\nStart creating new DNS record...`);
                                const createDNS = await cf.dnsCreate(findDomainConnect.id, "A", domainConnect, ip, 1);
                                if (!createDNS) {
                                    console.log("Create New DNS Failed!");
                                    return false;
                                } else {
                                    console.log("New DNS Record Registered...");
                                    return true;
                                }
                            } else {
                                //update
                                console.log(`Subdomain '${parsedDomain.subdomain}' already registered!\nStart updating the DNS record...`);
                                const updateDNS = await cf.dnsUpdate(findDNS.zone_id, findDNS.id, "A", domainConnect, ip, 1);
                                if (!updateDNS) {
                                    console.log("Update DNS Failed!");
                                    return false;
                                } else {
                                    console.log("New DNS Update Record Registered...");
                                    return true;
                                }
                            }
                        }
                    }
                }
                
            },
        };

    }
}
module.exports = { basicFunctionObj };