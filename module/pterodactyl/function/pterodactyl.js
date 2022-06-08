const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class PterodactylApp {
    constructor(interaction, url, appAPIKey) {
        this.url = url;
        this.appKey = appAPIKey;
        this.interaction = interaction;
        this.headers = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.appKey}`,
                }

        this.embedDefaultSuccessReply = async function () {
            const channel = this.interaction.client.channels.cache.get(this.interaction.channel.id);

            const embed = new MessageEmbed().setColor("#00ff40").setDescription(`**SUCCESS!** - Command executed!`);
            await this.interaction.editReply("**SUCCESS!**");
            channel.send({ embeds: [embed] });
        };

        this.embedDefaultErrorReply = async function (code, status, detail) {
            const channel = this.interaction.client.channels.cache.get(this.interaction.channel.id);
            const embed = new MessageEmbed().setColor("#ff0000").setDescription(`**Error - ${status} - ${code}\n\n${detail}**`);
            await this.interaction.editReply("**ERROR!**");
            channel.send({ embeds: [embed] });
        };

        this.listNodes = async function () {
            const response = await fetch(`${this.url}/api/application/nodes`, {
                method: "GET",
                headers: this.headers,
            });
            const data = await response.json();
            if (data.errors) {
                const err = data.errors[0];
                await this.embedDefaultErrorReply(err.code, err.status, err.detail);
                return false;
            } else {
                return data;
            }
        };

        this.createNode = async function (name = 'New Node', locationId, fqdn, scheme = 'https', memory, memoryOverallocate = 0, disk, diskOverallocate = 0, uploadSize = 100, daemonSFTP = 2022, daemonListen = 8080 ) {
            
        }

        this.listNodesAllocation = async function (nodesId) {
            const response = await fetch(`${this.url}/api/application/nodes/${nodesId}/allocations`, {
                method: "GET",
                headers: this.headers,
            });
            const data = await response.json();
            if (data.errors) {
                const err = data.errors[0];
                await this.embedDefaultErrorReply(err.code, err.status, err.detail);
                return false;
            } else {
                return data;
            }
        };

        this.createNodesAllocation = async function (nodesId, ip, ports, alias = "") {
            const body = { ip: ip, ports: ports, alias: alias };
            const response = await fetch(`${this.url}/api/application/nodes/${nodesId}/allocations`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(body),
            });
            if (response.status == 204) {
                return true;
            } else {
                const data = await response.json();
                const err = data.errors[0];
                await this.embedDefaultErrorReply(err.code, err.status, err.detail);
                return false;
            }
        };
    }
}
module.exports = { PterodactylApp };
