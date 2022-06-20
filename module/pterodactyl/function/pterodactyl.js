const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class PterodactylApp {
    constructor(interaction, config) {
        this.url = config.ptero.panelUrl;
        this.appKey = config.ptero.appAPIKey;
        this.interaction = interaction;
        this.nodesDefaultSet = {
            name: config.ptero.nodesDefaultSet.name,
            useSSL: config.ptero.nodesDefaultSet.useSSL,
            behindProxy: config.ptero.nodesDefaultSet.behindProxy,
            memory: config.ptero.nodesDefaultSet.memory,
            memoryOverallocate: config.ptero.nodesDefaultSet.memoryOverallocate,
            disk: config.ptero.nodesDefaultSet.disk,
            diskOverallocate: config.ptero.nodesDefaultSet.diskOverallocate,
            uploadSize: config.ptero.nodesDefaultSet.uploadSize,
            daemonSFTP: config.ptero.nodesDefaultSet.daemonSFTP,
            daemonListen: config.ptero.nodesDefaultSet.daemonListen,
        };

        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.appKey}`,
        };
        
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

        this.createNode = async function (
            name,
            locationId,
            fqdn,
            useSSL,
            behindProxy,
            memory,
            memoryOverallocate,
            disk,
            diskOverallocate,
            uploadSize,
            daemonSFTP,
            daemonListen
        ) {
            const body = {
                name: name || this.nodesDefaultSet.name,
                location_id: locationId,
                fqdn: fqdn,
                scheme: useSSL || this.nodesDefaultSet.useSSL,
                behind_proxy: behindProxy || this.nodesDefaultSet.behindProxy,
                memory: memory || this.nodesDefaultSet.memory,
                memory_overallocate: memoryOverallocate || this.nodesDefaultSet.memoryOverallocate,
                disk: disk || this.nodesDefaultSet.disk,
                disk_overallocate: diskOverallocate || this.nodesDefaultSet.diskOverallocate,
                upload_size: uploadSize || this.nodesDefaultSet.uploadSize,
                daemon_sftp: daemonSFTP || this.nodesDefaultSet.daemonSFTP,
                daemon_listen: daemonListen || this.nodesDefaultSet.daemonListen,
            };
            const response = await fetch(`${this.url}/api/application/nodes`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(body),
            });
            if (response.status == 201) {
                const data = await response.json();
                return data;
            } else {
                const data = await response.json();
                const err = data.errors[0];
                await this.embedDefaultErrorReply(err.code, err.status, err.detail);
                return false;
            }
        };

        this.deleteNode = async function (nodesId) {
            const response = await fetch(`${this.url}/api/application/nodes/${nodesId}`, {
                method: "DELETE",
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
