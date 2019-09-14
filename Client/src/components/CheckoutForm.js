import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import axiosApi from '../axiosApi'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';
var FormData = require('form-data')

// const useStyles = makeStyles(theme => ({
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//   },
//   dense: {
//     marginTop: theme.spacing(2),
//   },
//   menu: {
//     width: 200,
//   },
// }));
// const classes = useStyles();

function validate (state, token) {
  // we are going to store errors for all fields
  // in a signle array
  const errors = []

  if (state.email.length === 0) {
    errors.push('Email can not be empty')
  }
  if (!token){
    errors.push('Card details not provided')
  }
  return errors
}

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.state = {
      complete:false,
      email:'',
      errors:[],
      result:''
    }
  }

  handleEmailChange = (e) => {
    console.log('Email change %o', e);
    this.setState({
      email:e.target.value
    })
  }
  handleOnSubmit = async (ev) => {
    let {token} = await this.props.stripe.createToken({name: "Name"});
    const errors = validate(this.state,token)
    if (errors.length > 0) {
      this.setState({ errors })
      return
    }

    console.log("Token is %o", token)
    const data = new FormData()
    var newPayload = {
      items:this.props.addedItems,
      total:this.props.total,
      token:token.id,
      email:this.state.email
    }
    console.log('stringify %o', JSON.stringify(newPayload))
    data.append('OrderDetails', JSON.stringify(newPayload))
    console.log('Sending data as %o', data)
    axiosApi.post("/charge",newPayload)
    .then(res=>{
      console.log("Received res from server is %o",res)
      if (res.data.status === '"succeeded"') {
        console.log("Purchase Complete!")
        this.setState({
          complete:true,
          result:"Success"
        })
      } else {
        this.setState({
          complete:true,
          result:"Failed"
        })
      }
    })


  }

  render() {
    return (
      <div className="checkout">
      {this.state.errors.map(error => (
        <p> <strong><font color='red' size='3' key={error}>Error: {error} </font></strong></p>
      ))}
      {this.state.result.length > 0 && this.state.result.includes('Success') &&
        <p> <strong><font color='green' size='3' key={this.state.result}>Result: {this.state.result} </font></strong></p>}
      {this.state.result.length > 0 && this.state.result.includes('Fail') &&
        <p> <strong><font color='red' size='3' key={this.state.result}>Result: {this.state.result} </font></strong></p>}

        {this.state.complete && <h1>Purchase Complete</h1>}
        <p>Would you like to complete the purchase?</p>
        <TextField
            id="outlined-email-input"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            variant="outlined"
            required="true"
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
        <CardElement
          style={{
            base: {
              fontSize: "18px",
              color: "#32325d",
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: "antialiased",
              "::placeholder": {
                color: "#aab7c4"
              },
              invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
              }
            }
          }}
        />
        <button onClick={this.handleOnSubmit}>Send</button>
      </div>

    );
  }
}

const mapStateToProps = (state)=>{
    return{
        addedItems: state.addedItems,
        total: state.total
    }
}

export default connect(mapStateToProps, {  })(injectStripe(CheckoutForm))
