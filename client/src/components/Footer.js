import React, {Component} from 'react'
import Github from '../assets/github.svg'
import WebsiteIcon from '../assets/jenniferwiner.png'


class Footer extends Component {
  render() {
    return (
      <div>
        <div className="footer">
          <div className="text-center">
            <a className="footer-link" href="https://github.com/jenniferwiner/orderbook" target="blank"><img src={Github} className="Github-icon" alt="Github Repo"/></a>
            <a className="footer-link" href="http://jenniferwiner.com" target="blank"><img src={WebsiteIcon} className="Website-icon" alt="Jennifer Winer Website Icon"/></a>
            <br/>
            <p className="copyright">OrderBook 2018, Jennifer Winer</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Footer
