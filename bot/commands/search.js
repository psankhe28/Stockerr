'use strict';

const { CommandType } = require("wokcommands");
const { requestEndpoint } = require("../alphaVantage");

module.exports = {
    description: "Returns the best-matching symbols and market information based on keywords of your choice.",
    type: CommandType.SLASH,
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<keyword>",
    callback: async (interaction) => {
        let result = await requestEndpoint(`&function=SYMBOL_SEARCH&keywords=${interaction.args[0]}`)

        if (result["Note"])
            return { content: result["Note"], ephemeral: true }

        if (result.bestMatches[0] === undefined)
            return { content: "No results found", ephemeral: true }

        return {
            content: `${result.bestMatches[0]["2. name"]} - Symbol: ${result.bestMatches[0]["1. symbol"]}`,
            ephemeral: true
        }
    }
}