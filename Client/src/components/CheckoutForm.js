import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import axiosApi from '../axiosApi'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import CheckoutSummary from './CheckoutSummary'
import { removeItem } from '../actions/cart-actions'
import Button from '@material-ui/core/Button';



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
    this.handleRemove = this.handleRemove.bind(this)
    this.state = {
      complete:false,
      email:'',
      errors:[],
      result:'',
      orderDetails:[]
    }
  }

  handleRemove = (id)=>{
      console.log("LOoking to remove item %o", id);
      this.props.removeItem(id);
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
    var newPayload = {
      items:this.props.addedItems,
      total:this.props.total,
      token:token.id,
      email:this.state.email
    }
    axiosApi.post("/customer",newPayload)
    .then(res=>{
      console.log("Received res from server is %o",res)
      if (res.data.status === "succeeded") {
        console.log("Purchase Complete!")
        this.props.addedItems.map(item => {
          console.log('Item is %o', item)
          return this.handleRemove(item.id)
        })
        this.setState({
          complete:true,
          result:"Success",
          orderDetails: res.data.result
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

        {this.state.complete ? (
          <CheckoutSummary orderDetails = {this.state.orderDetails}
            />
        ) : (
        <div>
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
        <Button variant="contained" onClick={this.handleOnSubmit}>
          Submit Payment
        </Button>
        </div>
        )}
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

const mapDispatchToProps = (dispatch)=>{
    return{
        removeItem: (id)=>{dispatch(removeItem(id))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectStripe(CheckoutForm))
