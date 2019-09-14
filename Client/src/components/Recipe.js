import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import axiosApi from '../axiosApi'
import StripeCheckout from './StripeCheckout'
//import { addShipping } from './actions/cartActions'
var FormData = require('form-data')


class Recipe extends Component{
    constructor (props) {
      super(props)
      this.handleOnSubmit = this.handleOnSubmit.bind(this)
      this.state = {
        errors: [],
        result: '',
        confirm:false
      }
    }
/*
    componentDidMount(){
      axiosApi.get("public-key")
        .then((result) => {
          return result.json();
        })
        .then((json)=> {
          var publicKey = json.publicKey;
          var stripe = Stripe(publicKey);
          // Setup event handler to create a Checkout Session on submit
          document.querySelector("#submit").addEventListener("click", function(evt) {
            createCheckoutSession().then(function(data) {
              stripe
                .redirectToCheckout({
                  sessionId: data.sessionId
                })
                .then(handleResult);
            });
          });
        });
    }
    */


    handleChecked = (e)=>{
        if(e.target.checked){
            this.props.addShipping();
        }
        else{
            this.props.substractShipping();
        }
    }

    handleOnSubmit = () => {
      // Create a Checkout Session with the selected quantity

        console.log('Items are %o, Total is %o', this.props.addedItems, this.props.total)
        this.setState({
          confirm:true
        })
        /*
        var newPayload = {
          items:this.props.addedItems,
          total:this.props.total
        }

        log('Value of type is %o', newSection.interactivityType)
        const data = new FormData()
        data.append('OrderDetails', JSON.stringify(newPayload))
        axiosApi.post('create-checkout-session', data).then(res => {
        this.setState({ result: 'Successfully created Onboarding Section' })
        }).catch(error => {
          log('Failed to add Onboarding %o', error)
          this.setState({ result: `Onboarding Failed ${error}` })
        })
        */
    }

    /*
    // Handle any errors returned from Checkout

     handleResult = function(result) {
        if (result.error) {
          var displayError = document.getElementById("error-message");
          displayError.textContent = result.error.message;
        }
      };
      */

      /* Get your Stripe public key to initialize Stripe.js */

    render(){
      if (this.state.confirm) {
        return <Redirect to={"/checkout"}/>
      }

        return(
            <div className="container">
              <form onSubmit={this.handleOnSubmit}>
                <div className="collection">
                  <li className="collection-item">
                    <label>
                      <input type="checkbox" ref="shipping" onChange={this.handleChecked} />
                      <span>Shipping(+6$)</span>
                    </label>
                  </li>
                  <li className="collection-item">
                    <b>Total: {this.props.total} $</b>
                  </li>
                </div>
                <div className="checkout">
                  <input
                    type="submit"
                    value="Checkout"
                    className="waves-effect waves-light btn"
                  />
                </div>
              </form>
            </div>

        )
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
        addShipping: ()=>{dispatch({type: 'ADD_SHIPPING'})},
        substractShipping: ()=>{dispatch({type: 'SUB_SHIPPING'})}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Recipe)
