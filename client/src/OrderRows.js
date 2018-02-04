import React, { Component } from 'react'

class OrderRows extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orders: [],
    }
  }

  componentWillReceiveProps(props) {
    let orders = props.orders.map((order, index) => {
      if (index >= ((props.pagination - 1) * 20) && index < props.pagination * 20) {
        return (
          <tr key={index}>
            <td>{order.rate}</td>
            <td>{order.combined}</td>
            <td>{order.perExchange[0]}</td>
            <td>{order.perExchange[1]}</td>
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
