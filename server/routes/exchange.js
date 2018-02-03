const express = require('express')
const router = express.Router()
const axios = require('axios')
const bittrex = require('node-bittrex-api')

/* GET home page. */
router.get('/:market', function(req, res, next) {
  // reset
  console.log(req.params.market)
  bids = {}
  asks = {}
  matches = []

  // call APIs in promise
  Promise.all([getBittrexOrderBook(), getPoloniexOrderBook()]).then(function(values) {
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
        console.log('matches')
        if (matches.length !== 0) {
          matches.forEach(match => {
            console.log(match)
          })
        }
      }
    }
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
      asks: askValues,
      matches,
      error: ''
    })
  }, function(rejectionReason) {
    res.send(rejectionReason)
  })
})

//
let asks = {}
let bids = {}
let matches = []

function addBittrexBidPrice(rate, quantity) {
  if (bids[rate]) {
    bids[rate]['combined'] += quantity
    bids[rate]['perExchange'][0] += quantity
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
    asks[rate]['perExchange'][0] += quantity
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
    bids[rate]['perExchange'][1] += quantity
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
    asks[rate]['perExchange'][1] += quantity
  } else {
    asks[rate] = {
      rate: rate,
      combined: quantity,
      perExchange: [0, quantity]
    }
  }
}

function getBittrexOrderBook() {
  return new Promise(function(resolve, reject) {
    bittrex.getorderbook({ market: 'BTC-ETH', type: 'both' }, function(data, err) {
      if (err) {
        reject('Error in calling Bittrex API: ' + err)
      }
      let bittrexBid = data.result.buy
      let bittrexAsk = data.result.sell
      // limit data to 50 orders
      for (let i = 0; i < 50 && i < bittrexBid.length; i++) {
        addBittrexBidPrice(toFixed6Down(bittrexBid[i].Rate), bittrexBid[i].Quantity)
      }
      for (let i = 0; i < 50 && i < bittrexAsk.length; i++) {
        addBittrexAskPrice(toFixed6Down(bittrexAsk[i].Rate), bittrexAsk[i].Quantity)
      }
      resolve(bids)
    })
  })
}

function getPoloniexOrderBook() {
  return new Promise(function(resolve, reject) {
    axios({
      url: 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      responseType: 'json'
    })
    .then(function(response) {
      response.data.bids.forEach(bid => {
        addPoloniexBidPrice(toFixed6Down(bid[0]), bid[1])
      })
      response.data.asks.forEach(ask => {
        addPoloniexAskPrice(toFixed6Down(ask[0]), ask[1])
      })
      resolve(bids)
    })
    .catch(function(error) {
      reject('Error in calling Poloniex API: ' + error)
    })
  })
}

// utility method
// trucate rate to 6 digits
function toFixed6Down(rate) {
  let regex = new RegExp("(\\d+\\.\\d{6})(\\d)")
  let m = rate.toString().match(regex)

  return m ? parseFloat(m[1]) : rate.valueOf()
}

module.exports = router
