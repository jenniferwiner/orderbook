const express = require('express')
const router = express.Router()
const axios = require('axios')
const bittrex = require('node-bittrex-api')

/* GET home page. */
router.get('/', function(req, res, next) {
  // call APIs in promise
  Promise.all([getBittrexOrderBook, getPoloniexOrderBook]).then(function(values) {

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
    res.send({
      bids: bidValues,
      asks: askValues
    })
  }, function(rejectionReason) {
    res.send(rejectionReason)
  })
})

//
let asks = {}
let bids = {}

function addBittrexBidPrice(rate, quantity) {
  if (bids[rate]) {
    bids[rate]['combined'] += quantity
    bids[rate][0] = quantity
  } else {
    bids[rate] = {
      rate: rate,
      combined: quantity,
      perExchange: [quantity, 0]
    }
  }
}
function addBittrexAskPrice(rate, quantity) {
  if (asks[rate]) {
    asks[rate]['combined'] += quantity
    asks[rate][0] = quantity
  } else {
    asks[rate] = {
      rate: rate,
      combined: quantity,
      perExchange: [quantity, 0]
    }
  }
}

function addPoloniexBidPrice(rate, quantity) {
  if (bids[rate]) {
    bids[rate]['combined'] += quantity
    bids[rate][1] = quantity
  } else {
    bids[rate] = {
      rate: rate,
      combined: quantity,
      perExchange: [0, quantity]
    }
  }
}

function addPoloniexAskPrice(rate, quantity) {
  if (asks[rate]) {
    asks[rate]['combined'] += quantity
    asks[rate][1] = quantity
  } else {
    asks[rate] = {
      rate: rate,
      combined: quantity,
      perExchange: [0, quantity]
    }
  }
}

let getBittrexOrderBook = new Promise(function(resolve, reject) {
  bittrex.getorderbook({ market: 'BTC-ETH', type: 'both' }, function(data, err) {
    if (err) {
      reject('Error in calling Bittrex API: ' + err)
    }
    let bittrexBid = data.result.buy
    let bittrexAsk = data.result.sell
    // limit data to 50 orders
    for (let i = 0; i < 50 && i < bittrexBid.length; i++) {
      addBittrexBidPrice(bittrexBid[i].Rate, bittrexBid[i].Quantity)
    }
    for (let i = 0; i < 50 && i < bittrexAsk.length; i++) {
      addBittrexAskPrice(bittrexAsk[i].Rate, bittrexAsk[i].Quantity)
    }
    resolve(bids)
  })
})

let getPoloniexOrderBook = new Promise(function(resolve, reject) {
  axios({
    url: 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH',
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
    responseType: 'json'
  })
  .then(function(response) {
    response.data.bids.forEach(bid => {
      addPoloniexBidPrice(bid[0], bid[1])
    })
    response.data.asks.forEach(ask => {
      addPoloniexAskPrice(ask[0], ask[1])
    })
    resolve(bids)
  })
  .catch(function(error) {
    reject('Error in calling Poloniex API: ' + error)
  })
})

module.exports = router
