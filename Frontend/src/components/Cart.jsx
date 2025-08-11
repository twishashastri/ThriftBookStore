import React from 'react';
import api from './api';

export default function Cart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const placeOrder = async () => {
    const { data } = await api.post('/orders', { items: cart });
    localStorage.removeItem('cart');
    alert('Order placed #' + data._id);
  };

  return (
    <div>
      <h2>Cart</h2>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
      {cart.length ? <button onClick={placeOrder}>Place Order</button> : <p>No items.</p>}
    </div>
  );
}