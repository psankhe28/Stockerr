'use strict';

require('dotenv').config()
const WOK = require('wokcommands')
const { DefaultCommands } = require("wokcommands")
const path = require('path')
const { Client, GatewayIntentBits, Partials } = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
    partials: [
        Partials.Channel
    ]
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)

    /*
        WOK Documentation
        https://docs.wornoffkeys.com
    */
    new WOK({
        client,
        commandsDir: path.join(__dirname, 'commands'),
        disabledDefaultCommands: [
            DefaultCommands.ChannelCommand,
            DefaultCommands.CustomCommand,
            DefaultCommands.Prefix,
            DefaultCommands.RequiredPermissions,
            DefaultCommands.RequiredRoles,
            DefaultCommands.ToggleCommand
        ],
    })
})

client.login(process.env.DISCORD_TOKEN)