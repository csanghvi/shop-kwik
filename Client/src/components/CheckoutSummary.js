import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';





class CheckoutSummary extends Component{

  render(){
    return(
      <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Payment ID</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {this.props.orderDetails.map((row,index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {row.title}
            </TableCell>
            <TableCell align="right">{row.id}</TableCell>
            <TableCell align="right">{row.amount}</TableCell>
          </TableRow>
        ))}
        </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default CheckoutSummary
