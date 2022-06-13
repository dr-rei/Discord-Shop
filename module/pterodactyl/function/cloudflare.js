const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class cloudflareAPI {
    constructor(interaction, config) {
        this.email = config.ptero.cloudflare.email;
        this.APIKey = config.ptero.cloudflare.APIKey;
        this.headers = {
            "Content-Type": "application/json",
            "X-Auth-Key": this.APIKey,
            "X-Auth-Email": this.email,
        };

        this.zonesList = async function () {
            const response = await fetch("https://api.cloudflare.com/client/v4/zones", {
                method: "GET",
                headers: this.headers,
            });
            const data = await response.json();
            if (response.status == 200) {
                return data.result;
            } else {
                console.log(response);
                return false;
            }
        };

        this.dnsList = async function (zoneID) {
            const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneID}/dns_records`, {
                method: "GET",
                headers: this.headers,
            });
            const data = await response.json();
            if (response.status == 200) {
                return data.result;
            } else {
                console.log(response);
                return false;
            }
        };

        this.dnsCreate = async function (zoneID, type, subdomain, ip, ttl) {
            const body = { type: type, name: subdomain, content: ip, ttl: ttl };
            const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneID}/dns_records`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.status == 200) {
                return data.result;
            } else {
                console.log(response);
                return false;
            }
        };

        this.dnsUpdate = async function (zoneID, dnsID, type, subdomain, ip, ttl) {
            const body = { type: type, name: subdomain, content: ip, ttl: ttl };
            const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneID}/dns_records/${dnsID}`, {
                method: "PUT",
                headers: this.headers,
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.status == 200) {
                return data.result;
            } else {
                console.log(response);
                return false;
            }
        };
    }
}
module.exports = { cloudflareAPI };
