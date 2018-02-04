import React, { Component } from 'react'

class Matches extends Component {
  constructor(props) {
    super(props)

    this.state = {
      matches: []
    }
  }

  componentWillReceiveProps(props) {
      let matches = props.matches.map((match, index) => {
        return (
          <div className="Match-content" key={index}>
            <h4>Matched Rate: {match.rate}</h4><br/>
            { match['bittrexMatch'] &&
              <h5>A bid on Bittrex of quantity {match['bittrexMatch']['bid']} matches with an ask on Bittrex with quantity of {match['bittrexMatch']['ask']}</h5>
            }
            { match['poloniexMatch'] &&
              <h5>A bid on Poloniex of quantity {match['poloniexMatch']['bid']} matches with an ask on Poloniex with quantity of {match['poloniexMatch']['ask']}</h5>
            }
            { match['pBidbAskMatch'] &&
              <h5>A bid on Poloniex of quantity {match['pBidbAskMatch']['bid']} matches with an ask on Bittrex with quantity of {match['pBidbAskMatch']['ask']}</h5>
            }
            { match['bBidpAskMatch'] &&
              <h5>A bid on Bittrex of quantity {match['bBidpAskMatch']['bid']} matches with an ask on Poloniex with quantity of {match['bBidpAskMatch']['ask']}</h5>
            }
          </div>
        )
    })
    this.setState({ matches })
  }

  render() {
    return (
      <div className="text-center">
        { this.state.matches.length === 0 &&
        <h4 className="Match-title">No order matches</h4>
        }
        {this.state.matches}
      </div>
    )
  }
}

export default Matches
