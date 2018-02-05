# Welcome to Orderbook
#### Explore Where Bittrex and Poloniex Collide

```
To run:
$ PORT=3001 node server/bin/www
$ cd client
$ npm start
```


### Feature List :
- See combined and individual volumes of bids and ask from Bittrex and Poloniex's full order books
- Find matches between a bid and an ask
  - on Bittrex
  - on Poloniex
  - or, a bid on one Bittrex and an ask on Poloniex (visa versa)


### Technologies Used:
- React
- Node.js
- Express.js
- Bittrex API (public)
- Poloniex API (public)

### Future expansion:
- Prevent more than 6 refreshed/sec (to obey APIs)
- Loader prior to initial render

Jennifer Winer, 2018
