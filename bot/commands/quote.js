'use strict';

const { CommandType } = require("wokcommands");
const { quoteResult } = require("../alphaVantage");

module.exports = {
    description: "Returns the price and volume information for a token of your choice.",
    type: CommandType.SLASH,
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<token>",
    callback: async (interaction) => {
        let quote = await quoteResult(interaction.args[0])

        return quote
    }
}