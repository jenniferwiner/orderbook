import React, { Component } from 'react';
import { DropdownButton, MenuItem, Button } from 'react-bootstrap'
import './App.css';
import OrderRows from './OrderRows.js'
import Matches from './Matches.js'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      market: 'BTC_ETH',
      asks: '',
      bids: '',
      matches: '',
      error: '',
    }
    this.handleExchangeRefresh = this.handleExchangeRefresh.bind(this)
  }

  componentWillMount() {
    this.callExchanges()
  }

  handleExchangeRefresh() {
    this.callExchanges()
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
        console.log(res)
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
    return (
      <div>
        <div className="App-title">
          <h1 >Order Book</h1>
        </div>
        <div>
          <h4>Choose Market</h4>
          <DropdownButton
            bsSize="large"
            title="Market"
            id="dropdown-size-large"
          >
            <MenuItem eventKey="BTC_ETH" active>BTC_ETH</MenuItem>
            <MenuItem eventKey="BTC_ETH">Another Market</MenuItem>
          </DropdownButton>
        </div>
        <Button onClick={this.handleExchangeRefresh}>Refresh Exchanges</Button>
        { !this.state.error &&
        <div>
          <Matches matches={this.state.matches}/>
          <div className="Order-tables">
            <div>
              <h3>Bids</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Bid (BTC)</th>
                  <th>Combined Volume of Bids (ETH)</th>
                  <th>Volume Bittrex (ETH)</th>
                  <th>Volume Poloniex (ETH)</th>
                </tr>
              </thead>
              <OrderRows orders={this.state.bids}/>
            </table>
          </div>
          <div className="Order-tables">
            <div>
              <h3>Asks</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Ask (BTC)</th>
                  <th>Combined Size of Asks (ETH)</th>
                  <th>Volume Bittrex (ETH)</th>
                  <th>Volume Poloniex (ETH)</th>
                </tr>
              </thead>
              <OrderRows orders={this.state.asks}/>
            </table>
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
