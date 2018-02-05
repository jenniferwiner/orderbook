import React, { Component } from 'react'

class OrderRows extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orders: [],
    }

    this.toFixed8 = this.toFixed8.bind(this)
  }

  toFixed8(value) {
    // make values display pretty
    return value === 0 ? '0' : value.toFixed(8)
  }

  componentWillReceiveProps(props) {
    let orders = props.orders.map((order, index) => {
      if (index >= ((props.pagination - 1) * 20) && index < props.pagination * 20) {
        return (
          <tr key={index}>
            <td>{order.rate}</td>
            <td>{this.toFixed8(order.combined)}</td>
            <td>{this.toFixed8(order.perExchange[0])}</td>
            <td>{this.toFixed8(order.perExchange[1])}</td>
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
