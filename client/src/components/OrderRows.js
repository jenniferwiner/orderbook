import React, { Component } from 'react'

class OrderRows extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orders: [],
    }

    this.toFixedDecimals = this.toFixedDecimals.bind(this)
  }

  toFixedDecimals(value, digit) {
    // make values display pretty
    return value === 0 ? '0' : value.toFixed(digit)
  }

  componentWillReceiveProps(props) {
    let orders = props.orders.map((order, index) => {
      if (index >= ((props.pagination - 1) * 20) && index < props.pagination * 20) {
        return (
          <tr key={index}>
            <td>{this.toFixedDecimals(order.rate, 6)}</td>
            <td>{this.toFixedDecimals(order.combined, 8)}</td>
            <td>{this.toFixedDecimals(order.perExchange[0], 8)}</td>
            <td>{this.toFixedDecimals(order.perExchange[1], 8)}</td>
          </tr>
        )
      }
    })
    this.setState({orders: orders })
  }

  render() {
    return (
      <tbody>
        {this.state.orders}
      </tbody>
    )
  }
}

export default OrderRows
