import React from 'react';

// Cart component to display items added to the shopping cart
const Cart = () => {
  // Placeholder for cart items, in a real app this would come from state or context
  const cartItems = []; // Example empty cart

  return (
    <div>
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p> // Message if cart is empty
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>
      )}
      <button>Checkout</button> 
    </div>
  );
};

export default Cart;
