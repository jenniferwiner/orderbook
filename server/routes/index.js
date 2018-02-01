const express = require('express')
const router = express.Router()
const bittrex = require('node-bittrex-api')

/* GET home page. */
router.get('/', function(req, res, next) {
  getBittrexOrderBook.then(function(successValue) {
    res.send(successValue)
  }, function(rejectionReason) {
    res.send(rejectionReason)
  })
})

//
let asks = {}
let bids = {}

function addBittrexPricePoint(rate, quantity, isBid) {
  let book = isBid ? 'bids' : 'asks'
  console.log(bids)
  console.log(bids[rate])
  if (bids[rate]) {
    console.log('shouldn\'t be here yet')
    bids[rate]['combined'] += quantity
    bids[rate][0] = quantity
  } else {
    console.log('here ' + quantity)
    bids[rate] = {
      combined: quantity,
      perExchange: [quantity, 0]
    }
    console.log(bids)
  }
}

let getBittrexOrderBook = new Promise(function(resolve, reject) {
  bittrex.getorderbook({ market: 'BTC-ETH', type: 'buy' }, function(data, err) {
    if (err) {
      reject('Error in calling Bittrex API: ' + err)
    }
    data.result.forEach(pricePoint => {
      addBittrexPricePoint(pricePoint.Rate, pricePoint.Quantity, true)
    })
    resolve(bids)
  })
})

module.exports = router
