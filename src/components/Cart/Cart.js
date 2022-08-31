import React, { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import CartContext from "../../store/Cart-context";
import classes from "./Cart.module.css";
import Checkout from "./Checkout";

const Cart = (props) => {
   const [isCheckout, setIsCheckout] = useState(false);
   const [didSubmit, setDidSubmit] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const cardCtx = useContext(CartContext);

   const totalAmount = `$${cardCtx.totalAmount.toFixed(2)}`;
   const hasItems = cardCtx.items.length > 0;

   const cartItemRemoveHandler = (id) => {
      cardCtx.removeItem(id);
   };

   const cartItemAddHandler = (item) => {
      cardCtx.addItem({ ...item, amount: 1 });
   };

   const orderHandler = () => {
      setIsCheckout(true);
   };

   const submitOrderHandler = async (userData) => {
      setIsSubmitting(true);
      await fetch(
         "https://react-http-9c349-default-rtdb.firebaseio.com/orders.json",
         {
            method: "POST",
            body: JSON.stringify({
               user: userData,
               orderedItems: cardCtx.items,
            }),
         }
      );
      setIsSubmitting(false);
      setDidSubmit(true);
      cardCtx.clearCart();
   };

   const cartItems = (
      <ul className={classes["cart-items"]}>
         {cardCtx.items.map((item) => (
            <CartItem
               key={item.id}
               name={item.name}
               amount={item.amount}
               price={item.price}
               onRemove={cartItemRemoveHandler.bind(null, item.id)}
               onAdd={cartItemAddHandler.bind(null, item)}
            />
         ))}
      </ul>
   );

   const modalActions = (
      <div className={classes.actions}>
         <button className={classes["button--alt"]} onClick={props.onClose}>
            Close
         </button>
         {hasItems && (
            <button className={classes.button} onClick={orderHandler}>
               Order
            </button>
         )}
      </div>
   );

   const cartModalContent = (
      <React.Fragment>
         {cartItems}
         <div className={classes.total}>
            <span>Total Amount</span>
            <span>{totalAmount}</span>
         </div>
         {isCheckout && (
            <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
         )}
         {!isCheckout && modalActions}
      </React.Fragment>
   );

   const isSubmittingModalContent = <p>Sending Order Data...</p>;

   const didSubmitModalContent = (
      <React.Fragment>
         <p>Successfully Sent Order!</p>
         <div className={classes.actions}>
            <button className={classes.button} onClick={props.onClose}>
               Close
            </button>
         </div>
      </React.Fragment>
   );

   return (
      <Modal onClose={props.onClose}>
         {!isSubmitting && !didSubmit && cartModalContent}
         {isSubmitting && isSubmittingModalContent}
         {!isSubmitting && didSubmit && didSubmitModalContent}
      </Modal>
   );
};

export default Cart;
