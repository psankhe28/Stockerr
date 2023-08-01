'use strict';

const { ApplicationCommandOptionType } = require("discord.js");
const { CommandType } = require("wokcommands");
const { requestEndpoint, quoteResult } = require("../alphaVantage");

module.exports = {
    description: "Autocomplete the best-matching symbols based on keywords of your choice.",
    type: CommandType.SLASH,
    options: [
        {
            name: "keywords",
            description: "Start typing a symbol",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
    ],

    autocomplete: async (command, argument, interaction) => {
        let keywords = interaction.options._hoistedOptions[0].value
        if (keywords == '') return []

        let result = await requestEndpoint(`&function=SYMBOL_SEARCH&keywords=${keywords}`)

        if (result["Note"] || result.bestMatches[0] === undefined) return []

        return result.bestMatches.map(x => x['1. symbol'])
    },

    callback: async ({ text }) => {
        let quote = await quoteResult(text)

        return quote
    },
}