import React, { Component } from 'react'

class Matches extends Component {
  constructor(props) {
    super(props)

    this.state = {
      matches: []
    }
    this.matchStatement = this.matchStatement.bind(this)
  }

  matchStatement(match, bidExchange, askExchange) {
    // display match statements with pretty quantities
    let bid = (match['bid'] === 0 ) ? '0' : (match['bid']).toFixed(8)
    let ask = (match['ask'] === 0 ) ? '0' : (match['ask']).toFixed(8)

    return `A bid on ${bidExchange} of quantity ${bid} matches with an ask on ${askExchange} with quantity of ${ask}`
  }

  componentWillReceiveProps(props) {
      let matches = props.matches.map((match, index) => {
        return (
          <div className="Match-content" key={index}>
            <h4>Matched Rate: {match.rate}</h4>
            { match['bittrexMatch'] &&
              <h5>{ this.matchStatement(match['bittrexMatch'], 'Bittrex', 'Bittrex') }</h5>
            }
            { match['poloniexMatch'] &&
              <h5>{ this.matchStatement(match['poloniexMatch'], 'Poloniex', 'Poloniex') }</h5>
            }
            { match['pBidbAskMatch'] &&
              <h5>{ this.matchStatement(match['pBidbAskMatch'], 'Poloniex', 'Bittrex') }</h5>
            }
            { match['bBidpAskMatch'] &&
              <h5>{ this.matchStatement(match['bBidpAskMatch'], 'Bittrex', 'Poloniex') }</h5>
            }
          </div>
        )
    })
    this.setState({ matches })
  }

  render() {
    return (
      <div>
        { this.state.matches.length === 0 &&
        <h4 className="Match-title">No order matches</h4>
        }
        {this.state.matches}
      </div>
    )
  }
}

export default Matches
