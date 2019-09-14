import { Elements, StripeProvider } from 'react-stripe-elements'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import CheckoutForm from './CheckoutForm'
import axiosApi from '../axiosApi'

class StripeCheckoutForm extends Component {
    constructor(props) {
      super(props)
      this.state = {
        pk: ''
      }
    }

  componentDidMount(){
    console.log('Calling server to get PK')
    axiosApi.get("public-key")
      .then((response)=> {
        var publicKey = response.data.publicKey;
        console.log('publicKey is %o', publicKey)
        this.setState({
          pk:publicKey,
          complete:false
        })
      });
  }



  render()  {
    return (
      <div>
      {this.state.pk &&
        <StripeProvider apiKey={this.state.pk}>
          <div className="container">
            <h4>Confirm Payment</h4>
            <Elements>
              <CheckoutForm />
            </Elements>
          </div>
        </StripeProvider>
        }
      </div>
    );
  }
}

export default StripeCheckoutForm;
