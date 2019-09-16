import Item1 from '../images/11181038_fpx.webp'
import Item2 from '../images/3982934_fpx.webp'
import Item3 from '../images/11180762_fpx.webp'
import Item4 from '../images/11690267_fpx.webp'
import Item5 from '../images/12508031_fpx.webp'
import Item6 from '../images/1814735_fpx.webp'
import { ADD_TO_CART,REMOVE_ITEM,SUB_QUANTITY,ADD_QUANTITY,ADD_SHIPPING } from '../actions/action-types/cart-actions'


const initState = {
    items: [
        {id:1,title:'Calvin Klein', desc: "Calvin Klein Men's Kolton Loafers", price:110,img:Item1},
        {id:2,title:'Adidas', desc: "adidas Men's Superstar Casual Sneakers from Finish Line", price:80,img: Item2},
        {id:3,title:'Cole Haan', desc: "Cole Haan Men's Original Grand Stitchlite Wingtip Oxfords",price:120,img: Item3},
        {id:4,title:"Lacoste", desc: "Lacoste Men's Bayliss 119 1 U Sneakers", price:260,img:Item4},
        {id:5,title:'Nike Air Max', desc: "Nike Men's Air Max Motion 2 Casual Sneakers from Finish Line", price:84.90,img: Item5},
        {id:6,title:'Stacy Adams', desc: "Stacy Adams Men's Beau Bit Perforated Loafer",price:90,img: Item6}
    ],
    addedItems:[],
    total: 0

}
const cartReducer= (state = initState,action)=>{

    //INSIDE HOME COMPONENT
    if(action.type === ADD_TO_CART){
          let addedItem = state.items.find(item=> item.id === action.id)
          //check if the action id exists in the addedItems
         let existed_item= state.addedItems.find(item=> action.id === item.id)
         if(existed_item)
         {
            addedItem.quantity += 1
             return{
                ...state,
                 total: state.total + addedItem.price
                  }
        }
         else{
            addedItem.quantity = 1;
            //calculating the total
            let newTotal = state.total + addedItem.price

            return{
                ...state,
                addedItems: [...state.addedItems, addedItem],
                total : newTotal
            }

        }
    }
    if(action.type === REMOVE_ITEM){
        let itemToRemove= state.addedItems.find(item=> action.id === item.id)
        let new_items = state.addedItems.filter(item=> action.id !== item.id)

        //calculating the total
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantity )
        console.log(itemToRemove)
        return{
            ...state,
            addedItems: new_items,
            total: newTotal
        }
    }
    //INSIDE CART COMPONENT
    if(action.type=== ADD_QUANTITY){
        let addedItem = state.items.find(item=> item.id === action.id)
          addedItem.quantity += 1
          let newTotal = state.total + addedItem.price
          return{
              ...state,
              total: newTotal
          }
    }
    if(action.type=== SUB_QUANTITY){
        let addedItem = state.items.find(item=> item.id === action.id)
        //if the qt == 0 then it should be removed
        if(addedItem.quantity === 1){
            let new_items = state.addedItems.filter(item=>item.id !== action.id)
            let newTotal = state.total - addedItem.price
            return{
                ...state,
                addedItems: new_items,
                total: newTotal
            }
        }
        else {
            addedItem.quantity -= 1
            let newTotal = state.total - addedItem.price
            return{
                ...state,
                total: newTotal
            }
        }

    }

    if(action.type=== ADD_SHIPPING){
          return{
              ...state,
              total: state.total + 6
          }
    }

    if(action.type=== 'SUB_SHIPPING'){
        return{
            ...state,
            total: state.total - 6
        }
  }

  else{
    return state
    }

}

export default cartReducer
