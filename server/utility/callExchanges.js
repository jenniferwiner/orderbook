const bittrex = require('node-bittrex-api')
const axios = require('axios')
const generateMatches = require('./generateMatches')

let bids = {}
let asks = {}

function callExchanges(req, res, next) {
  let market = req.params.market

  bids = {}
  asks = {}

  // call APIs in promise
  return Promise.all([getBittrexOrderBook(market), getPoloniexOrderBook(market)]).then(function(values) {
    let matches = generateMatches(bids, asks)
    // sort bids
    let bidValues = Object.values(bids)
    bidValues.sort((a, b) => {
      return b.rate < a.rate ? -1
          : b.rate > a.rate ? 1
          : 0
    })
    // sort asks
    let askValues = Object.values(asks)
    askValues.sort((a, b) => {
      return b.rate < a.rate ? 1
          : b.rate > a.rate ? -1
          : 0
    })

    // send sorted bids and asks
    return {
      bids: bidValues,
      asks: askValues,
      matches,
      error: ''
    }
  }, function(rejectionReason) {
    return {
      bids: '',
      asks: '',
      matches: '',
      error: true
    }
  }).then(data => {
    req.data = data
    next()
  })
}

// UTILITY METHODS

function getBittrexOrderBook(market) {
  return new Promise(function(resolve, reject) {
    bittrex.getorderbook({ market: market, type: 'both' }, function(data, err) {
      if (err) {
        reject('Error in calling Bittrex API: ' + err)
      }
      let bittrexBid = data.result.buy
      let bittrexAsk = data.result.sell
      // limit data to 50 orders
      for (let i = 0; i < 50 && i < bittrexBid.length; i++) {
        addBidPrice(toFixed6Down(bittrexBid[i].Rate), bittrexBid[i].Quantity, 'Bittrex')
      }
      for (let i = 0; i < 50 && i < bittrexAsk.length; i++) {
        addAskPrice(toFixed6Down(bittrexAsk[i].Rate), bittrexAsk[i].Quantity, 'Bittrex')
      }
      resolve(bids)
    })
  })
}

function getPoloniexOrderBook(market) {
  market = market.replace('-', '_')

  return new Promise(function(resolve, reject) {
    axios({
      url: `https://poloniex.com/public?command=returnOrderBook&currencyPair=${market}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      responseType: 'json'
    })
    .then(function(response) {
      response.data.bids.forEach(bid => {
        addBidPrice(toFixed6Down(bid[0]), bid[1], 'Poloniex')
      })
      response.data.asks.forEach(ask => {
        addAskPrice(toFixed6Down(ask[0]), ask[1], 'Poloniex')
      })
      resolve(bids)
    })
    .catch(function(error) {
      reject('Error in calling Poloniex API: ' + error)
    })
  })
}

function addBidPrice(rate, quantity, exchange) {
  let i = exchange === 'Bittrex' ? 0 : 1
  let perExchange = exchange === 'Bittrex' ? [quantity, 0] : [0, quantity]

  if (bids[rate]) {
    bids[rate]['combined'] += quantity
    bids[rate]['perExchange'][i] += quantity
  } else {
    bids[rate] = {
      rate: rate,
      combined: quantity,
      perExchange: perExchange
    }
  }
}

function addAskPrice(rate, quantity, exchange) {
  let i = exchange === 'Bittrex' ? 0 : 1
  let perExchange = exchange === 'Bittrex' ? [quantity, 0] : [0, quantity]

  if (asks[rate]) {
    asks[rate]['combined'] += quantity
    asks[rate]['perExchange'][i] += quantity
  } else {
    asks[rate] = {
      rate: rate,
      combined: quantity,
      perExchange: perExchange
    }
  }
}

// trucate rate to 6 digits
function toFixed6Down(rate) {
  let regex = new RegExp('(\\d+\\.\\d{6})(\\d)')
  let m = rate.toString().match(regex)

  return m ? parseFloat(m[1]) : rate.valueOf()
}

module.exports = callExchanges
