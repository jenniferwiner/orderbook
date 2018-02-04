module.exports = function generateMatches(bids, asks) {
  let matches = []

  for (let rate in bids) {
    if (asks[rate]) {
      let bittrexAsk = asks[rate]['perExchange'][0]
      let bittrexBid = bids[rate]['perExchange'][0]
      let poloniexAsk = asks[rate]['perExchange'][1]
      let poloniexBid = bids[rate]['perExchange'][1]

      let bittrexMatch = (bittrexAsk !== 0 && bittrexBid !== 0)
        ? { ask: bittrexAsk, bid: bittrexBid } : ''

      let poloniexMatch = (poloniexAsk !== 0 && poloniexBid !== 0)
        ? { ask: poloniexAsk, bid: poloniexBid } : ''

      let pBidbAskMatch = (bittrexAsk !== 0 && poloniexBid !== 0)
        ? { ask: bittrexAsk, bid: poloniexBid } : ''

      let bBidpAskMatch = (poloniexAsk !== 0 && bittrexBid !== 0)
        ? { ask: poloniexAsk, bid: bittrexBid } : ''

      matches.push({
        rate,
        bittrexMatch,
        poloniexMatch,
        pBidbAskMatch,
        bBidpAskMatch
      })
    }

    return matches
  }
}
