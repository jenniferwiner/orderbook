import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap'
import './App.css';
import OrderRows from './OrderRows.js'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      asks: '',
      bids: ''
    }
  }

  componentWillMount() {
    console.log('mounting')
    fetch('/api', {
      method: 'GET'
    })
    .then(res => {
      return res.json().then(res => {
        console.log(res)
        this.setState({
          bids: res.bids,
          asks: res.asks
        })
      })
    })
    .catch(err => {
      console.err(err)
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
        <div>
          <h3>Matches</h3>
        </div>
        <div className="Order-tables">
          <div>
            <h3>Bids</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Price (BTC)</th>
                <th>Combined Volume (ETH)</th>
                <th>Bittrex Volume (ETH)</th>
                <th>Poloniex Volume (ETH)</th>
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
                <th>Price (BTC)</th>
                <th>Combined Volume (ETH)</th>
                <th>Bittrex Volume (ETH)</th>
                <th>Poloniex Volume (ETH)</th>
              </tr>
            </thead>
            <OrderRows orders={this.state.asks}/>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
