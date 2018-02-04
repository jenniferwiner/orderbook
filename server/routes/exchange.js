const express = require('express')
const router = express.Router()
const callExchanges = require('../utility/callExchanges')

let asks = {}
let bids = {}

router.get('/:market', callExchanges, function(req, res, next) {
  res.send(req.data)
})

module.exports = router
