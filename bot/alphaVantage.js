'use strict';

/*
    Alpha Vantage API Documentation
    https://www.alphavantage.co/documentation/

    Standard API call frequency is 5 calls per minute and 500 calls per day. 
    Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency.
*/

const fetch = require("node-fetch");
const alphavantageUrl = `https://www.alphavantage.co/query?apikey=${process.env.ALPHAVANTAGE_KEY}`;

/*
  Name: fetchPatiently(String url, Object params): Object
  Description: Wrapper for node-fetch which retries upon 408 and 502 error codes
  Returns: HTTP response
*/
async function fetchPatiently(url, params) {

    let response = await fetch(url, params);

    while (response.status === 408 || response.status === 502) {
        // Wait three seconds between each new request
        await new Promise(res => setTimeout(res, 3000));
        response = await fetch(url, params);
    }

    return response;
}

function requestEndpoint(parameters) {
    return new Promise(async (resolve, reject) => {

        const response = await fetchPatiently(alphavantageUrl + parameters, {
            method: "GET",
            headers: {
                'User-Agent': 'request'
            }
        }).catch(reject);

        if (!response.ok) return;

        const json = await response.json().catch(reject);
        if (!json) return;

        resolve(json)
    });
}

module.exports.requestEndpoint = async (parameters) => {
    const result = await requestEndpoint(parameters).catch(console.error);

    return result;
}

module.exports.quoteResult = async (symbol) => {
    let quote = await requestEndpoint(`&function=GLOBAL_QUOTE&symbol=${symbol}`).catch(console.error);

    if (quote["Note"]) return quote["Note"];

    return `${symbol} - Price: ${quote["Global Quote"]["05. price"]}`;
}