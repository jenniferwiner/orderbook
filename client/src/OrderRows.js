import React, { Component } from 'react'

class OrderRows extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orders: []
    }
  }

  componentWillReceiveProps(props) {
    // console.log(typeof props.pagination)
    // console.log(this.props.pagination, props.pagination)

    let orders = props.orders.map((order, index) => {
      // if (index > (props.pagination - 1 * 10) && index <= props.pagination * 10) {
        return (
          <tr key={index}>
            <td>{order.rate}</td>
            <td>{order.combined}</td>
            <td>{order.perExchange[0]}</td>
            <td>{order.perExchange[1]}</td>
          </tr>
        )
      // }
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
