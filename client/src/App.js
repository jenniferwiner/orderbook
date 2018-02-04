import React, { Component } from 'react';
import { DropdownButton, MenuItem, Button, Pagination} from 'react-bootstrap'
import './App.css';
import OrderRows from './OrderRows.js'
import Matches from './Matches.js'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      market: 'BTC-ETH',
      asks: '',
      bids: '',
      matches: '',
      pageBid: 1,
      pageAsk: 1,
      error: '',
    }
    this.handleExchangeRefresh = this.handleExchangeRefresh.bind(this)
    this.handleMarketSelect = this.handleMarketSelect.bind(this)
    this.handleAskPagination = this.handleAskPagination.bind(this)
    this.handleBidPagination = this.handleBidPagination.bind(this)
  }

  componentWillMount() {
    this.callExchanges()
  }

  handleExchangeRefresh() {
    this.setState({ pageAsk: 1, pageBid: 1}, function() { this.callExchanges() })
  }

  handleMarketSelect(evt) {
    this.setState({ market: evt }, function() { this.callExchanges() })
  }

  handleAskPagination(e) {
    this.setState({ pageAsk: Number.parseInt(e.target.innerText, 10) })
  }

  handleBidPagination(e) {
    this.setState({ pageBid: Number.parseInt(e.target.innerText, 10) })
  }

  callExchanges() {
    fetch(`/api/exchange/${this.state.market}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    .then(res => {
      return res.json().then(res => {
        this.setState({
          bids: res.bids,
          asks: res.asks,
          matches: res.matches
        })
      })
    })
    .catch(err => {
      console.error(err)
    })
  }

  render() {
    let currency1 = this.state.market.substring(0,3)
    let currency2 = this.state.market.substring(4)

    // handle pagination
    let itemsAsk = []
    let itemsBid = []
    for (let number = 1; number <= 5; number++) {
      itemsAsk.push(
        <Pagination.Item key={number} active={number === this.state.pageAsk} onClick={this.handleAskPagination}>{number}</Pagination.Item>
      )
      itemsBid.push(
        <Pagination.Item key={number} active={number === this.state.pageBid} onClick={this.handleBidPagination}>{number}</Pagination.Item>
      )
    }

    return (
      <div>
        <div className="App">
          <h1 className="App-title">Order Book</h1>
          <hr className="hr"/>
          <div>
            <h4 className="Market-btn-label">Choose Market</h4>
            <DropdownButton
              className="Market-btn"
              bsSize="large"
              title={this.state.market}
              id="dropdown-size-large"
              onSelect={this.handleMarketSelect}
            >
              <MenuItem eventKey="BTC-ETH">BTC-ETH</MenuItem>
              <MenuItem eventKey="BTC-LTC">BTC-LTC</MenuItem>
              <MenuItem eventKey="BTC-DASH">BTC-DASH</MenuItem>
            </DropdownButton>
          </div>
          <Button className="Refresh-exchanges-btn" bsSize="large" onClick={this.handleExchangeRefresh}>Refresh Exchanges</Button>
        </div>
        { !this.state.error &&
        <div>
          <Matches matches={this.state.matches}/>
          <div className="Tables">
            <div className="Order-table">
              <div>
                <h3>Bids</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Bid<br/>({currency1})</th>
                    <th>Volume Combined<br/>({currency2})</th>
                    <th>Volume on Bittrex<br/>({currency2})</th>
                    <th>Volume on Poloniex<br/>({currency2})</th>
                  </tr>
                </thead>
                <OrderRows orders={this.state.bids} pagination={this.state.pageBid}/>
              </table>
              <Pagination bsSize="medium">{itemsBid}</Pagination>
            </div>
            <div className="Order-table">
              <div>
                <h3>Asks</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Ask<br/>({currency1})</th>
                    <th>Volume Combined<br/>({currency2})</th>
                    <th>Volume on Bittrex<br/>({currency2})</th>
                    <th>Volume on Poloniex<br/>({currency2})</th>
                  </tr>
                </thead>
                <OrderRows orders={this.state.asks} pagination={this.state.pageAsk}/>
              </table>
              <Pagination bsSize="medium">{itemsAsk}</Pagination>
            </div>
          </div>
        </div>
        }
        { this.state.error &&
          <h3>Cannot display order book at this time</h3>
        }
      </div>
    )
  }
}

export default App;
